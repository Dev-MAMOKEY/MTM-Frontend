import { CarryModeTag } from "./CarryModeTag";

/**
 * 제품 타일. 놓이는 자리에 따라 크기와 태그 노출이 다르다.
 * - compact — 착용 화면 Z3. 컷 124×114, 태그 없음 (Figma 3:38)
 * - large   — 제품 목록. 컷 325×299, 태그 있음 (Figma 10:12)
 *
 * 이름은 긴 한국어명도 줄바꿈 없이 한 줄로 자른다.
 */
const SIZES = {
  compact: { width: 124, height: 114 },
  large: { width: 325, height: 299 },
} as const;

export function ProductTile({
  name,
  price,
  carryMode,
  size = "compact",
  onClick,
}: {
  name: string;
  price: string;
  carryMode?: string;
  size?: keyof typeof SIZES;
  onClick?: () => void;
}) {
  const { width, height } = SIZES[size];

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width }}
      className="flex shrink-0 flex-col gap-[6px] text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-border-emphasis"
    >
      <span
        style={{ width, height }}
        className="border border-solid border-border-default bg-surface-track"
      />
      <span style={{ width }} className="truncate text-caption text-text-primary">
        {name}
      </span>
      {carryMode ? (
        <span>
          <CarryModeTag>{carryMode}</CarryModeTag>
        </span>
      ) : null}
      <span className="text-caption text-text-secondary">{price}</span>
    </button>
  );
}
