/**
 * 로그인 세션. 토큰은 **httpOnly 쿠키**에만 둔다.
 *
 * localStorage 에 두면 두 가지가 걸린다 — 스크립트로 읽히고(XSS 한 방에 털린다),
 * loader 는 서버에서 도는데 서버가 localStorage 를 못 읽어서 첫 렌더에 토큰이 없다.
 * 쿠키 세션이면 브라우저 JS 는 토큰을 볼 수 없고 loader 는 요청마다 받아 쓴다.
 */
import {
  createContext,
  createCookieSessionStorage,
  redirect,
  type RouterContextProvider,
} from "react-router";

import { reissue } from "./auth.server";
import { apiFetch, ApiError, type ApiFetchOptions } from "./client.server";

/**
 * 쿠키 서명용 비밀키. 없으면 아무나 세션 쿠키를 위조할 수 있으므로
 * 값 없이 뜨는 것을 막는다 — `API_BASE_URL` 과 같은 이유다.
 */
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error(
    "환경변수 SESSION_SECRET 이 없다. `cp .env.example .env` 후 값을 채운다.");
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

type Tokens = { accessToken: string; refreshToken: string };

/**
 * 요청 하나가 도는 동안의 토큰 상태.
 *
 * 액세스 토큰이 만료돼 새로 받으면 **쿠키를 다시 구워야** 다음 요청부터 쓸 수 있는데,
 * 그 Set-Cookie 를 붙일 자리는 응답이다. 그래서 middleware 가 이 값을 들고 있다가
 * 응답이 만들어진 뒤에 붙인다. `refreshed` 가 그 표시다.
 */
type AuthState = {
  tokens: Tokens | null;
  refreshed: boolean;
};

export const authContext = createContext<AuthState>();

/** middleware 가 요청 시작에 부른다. 쿠키에서 토큰을 꺼내 요청 동안 들고 있을 상태를 만든다. */
export async function readAuthState(request: Request): Promise<AuthState> {
  const session = await getSession(request);
  const accessToken = session.get("accessToken");
  const refreshToken = session.get("refreshToken");

  return {
    tokens:
      typeof accessToken === "string" && typeof refreshToken === "string"
        ? { accessToken, refreshToken }
        : null,
    refreshed: false,
  };
}

/** middleware 가 응답 직전에 부른다. 재발급이 있었을 때만 쿠키를 다시 굽는다. */
export async function commitAuthState(request: Request, state: AuthState) {
  const session = await getSession(request);

  if (state.tokens) {
    session.set("accessToken", state.tokens.accessToken);
    session.set("refreshToken", state.tokens.refreshToken);
  }

  return storage.commitSession(session);
}

/** 로그인 성공 후 토큰을 세션에 담고 이동시킨다. */
export async function createUserSession(
  request: Request,
  tokens: Tokens,
  redirectTo: string) {
  const session = await getSession(request);
  session.set("accessToken", tokens.accessToken);
  session.set("refreshToken", tokens.refreshToken);

  return redirect(redirectTo, {
    headers: { "Set-Cookie": await storage.commitSession(session) },
  });
}

function loginRedirect(request: Request) {
  const { pathname, search } = new URL(request.url);
  const redirectTo = `${pathname}${search}`;
  const params = new URLSearchParams(
    redirectTo === "/" ? undefined : { redirectTo });

  return redirect(`/login?${params}`);
}

/** 로그인 여부 판단용. 로그인 화면이 이미 들어온 사람을 돌려보낼 때 쓴다. */
export function hasSession(context: Readonly<RouterContextProvider>) {
  return context.get(authContext).tokens != null;
}

/**
 * 백엔드를 부를 수 있는 인증 핸들. loader·action 은 토큰 문자열 대신 이것을 받는다.
 *
 * 401 을 받으면 리프레시 토큰으로 새 토큰을 받아 **같은 요청을 한 번만** 다시 보낸다.
 * 만료를 미리 점치지 않는다 — 토큰의 exp 를 읽어 판단하면 서버 시계가 어긋날 때
 * 오판하고, 비밀번호 변경처럼 exp 가 남았는데 서버가 거절하는 경우를 놓친다.
 * 서버가 거절했다는 사실만 보고 움직인다.
 */
export type Auth = {
  fetch<T>(path: string, init?: Omit<ApiFetchOptions, "token">): Promise<T>;
};

/**
 * 로그인이 필요한 화면에서 쓴다. 토큰이 없으면 로그인 화면으로 보낸다.
 * 원래 가려던 곳을 `redirectTo` 로 넘겨 로그인 후 그 자리로 돌아오게 한다.
 */
export function requireAuth(
  request: Request,
  context: Readonly<RouterContextProvider>): Auth {
  const state = context.get(authContext);

  if (!state.tokens) {
    throw loginRedirect(request);
  }

  return {
    async fetch(path, init) {
      try {
        return await apiFetch(path, {
          ...init,
          token: state.tokens!.accessToken,
        });
      } catch (error) {
        if (!(error instanceof ApiError) || error.status !== 401) {
          throw error;
        }

        // 재발급 후 한 번만 다시 보낸다. 그러고도 401 이면 토큰 문제가 아니다.
        return await apiFetch(path, {
          ...init,
          token: await refresh(request, state),
        });
      }
    },
  };
}

/** 리프레시 토큰으로 액세스 토큰을 새로 받는다. 실패하면 세션을 버린다. */
async function refresh(request: Request, state: AuthState) {
  try {
    const next = await reissue({ refreshToken: state.tokens!.refreshToken });

    if (!next.accessToken) {
      throw new Error("재발급 응답에 액세스 토큰이 없다");
    }

    state.tokens = {
      accessToken: next.accessToken,
      // 재발급은 액세스 토큰만 바꾼다 — "리프레시 토큰은 그대로 유지된다".
      // 응답이 돌려주지 않을 수 있으므로 없으면 쓰던 것을 그대로 둔다.
      refreshToken: next.refreshToken ?? state.tokens!.refreshToken,
    };
    state.refreshed = true;

    return state.tokens.accessToken;
  } catch (error) {
    // 리프레시 토큰까지 만료됐거나 서버가 거절했다. 더 해볼 것이 없으니 세션을 버린다.
    if (error instanceof ApiError) {
      throw await logout(request);
    }

    throw error;
  }
}

/** 세션 쿠키를 지운다. 백엔드 로그아웃 엔드포인트는 없다(⚠B2) — 토큰을 버리는 것으로 끝낸다. */
export async function logout(request: Request) {
  const session = await getSession(request);

  return redirect("/login", {
    headers: { "Set-Cookie": await storage.destroySession(session) },
  });
}
