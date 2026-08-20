import { SpecTag } from "./SpecTag";

/**
 * 제품 타일. 놓이는 자리에 따라 크기가 다르다.
 * - compact — 착용 화면 Z3. 컷 모바일 96×88 · PC 124×114 (Figma 8:1004 · 3:38)
 * - large   — 제품 목록. 컷 비율 325:299 로 칸을 채운다 (Figma 8:878)
 *
 * 크기를 인라인 style 이 아니라 클래스로 준다. style 로는 화면 폭에 따라 바꿀 수 없다.
 *
 * 이름은 긴 한국어명도 줄바꿈 없이 한 줄로 자른다.
 */
const SIZES = {
  compact: {
    tile: "w-[96px] lg:w-[124px]",
    cut: "h-[88px] lg:h-[114px]",
  },
  large: {
    tile: "w-full",
    cut: "aspect-[325/299]",
  },
} as const;

export function ProductTile({
  name,
  price,
  wearType,
  imageUrl,
  size = "compact",
  onClick,
}: {
  name: string;
  /** 통화가 없으면 값이 없다. 자리를 비우지 않고 표시만 비운다. */
  price?: string;
  /** 착용 방식. 필터가 없는 목록에서 제품을 구분하는 단서다(UX 감사 U6). */
  wearType?: string;
  imageUrl?: string;
  size?: keyof typeof SIZES;
  onClick?: () => void;
}) {
  const { tile, cut } = SIZES[size];

  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "flex shrink-0 flex-col gap-[6px] text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-border-emphasis " +
        tile
      }
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          // 제품명이 바로 아래 붙어 있어 alt 로 되풀이하면 스크린리더가 두 번 읽는다.
          alt=""
          loading="lazy"
          className={
            "w-full border border-solid border-border-default bg-surface-base object-cover " +
            cut
          }
        />
      ) : (
        // 이미지가 없어도 자리는 지킨다 — 없다고 격자가 흐트러지면 훑기가 더 어려워진다
        <span
          className={
            "w-full border border-solid border-border-default bg-surface-track " +
            cut
          }
        />
      )}
      <span className="w-full truncate text-caption text-text-primary">
        {name}
      </span>
      {/* 시안 순서는 제품명 → 착용 방식 → 가격이다 */}
      {wearType ? (
        <span>
          <SpecTag>{wearType}</SpecTag>
        </span>
      ) : null}
      <span className="text-caption text-text-secondary">{price ?? ""}</span>
    </button>
  );
}
