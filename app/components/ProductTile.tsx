/**
 * 제품 타일. 레이아웃(Z3 2열 · 목록 4열 · 모바일 가로 스크롤)만 다르고 컴포넌트는 동일하다.
 * 이름은 긴 한국어명도 줄바꿈 없이 한 줄로 자른다. (Figma 3:38)
 */
export function ProductTile({
  name,
  price,
  onClick,
}: {
  name: string;
  price: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-[124px] shrink-0 flex-col gap-[6px] text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <span className="h-[114px] w-[124px] border border-solid border-line bg-track" />
      <span className="w-[124px] truncate text-[12px] text-ink">{name}</span>
      <span className="text-[12px] text-ink-muted">{price}</span>
    </button>
  );
}
