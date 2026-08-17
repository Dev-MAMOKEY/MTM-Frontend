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

type ApiFetchOptions = RequestInit & {
  /** 로그인 세션의 액세스 토큰. `auth/*` 를 뺀 모든 엔드포인트가 요구한다. */
  token?: string;
};

/**
 * 개발 중에만 호출 내역을 터미널에 찍는다.
 *
 * loader 는 서버에서 돌기 때문에 백엔드로 나가는 요청이 **브라우저 Network 탭에
 * 뜨지 않는다.** 여기서 찍지 않으면 어디로 뭘 보냈는지 볼 방법이 없다.
 *
 * 토큰과 요청 본문은 찍지 않는다 — 터미널 기록과 스크린샷으로 새어 나간다.
 */
const logging = process.env.NODE_ENV !== "production";

function logRequest(
  method: string,
  url: string,
  status: number,
  ms: number,
  failure?: ErrorInfo,
) {
  // 백엔드는 실패를 200 + success:false 로도 준다. 상태 코드만 찍으면 성공처럼 보인다.
  const tail = failure ? ` ${failure.code ?? "FAILED"}` : "";
  console.log(
    `→ ${method} ${url}\n${failure ? "✗" : "←"} ${status}${tail} (${Math.round(ms)}ms)`,
  );
}

export async function apiFetch<T>(
  path: string,
  { token, ...init }: ApiFetchOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const method = init.method ?? "GET";
  const startedAt = performance.now();

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // FormData 는 Content-Type 을 직접 붙이면 안 된다. 멀티파트 경계(boundary)를
      // fetch 가 만들어 붙이는데, 여기서 덮으면 경계가 빠져 서버가 본문을 못 읽는다.
      ...(typeof init.body === "string"
        ? { "Content-Type": "application/json" }
        : {}),
      ...init.headers,
    },
  });

  // 본문이 없거나(204) JSON 이 아닌 응답도 온다. 파싱 실패를 그대로 터뜨리면
  // 정작 원인인 상태 코드가 묻힌다.
  const body = (await response.json().catch(() => null)) as RsData<T> | null;
  const failed = !response.ok || body?.success === false;

  if (logging) {
    logRequest(
      method,
      url,
      response.status,
      performance.now() - startedAt,
      failed ? (body?.error ?? {}) : undefined,
    );
  }

  if (failed) {
    throw new ApiError(response.status, url, body?.error);
  }

  return body?.data as T;
}
