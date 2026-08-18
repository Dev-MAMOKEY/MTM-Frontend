import { useState } from "react";
import { useFetcher } from "react-router";

import { OutlineButton } from "./OutlineButton";
import { ProgressBar } from "./ProgressBar";

/**
 * 카드 셸은 하나고 우측 영역만 상태별로 바뀐다.
 * 원본과 기준 이미지를 나란히 두는 이유는 "내 얼굴이 맞나"를 대조로 판정하기 때문이다.
 * (Figma 8:12 완료 · 8:26 생성 중 · 8:35 실패)
 */
export type PhotoCardState = "none" | "done" | "generating" | "failed";

export function PhotoCard({
  photoId,
  state,
  meta,
  imageUrl,
  baseImageUrl,
  lookCount = 0,
}: {
  photoId: number;
  /** `none` — 기준 이미지를 아직 만들지 않았다. */
  state: PhotoCardState;
  meta: string;
  imageUrl?: string;
  baseImageUrl?: string;
  lookCount?: number;
}) {
  return (
    <article className="flex w-[440px] flex-col gap-[10px] border border-solid border-border-default p-[14px]">
      <div className="flex w-full items-start gap-[10px]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            className="h-[200px] min-w-px flex-1 border border-solid border-border-default bg-surface-base object-cover"
          />
        ) : (
          <div className="flex h-[200px] min-w-px flex-1 flex-col items-center justify-center border border-solid border-border-default bg-surface-track text-[11px] text-text-tertiary">
            원본 사진
          </div>
        )}
        {state === "none" ? (
          <div className="flex h-[200px] min-w-px flex-1 flex-col items-center justify-center border border-dashed border-border-strong bg-surface-muted text-[11px] text-text-tertiary">
            기준 이미지 없음
          </div>
        ) : state === "done" && baseImageUrl ? (
          <img
            src={baseImageUrl}
            alt=""
            loading="lazy"
            className="h-[200px] min-w-px flex-1 border border-solid border-border-default bg-surface-base object-cover"
          />
        ) : state === "done" ? (
          <div className="flex h-[200px] min-w-px flex-1 flex-col items-center justify-center border border-solid border-border-default bg-surface-track text-[11px] text-text-tertiary">
            기준 이미지
          </div>
        ) : (
          <div className="flex h-[200px] min-w-px flex-1 flex-col items-center justify-center gap-2 border border-dashed border-border-strong bg-surface-muted text-[11px] text-text-tertiary">
            {state === "generating" ? (
              <ProgressBar
                value={70}
                label="기준 이미지를 만드는 중"
                width={120}
                className="items-center gap-2"
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

      <p className="text-[11px] text-text-tertiary">{meta}</p>

      <DeleteControl photoId={photoId} />

      {state === "done" ? (
        <>
          <div className="flex items-center gap-2">
            <OutlineButton type="button">기준 이미지 다시 만들기</OutlineButton>
          </div>
          {/* 파괴적 동작이므로 무엇이 사라지는지 누르기 전에 알린다 */}
          <p className="w-full border-l-2 border-solid border-border-emphasis pl-2 text-[11px] text-text-secondary">
            다시 만들면 이 사진으로 만든 착용 이미지 {lookCount}장이 함께
            삭제됩니다.
          </p>
        </>
      ) : null}
    </article>
  );
}

/**
 * 삭제는 되돌릴 수 없고 기준 이미지·착용 이미지까지 함께 지운다.
 * 확인 단계를 **구조로** 넣는다 — 한 번 누르면 무엇이 사라지는지 알리고,
 * 실제 삭제는 두 번째 누름에서 일어난다.
 *
 * `window.confirm` 을 쓰지 않는 이유: 시안의 타이포와 어긋나고, 무엇이 함께
 * 지워지는지를 카드 안에서 보여줄 수 없다.
 */
function DeleteControl({ photoId }: { photoId: number }) {
  const fetcher = useFetcher();
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <div>
        <OutlineButton type="button" onClick={() => setConfirming(true)}>
          삭제
        </OutlineButton>
      </div>
    );
  }

  return (
    <fetcher.Form method="post" className="flex flex-col gap-2">
      <input type="hidden" name="intent" value="delete" />
      <input type="hidden" name="photoId" value={photoId} />
      <p className="w-full border-l-2 border-solid border-border-emphasis pl-2 text-[11px] text-text-secondary">
        이 사진과, 이 사진으로 만든 기준 이미지·착용 이미지가 모두 삭제됩니다.
        되돌릴 수 없습니다.
      </p>
      <div className="flex items-center gap-2">
        <OutlineButton type="submit" disabled={fetcher.state !== "idle"}>
          {fetcher.state !== "idle" ? "삭제 중…" : "삭제"}
        </OutlineButton>
        <OutlineButton type="button" onClick={() => setConfirming(false)}>
          취소
        </OutlineButton>
      </div>
    </fetcher.Form>
  );
}
