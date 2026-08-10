/** 섹션 라벨. Medium 15px #545454. (Figma 2:23) */
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[15px] font-medium text-ink-muted">{children}</h2>;
}
