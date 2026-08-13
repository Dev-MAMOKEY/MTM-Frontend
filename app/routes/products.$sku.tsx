import { useState } from "react";
import { Link } from "react-router";

import { CarryModeTag } from "../components/CarryModeTag";
import { Header } from "../components/Header";
import { OutlineButton } from "../components/OutlineButton";
import type { Route } from "./+types/products.$sku";

export function meta({}: Route.MetaArgs) {
  return [{ title: "제품 상세 · MTM" }];
}

/** 상세 조회 API는 ⚠동작경계 B3 — 엔드포인트가 없어 목 데이터로 그린다. */
const detail = {
  name: "Aren Zip Hobo in Visetos",
  price: "$1,250",
  carryMode: "한쪽 어깨",
  cutCount: 6,
  dimensions: [
    { label: "가로", value: "14.2 in  (36.1 cm)" },
    { label: "세로", value: "11.8 in  (30.0 cm)" },
    { label: "깊이", value: "5.9 in  (15.0 cm)" },
    // 스트랩이 없는 제품(128개 중 37개)은 이 줄 자체가 빠진다
    { label: "스트랩", value: "45.1 ~ 57.7 in" },
  ],
  details: [
    "조절 가능한 가죽 숄더 스트랩",
    "전면 지퍼 포켓",
    "로고 브래스 플레이트",
    "지퍼 클로저 · 내부 지퍼 포켓",
    "본체: Visetos 모노그램 캔버스",
    "트림: 나파 가죽 · 24K 골드 도금 하드웨어",
  ],
};

export default function ProductDetail() {
  const [selectedCut, setSelectedCut] = useState(0);

  return (
    <div className="flex min-h-screen flex-col bg-surface-base">
      <Header />
      <div className="w-full border-b border-solid border-border-default px-6 py-[10px]">
        <Link to="/products" className="text-caption text-text-tertiary">
          ← 제품 목록
        </Link>
      </div>

      <div className="flex w-full flex-1 items-start">
        {/* 좌 — 제품 컷 */}
        <div className="flex h-full min-w-px flex-1 flex-col gap-3 border-r border-solid border-border-default px-10 py-7">
          <div className="flex h-[560px] w-full flex-col items-center justify-center border border-solid border-border-default bg-surface-track text-[11px] text-text-tertiary">
            제품 컷
          </div>
          {/* 컷이 1장뿐이면 이 줄을 감춘다 — 빈 줄을 남기지 않는다 */}
          {detail.cutCount > 1 ? (
            <div className="flex gap-2">
              {Array.from({ length: detail.cutCount }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`제품 컷 ${i + 1}`}
                  aria-pressed={selectedCut === i}
                  onClick={() => setSelectedCut(i)}
                  className={
                    "size-[52px] bg-surface-track focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-border-emphasis " +
                    (selectedCut === i
                      ? "border-2 border-solid border-border-emphasis"
                      : "border border-solid border-border-default")
                  }
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* 우 — 스펙. 크기를 입어보기 버튼 바로 위에 둔다 */}
        <div className="flex h-full w-[380px] shrink-0 flex-col gap-[10px] p-7">
          <h1 className="text-[20px] font-bold text-text-primary">{detail.name}</h1>
          <p className="text-body text-text-secondary">{detail.price}</p>
          <div>
            <CarryModeTag>{detail.carryMode}</CarryModeTag>
          </div>

          <div className="h-[10px]" />
          <h2 className="text-[14px] font-medium text-text-secondary">크기</h2>
          {detail.dimensions.map((row) => (
            <div key={row.label} className="flex gap-4 text-caption">
              <span className="w-[50px] text-text-tertiary">{row.label}</span>
              <span className="whitespace-pre text-text-secondary">{row.value}</span>
            </div>
          ))}

          <div className="h-[8px]" />
          <div>
            <OutlineButton type="button">이 제품 입어보기</OutlineButton>
          </div>

          <div className="h-3" />
          <h2 className="text-[14px] font-medium text-text-secondary">상세</h2>
          <ul className="text-caption text-text-secondary">
            {detail.details.map((line) => (
              <li key={line}>· {line}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
