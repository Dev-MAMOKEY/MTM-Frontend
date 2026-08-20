import type { ComponentProps } from "react";

/** 32px 원형 아이콘 버튼. 착용 화면의 × (취소)에 쓴다. (Figma 3:30) */
export function IconButton({
  className = "",
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={
        "flex size-[30px] items-center justify-center rounded-[15px] lg:size-[32px] lg:rounded-[16px] border border-solid border-border-emphasis bg-surface-track text-[11px] text-text-tertiary " +
        "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-border-emphasis " +
        className
      }
    />
  );
}
