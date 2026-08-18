/** 사진첩 엔드포인트. */
import { apiFetch } from "./client.server";
import type { Photo } from "./types";

/** 최신순으로 온다 — 화면에서 다시 정렬하지 않는다. */
export function getPhotos(token: string) {
  return apiFetch<Photo[]>("/api/v1/photos", { token });
}

/** 사진과 함께 그 사진으로 만든 기준 이미지·착용 이미지도 지워진다. 되돌릴 수 없다. */
export function deletePhoto(token: string, photoId: number) {
  return apiFetch<void>(`/api/v1/photos/${photoId}`, {
    token,
    method: "DELETE",
  });
}

export function uploadPhoto(token: string, file: File) {
  const body = new FormData();
  body.append("file", file);

  return apiFetch<Photo>("/api/v1/photos", { token, method: "POST", body });
}
