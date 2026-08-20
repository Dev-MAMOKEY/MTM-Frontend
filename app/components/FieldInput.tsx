import { useId, useState, type ComponentProps } from "react";

import { FieldError } from "./FieldError";

/**
 * 박스형이 아니라 밑줄형 인풋. 라벨(13px #878787) + 8px 간격 + 1px #212121 헤어라인.
 * (Figma 2:6 · 2:9 · 2:24 · 2:28)
 *
 * `revealable` 을 주면 오른쪽 끝에 보기/숨기기가 붙는다. 비밀번호는 가려져 있어
 * 오타를 눈으로 잡을 수 없는데, 가입은 같은 값을 두 번 쳐야 해서 특히 답답하다.
 */
export function FieldInput({
  label,
  error,
  id,
  className = "",
  revealable = false,
  type,
  ...props
}: {
  label: string;
  error?: string;
  revealable?: boolean;
} & ComponentProps<"input">) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={inputId} className="text-body text-text-tertiary">
        {label}
      </label>
      <div className="relative w-full">
        <input
          {...props}
          type={revealable && revealed ? "text" : type}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={
            "w-full border-b border-border-emphasis bg-transparent pb-1 text-body text-text-primary " +
            "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-border-emphasis " +
            // 글자가 버튼 아래로 흘러 들어가지 않게 자리를 비운다
            (revealable ? "pr-12 " : "") +
            className
          }
        />
        {revealable ? (
          <button
            type="button"
            // 폼 안이지만 제출 버튼이 아니다. 엔터로 제출할 때 이 버튼이 잡히면 안 된다.
            onClick={() => setRevealed((shown) => !shown)}
            aria-pressed={revealed}
            aria-controls={inputId}
            className="absolute bottom-1 right-0 text-[11px] text-text-tertiary focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-border-emphasis"
          >
            {revealed ? "숨기기" : "보기"}
          </button>
        ) : null}
      </div>
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}
