import { OutlineButton } from "./OutlineButton";
import { ProgressBar } from "./ProgressBar";

/**
 * 카드 셸은 하나고 우측 영역만 상태별로 바뀐다.
 * 원본과 기준 이미지를 나란히 두는 이유는 "내 얼굴이 맞나"를 대조로 판정하기 때문이다.
 * (Figma 8:12 완료 · 8:26 생성 중 · 8:35 실패)
 */
export type PhotoCardState = "done" | "generating" | "failed";

export function PhotoCard({
  state,
  meta,
  lookCount = 0,
}: {
  state: PhotoCardState;
  meta: string;
  lookCount?: number;
}) {
  return (
    <article className="flex w-[440px] flex-col gap-[10px] border border-solid border-line p-[14px]">
      <div className="flex w-full items-start gap-[10px]">
        <div className="flex h-[200px] min-w-px flex-1 flex-col items-center justify-center border border-solid border-line bg-track text-[11px] text-ink-subtle">
          원본 사진
        </div>
        {state === "done" ? (
          <div className="flex h-[200px] min-w-px flex-1 flex-col items-center justify-center border border-solid border-line bg-track text-[11px] text-ink-subtle">
            기준 이미지
          </div>
        ) : (
          <div className="flex h-[200px] min-w-px flex-1 flex-col items-center justify-center gap-2 border border-dashed border-line-strong bg-surface-muted text-[11px] text-ink-subtle">
            {state === "generating" ? (
              <ProgressBar
                value={70}
                label="기준 이미지를 만드는 중"
                width={120}
              />
            ) : (
              <>
                만들지 못했습니다
                <OutlineButton type="button">다시 시도</OutlineButton>
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-[11px] text-ink-subtle">{meta}</p>

      {state === "done" ? (
        <>
          <div className="flex items-center gap-2">
            <OutlineButton type="button">기준 이미지 다시 만들기</OutlineButton>
            {/* 삭제는 엔드포인트 미정(⚠B1) — 자리만 둔다 */}
            <OutlineButton type="button" disabled>
              삭제
            </OutlineButton>
          </div>
          {/* 파괴적 동작이므로 무엇이 사라지는지 누르기 전에 알린다 */}
          <p className="w-full border-l-2 border-solid border-ink pl-2 text-[11px] text-ink-muted">
            다시 만들면 이 사진으로 만든 착용 이미지 {lookCount}장이 함께
            삭제됩니다.
          </p>
        </>
      ) : null}
    </article>
  );
}
