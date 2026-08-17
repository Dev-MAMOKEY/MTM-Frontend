import { redirect, useNavigate, useRevalidator } from "react-router";

import { ApiError } from "../api/client.server";
import { toListedProducts, type ListedProduct } from "../api/product";
import { getProducts } from "../api/products.server";
import { requireAccessToken } from "../api/session.server";
import { EmptyState } from "../components/EmptyState";
import { Header } from "../components/Header";
import { OutlineButton } from "../components/OutlineButton";
import { PageTitle } from "../components/PageTitle";
import { ProductTile } from "../components/ProductTile";
import type { Route } from "./+types/products._index";

export function meta({}: Route.MetaArgs) {
  return [{ title: "제품 · MTM" }];
}

/** 한 페이지 32개(4열 × 8줄). 백엔드 기본값은 20이라 명시해서 보낸다. */
const PAGE_SIZE = 32;

/** `?page=` 는 사용자가 손으로 고칠 수 있다. 숫자가 아니거나 0 이하면 1로 본다. */
function parsePage(value: string | null) {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

export async function loader({ request }: Route.LoaderArgs) {
  const token = await requireAccessToken(request);
  const page = parsePage(new URL(request.url).searchParams.get("page"));

  try {
    const result = await getProducts(token, { page, size: PAGE_SIZE });

    // 범위를 넘는 페이지는 빈 목록으로 돌아온다. 그대로 그리면 제품이 있는데도
    // "등록된 제품이 없습니다" 가 뜬다. 첫 페이지로 돌려보낸다.
    if (result.totalPages && page > result.totalPages) {
      throw redirect("/products");
    }

    return {
      products: toListedProducts(result.content ?? []),
      page,
      totalPages: result.totalPages ?? 1,
      totalElements: result.totalElements ?? 0,
      error: null,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      // 목록 하나 못 불러온 것으로 화면 전체를 죽이지 않는다. 헤더는 남기고
      // 목록 자리에만 실패를 알린다 — 다른 화면으로 나갈 길까지 막을 이유가 없다.
      return {
        products: [] as ListedProduct[],
        page,
        totalPages: 1,
        totalElements: 0,
        error: error.message,
      };
    }

    throw error;
  }
}

export default function Products({ loaderData }: Route.ComponentProps) {
  const { products, page, totalPages, totalElements, error } = loaderData;
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  // 페이지를 주소에 둔다 — 뒤로 가기가 동작하고 링크로 공유할 수 있다.
  const goToPage = (n: number) => navigate(n === 1 ? "." : `?page=${n}`);

  return (
    <div className="flex min-h-screen flex-col bg-surface-base">
      <Header />
      <main className="flex w-full flex-col gap-[22px] px-10 py-6">
        <div className="flex w-full items-baseline justify-between">
          <PageTitle>제품</PageTitle>
          {error ? null : (
            <p className="text-caption text-text-tertiary">{totalElements}개</p>
          )}
        </div>

        {error ? (
          // 막다른 길을 만들지 않는다 — 실패 화면에는 항상 다음 행동을 준다
          <EmptyState
            action={
              <OutlineButton
                type="button"
                disabled={revalidator.state === "loading"}
                onClick={() => revalidator.revalidate()}
              >
                다시 시도
              </OutlineButton>
            }
          >
            제품을 불러오지 못했습니다.
            <br />
            {error}
          </EmptyState>
        ) : products.length === 0 ? (
          <EmptyState>아직 등록된 제품이 없습니다.</EmptyState>
        ) : (
          <div className="grid grid-cols-4 gap-x-5 gap-y-[26px]">
            {products.map((product) => (
              <ProductTile
                key={product.id}
                size="large"
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                onClick={() => navigate(`/products/${product.id}`)}
              />
            ))}
          </div>
        )}

        {/* 새 컴포넌트를 만들지 않는다 — OutlineButton + 텍스트 라벨 조합.
            현재 페이지는 색이 아니라 굵기와 밑줄로 표시한다.
            한 페이지에 다 들어가면 페이지네이션 자체를 감춘다. */}
        {totalPages > 1 ? (
          <nav
            aria-label="페이지"
            className="flex w-full items-center justify-center gap-[10px] border-t border-solid border-border-default pt-4"
          >
            <OutlineButton
              type="button"
              disabled={page === 1}
              onClick={() => goToPage(page - 1)}
            >
              ← 이전
            </OutlineButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                aria-current={n === page ? "page" : undefined}
                onClick={() => goToPage(n)}
                className={
                  "text-caption tracking-[1px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-border-emphasis " +
                  (n === page
                    ? "font-medium text-text-primary underline"
                    : "font-normal text-text-tertiary")
                }
              >
                {n}
              </button>
            ))}
            <OutlineButton
              type="button"
              disabled={page === totalPages}
              onClick={() => goToPage(page + 1)}
            >
              다음 →
            </OutlineButton>
          </nav>
        ) : null}
      </main>
    </div>
  );
}
