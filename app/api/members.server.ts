/** 회원 엔드포인트. 토큰으로 식별되므로 회원 id 를 따로 보내지 않는다. */
import { apiFetch } from "./client.server";
import type { BodyInfoRequest, Member } from "./types";

export function getMe(token: string) {
  return apiFetch<Member>("/api/v1/members/me", { token });
}

/**
 * 키·몸무게를 저장한다. 둘 다 필수이고, 값이 이미 있으면 교체된다.
 *
 * 부분 수정용 PATCH 도 있지만 쓰지 않는다 — 이 화면은 두 값을 함께 받아 함께 보낸다.
 * 하나만 보내는 경로가 없으니 엔드포인트를 둘로 나눌 이유도 없다.
 */
export function saveBodyInfo(token: string, body: BodyInfoRequest) {
  return apiFetch<Member>("/api/v1/members/me/body-info", {
    token,
    method: "POST",
    body: JSON.stringify(body),
  });
}
