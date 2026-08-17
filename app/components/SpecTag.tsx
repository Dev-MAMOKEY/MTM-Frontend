/**
 * 제품 스펙을 한 줄로 보여주는 칩. 너비는 콘텐츠에 맞춘다. (Figma 3:23 · 3:25 · 9:24)
 *
 * 원래 이름은 `CarryModeTag` 였다. 백엔드 `ProductResponse` 에 착용 방식 필드가 없어
 * 착용 방식 표시를 걷어냈고, 남은 쓰임이 크기("14.2 × 11.8 IN") 하나라 이름을 옮겼다.
 */
export function SpecTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-solid border-border-strong bg-surface-base px-2 py-[3px] text-[10px] tracking-[1px] text-text-secondary">
      {children}
    </span>
  );
}
