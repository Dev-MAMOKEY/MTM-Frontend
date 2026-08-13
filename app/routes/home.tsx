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

/** Figma 시안이 그린 착용 화면의 여섯 가지 상태. */
type LookState =
  | "ready" // 3-2  정상
  | "no-photo" // 5-2  사진 없음
  | "generating-base" // 5-69 기준 이미지 생성 중
  | "no-product" // 6-2  제품 미선택
  | "generating" // 6-65 착용 이미지 생성 중
  | "failed"; // 7-2  생성 실패

export default function Home() {
  // 생성 요청은 슬라이스 5·6에서 붙인다. 지금은 상태만 그린다.
  const [state] = useState<LookState>("ready");

  const hasPhoto = state !== "no-photo";

  // 흐림은 존마다 다르다. 착용 이미지 생성 중에는 Z3를 흐리지 않는다 —
  // 다른 제품을 눌러 요청을 교체할 수 있어야 비교 흐름이 끊기지 않는다.
  // 반대로 기준 이미지가 없으면 착용 이미지를 만들 수 없으므로 Z3를 흐린다.
  const dimStage = state === "no-photo";
  const dimProducts = state === "no-photo" || state === "generating-base";

  return (
    <div className="flex h-screen flex-col bg-surface-base">
      <Header />

      {/* Z1 · 내 사진 */}
      <section className="flex w-full flex-col gap-[10px] border-b border-solid border-border-default p-[14px]">
        <div className="flex w-full items-start justify-between text-text-tertiary">
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
        ) : null}
        {state === "generating-base" ? (
          <ProgressBar
            value={42}
            label="기준 이미지를 만드는 중"
            width={240}
            className="items-start gap-[6px]"
          />
        ) : null}
        {!hasPhoto ? (
          <EmptyState
            className="w-full py-[30px]"
            action={<OutlineButton type="button">사진 올리기</OutlineButton>}
          >
            아직 올린 사진이 없습니다
          </EmptyState>
        ) : null}
      </section>

      <div className="flex w-full flex-1 items-start overflow-hidden">
        {/* Z2 · LookStage */}
        <section
          className={
            "flex h-full min-w-px flex-1 flex-col gap-[10px] border-r border-solid border-border-default p-5 " +
            (dimStage ? "opacity-35" : "")
          }
        >
          <LookStage state={state} />
        </section>

        {/* Z3 · 제품 */}
        <section
          className={
            "flex h-full w-[300px] shrink-0 flex-col gap-[10px] overflow-y-auto p-5 " +
            (dimProducts ? "opacity-35" : "")
          }
        >
          <div className="flex w-full items-start justify-between text-text-tertiary">
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
  // 기준 이미지가 아직 없으므로 제품명·태그·액션을 감춘다
  if (state === "generating-base") {
    return (
      <EmptyState className="w-full flex-1">
        기준 이미지가 만들어지면 여기에 표시됩니다
      </EmptyState>
    );
  }

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
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-[10px] border border-solid border-border-default bg-surface-track">
        <ProgressBar value={55} label="착용 이미지를 만드는 중" />
      </div>
    );
  }

  // ready — 조작 요소는 전부 무대 바깥 아래에 둔다
  return (
    <>
      <div className="flex w-full min-h-px flex-1 flex-col items-center justify-center border border-solid border-border-default bg-surface-track" />
      <p className="text-body text-text-primary">Aren Zip Hobo in Visetos</p>
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
