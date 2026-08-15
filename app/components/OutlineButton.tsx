import type { ComponentProps } from "react";

/**
 * 프로젝트의 유일한 버튼. Primary/Secondary 구분이 없고
 * enabled/disabled 상태 교체만으로 위계를 표현한다. (Figma 2:13 · 2:32)
 */
export function OutlineButton({
  className = "",
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={
        "border border-solid bg-surface-base px-5 py-[11px] text-button " +
        "border-border-emphasis text-text-primary " +
        "disabled:border-border-strong disabled:text-text-tertiary " +
        "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-border-emphasis " +
        className
      }
    />
  );
}
