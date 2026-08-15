/**
 * 오류·헬프 텍스트. 현 단계에서는 색으로 구분하지 않는다 —
 * 별도의 오류색 없이 #545454 12px로만 표기한다. (Figma 2:12 · 2:27)
 */
export function FieldError({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <p id={id} className="text-caption text-text-secondary">
      {children}
    </p>
  );
}
