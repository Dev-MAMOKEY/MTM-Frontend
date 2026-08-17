/** 인증 엔드포인트. `auth/*` 는 토큰 없이 부른다. */
import { apiFetch } from "./client.server";
import type { LoginRequest, SignupRequest, Token } from "./types";

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
