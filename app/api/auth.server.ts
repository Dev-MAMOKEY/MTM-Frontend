/** 인증 엔드포인트. `auth/*` 는 토큰 없이 부른다. */
import { apiFetch } from "./client.server";
import type {
  LoginRequest,
  SignupRequest,
  Token,
  TokenReissueRequest,
} from "./types";

/** 액세스 토큰이 만료됐을 때 리프레시 토큰으로 새 쌍을 받는다. */
export function reissue(body: TokenReissueRequest) {
  return apiFetch<Token>("/api/v1/auth/reissue", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function login(body: LoginRequest) {
  return apiFetch<Token>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function signup(body: SignupRequest) {
  return apiFetch<string>("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
