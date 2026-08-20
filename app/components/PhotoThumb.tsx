/**
 * 사진 썸네일. 모바일 56 · PC 64. (Figma 8:981 · 3:11)
 * 원래 주석: 64px 정사각형 사진 썸네일. 선택되면 2px #212121 테두리로 바뀐다.
 * (Figma 3:11 선택됨 · 3:12 기본 · 3:14 업로드 슬롯)
 */
export function PhotoThumb({
  selected = false,
  label,
  imageUrl,
  onClick,
}: {
  selected?: boolean;
  label: string;
  imageUrl?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={selected}
      className={
        "size-[56px] shrink-0 overflow-hidden lg:size-[64px] bg-surface-track focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-border-emphasis " +
        (selected
          ? "border-2 border-solid border-border-emphasis"
          : "border border-solid border-border-default")
      }
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          className="size-full object-cover"
        />
      ) : null}
    </button>
  );
}

/** 사진 띠 끝의 업로드 슬롯. 점선 + 옅은 배경으로 사진과 구분한다. */
export function PhotoUploadSlot({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex size-[56px] shrink-0 lg:size-[64px] flex-col items-center justify-center border border-dashed border-border-strong bg-surface-track text-[11px] text-text-tertiary focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-border-emphasis"
    >
      + 올리기
    </button>
  );
}
