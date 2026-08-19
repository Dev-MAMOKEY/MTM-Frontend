/**
 * 착용 이미지 엔드포인트.
 *
 * 생성은 **동기**이고 **멱등**이다 — 같은 (기준 이미지, 제품) 조합이 이미 있으면
 * 모델을 다시 부르지 않고 저장된 것을 즉시 준다. 제품을 왔다 갔다 눌러보는
 * 비교 흐름이 값싼 이유가 이것이다.
 */
import { apiFetch } from "./client.server";
import type { WornImage, WornImageCreateRequest } from "./types";

/** 최신순으로 온다. */
export function getWornImages(token: string, baseImageId: number) {
  return apiFetch<WornImage[]>(
    `/api/v1/base-images/${baseImageId}/worn-images`,
    { token },
  );
}

export function createWornImage(
  token: string,
  baseImageId: number,
  body: WornImageCreateRequest,
) {
  return apiFetch<WornImage>(
    `/api/v1/base-images/${baseImageId}/worn-images`,
    { token, method: "POST", body: JSON.stringify(body) },
  );
}
