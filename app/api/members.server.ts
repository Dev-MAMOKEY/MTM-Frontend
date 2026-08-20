/** 회원 엔드포인트. 토큰으로 식별되므로 회원 id 를 따로 보내지 않는다. */
import type { Auth } from "./session.server";
import type { BodyInfoRequest, Member } from "./types";

export function getMe(auth: Auth) {
  return auth.fetch<Member>("/api/v1/members/me");
}

/**
 * 신체 정보를 아직 한 번도 저장하지 않은 계정인지 본다.
 *
 * 이 서비스가 파는 것이 *크기 감*이라 키·몸무게 없이는 착용 이미지가 성립하지 않는다.
 * 그래서 필수값이고, 없으면 착용 화면에 들여보내지 않는다.
 */
export function hasBodyInfo(member: Member) {
  return member.heightCm != null && member.weightKg != null;
}

/**
 * 키·몸무게를 저장한다. 둘 다 필수이고, 값이 이미 있으면 교체된다.
 *
 * 부분 수정용 PATCH 도 있지만 쓰지 않는다 — 이 화면은 두 값을 함께 받아 함께 보낸다.
 * 하나만 보내는 경로가 없으니 엔드포인트를 둘로 나눌 이유도 없다.
 */
export function saveBodyInfo(auth: Auth, body: BodyInfoRequest) {
  return auth.fetch<Member>("/api/v1/members/me/body-info", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
