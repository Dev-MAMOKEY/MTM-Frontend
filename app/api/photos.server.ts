/** 사진첩 엔드포인트. */
import type { Auth } from "./session.server";
import type { Photo } from "./types";

/** 최신순으로 온다 — 화면에서 다시 정렬하지 않는다. */
export function getPhotos(auth: Auth) {
  return auth.fetch<Photo[]>("/api/v1/photos");
}

/** 사진과 함께 그 사진으로 만든 기준 이미지·착용 이미지도 지워진다. 되돌릴 수 없다. */
export function deletePhoto(auth: Auth, photoId: number) {
  return auth.fetch<void>(`/api/v1/photos/${photoId}`, {
    method: "DELETE",
  });
}

export function uploadPhoto(auth: Auth, file: File) {
  const body = new FormData();
  body.append("file", file);

  return auth.fetch<Photo>("/api/v1/photos", { method: "POST", body });
}
