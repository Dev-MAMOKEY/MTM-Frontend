/**
 * 로그인 세션. 토큰은 **httpOnly 쿠키**에만 둔다.
 *
 * localStorage 에 두면 두 가지가 걸린다 — 스크립트로 읽히고(XSS 한 방에 털린다),
 * loader 는 서버에서 도는데 서버가 localStorage 를 못 읽어서 첫 렌더에 토큰이 없다.
 * 쿠키 세션이면 브라우저 JS 는 토큰을 볼 수 없고 loader 는 요청마다 받아 쓴다.
 */
import { createCookieSessionStorage, redirect } from "react-router";

/**
 * 쿠키 서명용 비밀키. 없으면 아무나 세션 쿠키를 위조할 수 있으므로
 * 값 없이 뜨는 것을 막는다 — `API_BASE_URL` 과 같은 이유다.
 */
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error(
    "환경변수 SESSION_SECRET 이 없다. `cp .env.example .env` 후 값을 채운다.",
  );
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "mtm_session",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secrets: [sessionSecret],
    // 로컬은 http 라 secure 를 켜면 쿠키가 아예 안 붙는다.
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  },
});

function getSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

/** 로그인 성공 후 토큰을 세션에 담고 이동시킨다. */
export async function createUserSession(
  request: Request,
  tokens: { accessToken: string; refreshToken: string },
  redirectTo: string,
) {
  const session = await getSession(request);
  session.set("accessToken", tokens.accessToken);
  session.set("refreshToken", tokens.refreshToken);

  return redirect(redirectTo, {
    headers: { "Set-Cookie": await storage.commitSession(session) },
  });
}

/** 로그인 여부 판단용. 없으면 `undefined`. */
export async function getAccessToken(request: Request) {
  const session = await getSession(request);
  const token = session.get("accessToken");

  return typeof token === "string" ? token : undefined;
}

/**
 * 로그인이 필요한 화면에서 쓴다. 토큰이 없으면 로그인 화면으로 보낸다.
 * 원래 가려던 곳을 `redirectTo` 로 넘겨 로그인 후 그 자리로 돌아오게 한다.
 */
export async function requireAccessToken(request: Request) {
  const token = await getAccessToken(request);

  if (!token) {
    const { pathname, search } = new URL(request.url);
    const redirectTo = `${pathname}${search}`;
    const params = new URLSearchParams(
      redirectTo === "/" ? undefined : { redirectTo },
    );

    throw redirect(`/login?${params}`);
  }

  return token;
}

/** 세션 쿠키를 지운다. 백엔드 로그아웃 엔드포인트는 없다(⚠B2) — 토큰을 버리는 것으로 끝낸다. */
export async function logout(request: Request) {
  const session = await getSession(request);

  return redirect("/login", {
    headers: { "Set-Cookie": await storage.destroySession(session) },
  });
}
