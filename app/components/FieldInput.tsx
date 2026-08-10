import { useId, type ComponentProps } from "react";

import { FieldError } from "./FieldError";

/**
 * 박스형이 아니라 밑줄형 인풋. 라벨(13px #878787) + 8px 간격 + 1px #212121 헤어라인.
 * (Figma 2:6 · 2:9 · 2:24 · 2:28)
 */
export function FieldInput({
  label,
  error,
  id,
  className = "",
  ...props
}: { label: string; error?: string } & ComponentProps<"input">) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={inputId} className="text-[13px] text-ink-subtle">
        {label}
      </label>
      <input
        {...props}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={
          "w-full border-b border-ink bg-transparent pb-1 text-[13px] text-ink " +
          "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink " +
          className
        }
      />
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}
