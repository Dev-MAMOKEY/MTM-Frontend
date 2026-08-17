/**
 * 제품 타일. 놓이는 자리에 따라 크기가 다르다.
 * - compact — 착용 화면 Z3. 컷 124×114 (Figma 3:38)
 * - large   — 제품 목록. 컷 325×299 (Figma 10:12)
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
  imageUrl,
  size = "compact",
  onClick,
}: {
  name: string;
  /** 통화가 없으면 값이 없다. 자리를 비우지 않고 표시만 비운다. */
  price?: string;
  imageUrl?: string;
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
      {imageUrl ? (
        <img
          src={imageUrl}
          // 제품명이 바로 아래 붙어 있어 alt 로 되풀이하면 스크린리더가 두 번 읽는다.
          alt=""
          loading="lazy"
          style={{ width, height }}
          // object-contain 은 컷 비율이 칸과 달라 좌우에 여백을 남긴다. 컷 자체가
          // 옅은 회색 배경을 물고 있어 그 여백이 어떤 색이든 띠처럼 잘려 보인다.
          // cover 로 칸을 채운다 — 컷 가장자리가 잘리지만 여백이 아예 없어진다.
          className="border border-solid border-border-default bg-surface-base object-cover"
        />
      ) : (
        // 이미지가 없어도 자리는 지킨다 — 없다고 격자가 흐트러지면 훑기가 더 어려워진다
        <span
          style={{ width, height }}
          className="border border-solid border-border-default bg-surface-track"
        />
      )}
      <span style={{ width }} className="truncate text-caption text-text-primary">
        {name}
      </span>
      <span className="text-caption text-text-secondary">{price ?? ""}</span>
    </button>
  );
}
