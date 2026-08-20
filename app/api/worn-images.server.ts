/**
 * 착용 이미지 엔드포인트.
 *
 * 생성은 **동기**이고 **멱등**이다 — 같은 (기준 이미지, 제품) 조합이 이미 있으면
 * 모델을 다시 부르지 않고 저장된 것을 즉시 준다. 제품을 왔다 갔다 눌러보는
 * 비교 흐름이 값싼 이유가 이것이다.
 */
import type { Auth } from "./session.server";
import type { WornImage, WornImageCreateRequest } from "./types";

/** 최신순으로 온다. */
export function getWornImages(auth: Auth, baseImageId: number) {
  return auth.fetch<WornImage[]>(
    `/api/v1/base-images/${baseImageId}/worn-images`,
    );
}

export function createWornImage(
  auth: Auth,
  baseImageId: number,
  body: WornImageCreateRequest) {
  return auth.fetch<WornImage>(
    `/api/v1/base-images/${baseImageId}/worn-images`,
    { method: "POST", body: JSON.stringify(body) });
}

/**
 * 이미 만든 (기준 이미지, 제품) 조합을 새로 만들어 **교체**한다.
 *
 * 생성(`createWornImage`)은 멱등이라 같은 조합이면 저장된 것을 그대로 준다.
 * 새 그림을 원할 때는 이쪽을 불러야 한다. 다시 만들 대상이 없으면 실패한다.
 */
export function regenerateWornImage(
  auth: Auth,
  baseImageId: number,
  body: WornImageCreateRequest) {
  return auth.fetch<WornImage>(
    `/api/v1/base-images/${baseImageId}/worn-images/regenerate`,
    { method: "POST", body: JSON.stringify(body) });
}
