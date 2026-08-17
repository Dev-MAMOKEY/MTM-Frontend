/**
 * 백엔드 API 호출용 얇은 fetch 래퍼. loader · action 에서만 쓴다.
 *
 * 베이스 URL 결합, 공통 응답 봉투(`RsData`) 벗기기, 실패를 `ApiError` 로 변환하는
 * 세 가지만 한다. 재시도·캐시·토큰 갱신은 필요해지는 슬라이스에서 붙인다.
 */
import { API_BASE_URL } from "./env.server";
import type { ErrorInfo, RsData } from "./types";

/**
 * 호출이 실패한 경우. HTTP 상태가 2xx 가 아니거나, 2xx 여도 봉투의 `success` 가
 * false 인 경우를 함께 덮는다 — 부르는 쪽에서는 둘을 구분할 이유가 없다.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly url: string,
    /** 백엔드가 코드·메시지를 준 경우에만 채워진다. */
    readonly info?: ErrorInfo,
  ) {
    super(info?.message ?? `API ${status} ${url}`);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      // 인증 헤더는 로그인 슬라이스(#2)에서 여기에 붙인다.
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  // 본문이 없거나(204) JSON 이 아닌 응답도 온다. 파싱 실패를 그대로 터뜨리면
  // 정작 원인인 상태 코드가 묻힌다.
  const body = (await response.json().catch(() => null)) as RsData<T> | null;

  if (!response.ok || body?.success === false) {
    throw new ApiError(response.status, url, body?.error);
  }

  return body?.data as T;
}
