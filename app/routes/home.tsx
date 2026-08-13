import { useState } from "react";
import { Link } from "react-router";

import { CarryModeTag } from "../components/CarryModeTag";
import { EmptyState } from "../components/EmptyState";
import { Header } from "../components/Header";
import { IconButton } from "../components/IconButton";
import { OutlineButton } from "../components/OutlineButton";
import { PhotoThumb, PhotoUploadSlot } from "../components/PhotoThumb";
import { ProductTile } from "../components/ProductTile";
import { ProgressBar } from "../components/ProgressBar";
import { products, totalProductCount } from "../mocks/products";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MTM" },
    { name: "description", content: "내 사진 위에서 MCM 제품을 입어봅니다." },
  ];
}

/** Figma 시안이 그린 착용 화면의 다섯 가지 상태. */
type LookState =
  | "ready" // 3-2  정상
  | "no-photo" // 5-2  사진 없음
  | "no-product" // 6-2  제품 미선택
  | "generating" // 6-65 착용 이미지 생성 중
  | "failed"; // 7-2  생성 실패

export default function Home() {
  // 생성 요청은 슬라이스 6에서 붙인다. 지금은 상태만 그린다.
  const [state] = useState<LookState>("ready");

  const hasPhoto = state !== "no-photo";

  return (
    <div className="flex h-screen flex-col bg-white">
      <Header />

      {/* Z1 · 내 사진 */}
      <section className="flex w-full flex-col gap-[10px] border-b border-solid border-line p-[14px]">
        <div className="flex w-full items-start justify-between text-ink-subtle">
          <h2 className="text-[10px] font-medium tracking-[1px]">내 사진</h2>
          <Link to="/photos" className="text-[11px]">
            전체 보기 →
          </Link>
        </div>
        {hasPhoto ? (
          <div className="flex items-center gap-2">
            <PhotoThumb selected label="사진 1" />
            <PhotoThumb label="사진 2" />
            <PhotoThumb label="사진 3" />
            <PhotoUploadSlot />
          </div>
        ) : (
          <EmptyState
            className="w-full py-[30px]"
            action={<OutlineButton type="button">사진 올리기</OutlineButton>}
          >
            아직 올린 사진이 없습니다
          </EmptyState>
        )}
      </section>

      {/* Z2 + Z3 — 사진이 없으면 통째로 흐려 길을 하나만 남긴다 */}
      <div
        className={
          "flex w-full flex-1 items-start overflow-hidden " +
          (hasPhoto ? "" : "opacity-35")
        }
      >
        {/* Z2 · LookStage */}
        <section className="flex h-full min-w-px flex-1 flex-col gap-[10px] border-r border-solid border-line p-5">
          <LookStage state={state} />
        </section>

        {/* Z3 · 제품 — 생성 중에도 흐려지지 않고 조작 가능하다 */}
        <section className="flex h-full w-[300px] shrink-0 flex-col gap-[10px] overflow-y-auto p-5">
          <div className="flex w-full items-start justify-between text-ink-subtle">
            <h2 className="text-[10px] font-medium tracking-[1px]">
              제품 {totalProductCount}
            </h2>
            <Link to="/products" className="text-[11px]">
              전체 →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductTile
                key={product.sku}
                name={product.name}
                price={product.price}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function LookStage({ state }: { state: LookState }) {
  if (state === "no-product") {
    return (
      <EmptyState className="w-full flex-1">
        <p>오른쪽에서 제품을 골라보세요</p>
        <p>(모바일: 아래에서)</p>
      </EmptyState>
    );
  }

  if (state === "failed") {
    return (
      <EmptyState
        className="w-full flex-1"
        action={<OutlineButton type="button">다시 시도</OutlineButton>}
      >
        <p>착용 이미지를 만들지 못했습니다</p>
        <p>잠시 후 다시 시도해 주세요</p>
      </EmptyState>
    );
  }

  if (state === "generating") {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-[10px] border border-solid border-line bg-track">
        <ProgressBar value={55} label="착용 이미지를 만드는 중" />
      </div>
    );
  }

  // ready — 조작 요소는 전부 무대 바깥 아래에 둔다
  return (
    <>
      <div className="flex w-full min-h-px flex-1 flex-col items-center justify-center border border-solid border-line bg-track" />
      <p className="text-[13px] text-ink">Aren Zip Hobo in Visetos</p>
      <div className="flex gap-[6px]">
        <CarryModeTag>한쪽 어깨</CarryModeTag>
        <CarryModeTag>14.2 × 11.8 IN</CarryModeTag>
      </div>
      <div className="flex items-center gap-[10px]">
        <OutlineButton type="button">다시 만들기</OutlineButton>
        <IconButton type="button" aria-label="선택 해제">
          ×
        </IconButton>
      </div>
    </>
  );
}
