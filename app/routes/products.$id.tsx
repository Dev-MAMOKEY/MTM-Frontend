import { useState } from "react";
import { Link } from "react-router";

import { ApiError } from "../api/client.server";
import { toProductDetail, type ProductDetailView } from "../api/product";
import { getProduct } from "../api/products.server";
import { requireAccessToken } from "../api/session.server";
import { EmptyState } from "../components/EmptyState";
import { Header } from "../components/Header";
import { OutlineButton } from "../components/OutlineButton";
import { SpecTag } from "../components/SpecTag";
import type { Route } from "./+types/products.$id";

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: `${loaderData?.detail?.name ?? "제품 상세"} · MTM` }];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const token = await requireAccessToken(request);
  const id = Number(params.id);

  // 주소는 손으로 고칠 수 있다. 숫자가 아니면 백엔드에 물어볼 것도 없다.
  if (!Number.isInteger(id) || id <= 0) {
    return { detail: null, error: "없는 제품입니다." };
  }

  try {
    const detail = toProductDetail(await getProduct(token, id));

    return detail
      ? { detail, error: null }
      : { detail: null, error: "없는 제품입니다." };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        detail: null,
        error:
          error.status === 404 ? "없는 제품입니다." : "제품을 불러오지 못했습니다.",
      };
    }

    throw error;
  }
}

export default function ProductDetail({ loaderData }: Route.ComponentProps) {
  const { detail, error } = loaderData;

  return (
    <div className="flex min-h-screen flex-col bg-surface-base">
      <Header />
      <div className="w-full border-b border-solid border-border-default px-6 py-[10px]">
        <Link to="/products" className="text-caption text-text-tertiary">
          ← 제품 목록
        </Link>
      </div>

      {detail ? (
        <Detail detail={detail} />
      ) : (
        // 상단 「← 제품 목록」이 살아 있지만, 실패 화면에서 다음 행동을 눈에 띄게 둔다
        <main className="px-10 py-7">
          <EmptyState
            action={
              <Link to="/products">
                <OutlineButton type="button">제품 목록으로</OutlineButton>
              </Link>
            }
          >
            {error}
          </EmptyState>
        </main>
      )}
    </div>
  );
}

function Detail({ detail }: { detail: ProductDetailView }) {
  const [selectedCut, setSelectedCut] = useState(detail.initialCut);
  const cut = detail.cuts[selectedCut];

  return (
    <div className="flex w-full flex-1 items-start">
      {/* 좌 — 제품 컷 */}
      <div className="flex h-full min-w-px flex-1 flex-col gap-3 border-r border-solid border-border-default px-10 py-7">
        {/* 컷 원본이 거의 정사각이다. 가로로만 넓은 칸에 object-contain 을 쓰면 짧은 쪽인
            높이에 맞춰져서, 칸을 아무리 넓혀도 이미지는 커지지 않고 좌우 여백만 늘어난다.
            칸을 정사각으로 두고 폭 상한을 줘서 이미지가 실제로 커지게 한다. */}
        {cut ? (
          <img
            src={cut.imageUrl}
            alt=""
            className="mx-auto aspect-square w-full max-w-[720px] border border-solid border-border-default bg-surface-base object-contain"
          />
        ) : (
          <div className="mx-auto flex aspect-square w-full max-w-[720px] flex-col items-center justify-center border border-solid border-border-default bg-surface-track text-[11px] text-text-tertiary">
            제품 컷
          </div>
        )}
        {/* 컷이 1장뿐이면 이 줄을 감춘다 — 빈 줄을 남기지 않는다 */}
        {detail.cuts.length > 1 ? (
          <div className="mx-auto flex w-full max-w-[720px] gap-2">
            {detail.cuts.map((thumb, i) => (
              <button
                key={thumb.id}
                type="button"
                aria-label={`제품 컷 ${i + 1}`}
                aria-pressed={selectedCut === i}
                onClick={() => setSelectedCut(i)}
                className={
                  "size-[52px] bg-surface-base focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-border-emphasis " +
                  (selectedCut === i
                    ? "border-2 border-solid border-border-emphasis"
                    : "border border-solid border-border-default")
                }
              >
                <img
                  src={thumb.imageUrl}
                  alt=""
                  loading="lazy"
                  className="size-full object-contain"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* 우 — 스펙. 크기를 입어보기 버튼 바로 위에 둔다 */}
      <div className="flex h-full w-[380px] shrink-0 flex-col gap-[10px] p-7">
        <h1 className="text-[20px] font-bold text-text-primary">{detail.name}</h1>
        {detail.price ? (
          <p className="text-body text-text-secondary">{detail.price}</p>
        ) : null}
        {detail.wearType ? (
          <div>
            <SpecTag>{detail.wearType}</SpecTag>
          </div>
        ) : null}

        {detail.dimensions.length > 0 ? (
          <>
            <div className="h-[10px]" />
            <h2 className="text-[14px] font-medium text-text-secondary">크기</h2>
            {detail.dimensions.map((row) => (
              <div key={row.label} className="flex gap-4 text-caption">
                <span className="w-[50px] text-text-tertiary">{row.label}</span>
                <span className="whitespace-pre text-text-secondary">
                  {row.value}
                </span>
              </div>
            ))}
          </>
        ) : null}

        <div className="h-[8px]" />
        <div>
          {/* 착용 이미지 생성은 슬라이스 6에서 붙인다 */}
          <OutlineButton type="button">이 제품 입어보기</OutlineButton>
        </div>

        {detail.description ? (
          <>
            <div className="h-3" />
            <h2 className="text-[14px] font-medium text-text-secondary">상세</h2>
            <Description text={detail.description} />
          </>
        ) : null}
      </div>
    </div>
  );
}

/**
 * 시안은 글머리 기호 목록인데 API 는 `description` 문자열 하나를 준다.
 * 줄이 여러 개면 시안대로 목록으로, 한 문단이면 문단 그대로 그린다 —
 * 한 줄짜리에 `·` 를 붙이면 목록도 문장도 아닌 것이 된다.
 */
function Description({ text }: { text: string }) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return <p className="text-caption text-text-secondary">{text}</p>;
  }

  return (
    <ul className="text-caption text-text-secondary">
      {lines.map((line) => (
        <li key={line}>· {line}</li>
      ))}
    </ul>
  );
}
