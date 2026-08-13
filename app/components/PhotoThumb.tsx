/**
 * 64px 정사각형 사진 썸네일. 선택되면 2px #212121 테두리로 바뀐다.
 * (Figma 3:11 선택됨 · 3:12 기본 · 3:14 업로드 슬롯)
 */
export function PhotoThumb({
  selected = false,
  label,
  onClick,
}: {
  selected?: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={selected}
      className={
        "size-[64px] shrink-0 bg-surface-track focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-border-emphasis " +
        (selected
          ? "border-2 border-solid border-border-emphasis"
          : "border border-solid border-border-default")
      }
    />
  );
}

/** 사진 띠 끝의 업로드 슬롯. 점선 + 옅은 배경으로 사진과 구분한다. */
export function PhotoUploadSlot({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex size-[64px] shrink-0 flex-col items-center justify-center border border-dashed border-border-default bg-surface-muted text-[11px] text-text-tertiary focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-border-emphasis"
    >
      + 올리기
    </button>
  );
}
