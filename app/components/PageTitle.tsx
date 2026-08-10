/** 페이지 타이틀. Bold 24px. (Figma 2:22) */
export function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-[24px] font-bold text-ink">{children}</h1>;
}
