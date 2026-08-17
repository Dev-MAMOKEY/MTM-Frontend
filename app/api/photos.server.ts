/** 사진첩 엔드포인트. */
import { apiFetch } from "./client.server";
import type { Photo } from "./types";

/** 최신순으로 온다 — 화면에서 다시 정렬하지 않는다. */
export function getPhotos(token: string) {
  return apiFetch<Photo[]>("/api/v1/photos", { token });
}

export function uploadPhoto(token: string, file: File) {
  const body = new FormData();
  body.append("file", file);

  return apiFetch<Photo>("/api/v1/photos", { token, method: "POST", body });
}
