/**
 * 기준 이미지 엔드포인트.
 *
 * 생성은 **동기**다 — 다 만들고 나서 응답이 온다. 진행률을 물을 방법이 없고,
 * 요청이 진행 중인지로만 「만드는 중」을 안다.
 */
import { apiFetch } from "./client.server";
import type { BaseImage } from "./types";

/** 최신순으로 온다. */
export function getBaseImages(token: string) {
  return apiFetch<BaseImage[]>("/api/v1/base-images", { token });
}

export function createBaseImage(token: string, photoId: number) {
  return apiFetch<BaseImage>(`/api/v1/photos/${photoId}/base-image`, {
    token,
    method: "POST",
  });
}

/** 다시 만들면 이 기준 이미지로 만든 착용 이미지도 함께 사라진다. */
export function regenerateBaseImage(token: string, photoId: number) {
  return apiFetch<BaseImage>(
    `/api/v1/photos/${photoId}/base-image/regenerate`,
    { token, method: "POST" },
  );
}
