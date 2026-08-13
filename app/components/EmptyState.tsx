/**
 * 빈 상태·실패 상태 자리. 점선 테두리 + 중앙 정렬 안내 + (선택) 다음 행동 버튼.
 * 막다른 길을 만들지 않기 위해 실패 화면에는 항상 action을 준다.
 * (Figma 5:65 · 6:19 · 7:19)
 */
export function EmptyState({
  children,
  action,
  className = "",
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "flex flex-col items-center justify-center gap-[14px] border border-dashed border-line-strong bg-surface-muted text-center text-[12px] text-ink-subtle " +
        className
      }
    >
      <div>{children}</div>
      {action}
    </div>
  );
}
