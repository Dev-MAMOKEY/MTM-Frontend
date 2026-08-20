/**
 * 제품 스펙을 한 줄로 보여주는 칩. 너비는 콘텐츠에 맞춘다. (Figma 3:23 · 3:25 · 9:24)
 *
 * 착용 방식("한쪽 어깨")과 크기("14.2 × 11.8 IN") 두 가지 콘텐츠로 쓰인다.
 *
 * 원래 이름은 `CarryModeTag` 였다. 백엔드에 착용 방식 필드가 없던 때(#28) 크기 표시만
 * 남아 이름을 옮겼고, 이후 `wearType` 이 생겨 착용 방식이 상세 화면에 돌아왔다(#34).
 * 두 쓰임을 다 덮는 이름이라 그대로 둔다.
 */
export function SpecTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-solid border-border-strong bg-surface-base px-2 py-[3px] text-[10px] tracking-[1px] text-text-secondary">
      {children}
    </span>
  );
}
