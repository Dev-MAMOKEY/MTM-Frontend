/**
 * 착용 방식("한쪽 어깨")과 크기("14.2 × 11.8 IN") 두 가지 콘텐츠로 재사용된다.
 * 너비는 콘텐츠에 맞춘다. (Figma 3:23 · 3:25 · 9:24)
 */
export function CarryModeTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-solid border-line-strong bg-white px-2 py-[3px] text-[10px] tracking-[1px] text-ink-muted">
      {children}
    </span>
  );
}
