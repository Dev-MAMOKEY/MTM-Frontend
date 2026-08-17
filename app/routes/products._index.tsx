import { useState } from "react";
import { useNavigate } from "react-router";

import { Header } from "../components/Header";
import { OutlineButton } from "../components/OutlineButton";
import { PageTitle } from "../components/PageTitle";
import { ProductTile } from "../components/ProductTile";
import {
  products,
  totalPages,
  totalProductCount,
} from "../mocks/products";
import type { Route } from "./+types/products._index";

export function meta({}: Route.MetaArgs) {
  return [{ title: "제품 · MTM" }];
}

export default function Products() {
  const navigate = useNavigate();
  // 목록 API는 슬라이스 1에서 붙인다. 지금은 페이지 상태만 그린다.
  const [page, setPage] = useState(1);

  return (
    <div className="flex min-h-screen flex-col bg-surface-base">
      <Header />
      <main className="flex w-full flex-col gap-[22px] px-10 py-6">
        <div className="flex w-full items-baseline justify-between">
          <PageTitle>제품</PageTitle>
          <p className="text-caption text-text-tertiary">{totalProductCount}개</p>
        </div>

        <div className="grid grid-cols-4 gap-x-5 gap-y-[26px]">
          {products.map((product) => (
            <ProductTile
              key={product.sku}
              size="large"
              name={product.name}
              price={product.price}
              onClick={() => navigate(`/products/${product.sku}`)}
            />
          ))}
        </div>

        {/* 새 컴포넌트를 만들지 않는다 — OutlineButton + 텍스트 라벨 조합.
            현재 페이지는 색이 아니라 굵기와 밑줄로 표시한다. */}
        <nav
          aria-label="페이지"
          className="flex w-full items-center justify-center gap-[10px] border-t border-solid border-border-default pt-4"
        >
          <OutlineButton
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← 이전
          </OutlineButton>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              aria-current={n === page ? "page" : undefined}
              onClick={() => setPage(n)}
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
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            다음 →
          </OutlineButton>
        </nav>
      </main>
    </div>
  );
}
