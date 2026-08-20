import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import {
  authContext,
  commitAuthState,
  readAuthState,
} from "./api/session.server";
import type { Route } from "./+types/root";
import "./app.css";

/**
 * 요청 하나가 도는 동안 토큰을 들고 있는다.
 *
 * 백엔드가 401 을 주면 `requireAuth` 가 리프레시 토큰으로 새 토큰을 받는데,
 * 새 토큰은 **쿠키를 다시 구워야** 다음 요청부터 쓸 수 있다. Set-Cookie 를 붙일
 * 자리는 응답이라 loader 안에서는 붙일 수 없다 — 여기서 응답을 받아 붙인다.
 *
 * 모든 화면이 root 아래에 있으므로 여기 한 번만 두면 전부 덮인다.
 */
export const middleware: Route.MiddlewareFunction[] = [
  async ({ request, context }, next) => {
    const state = await readAuthState(request);
    context.set(authContext, state);

    const response = await next();

    if (state.refreshed) {
      // append 다. 로그인·로그아웃처럼 응답이 이미 쿠키를 굽는 경우와 겹치지 않게.
      response.headers.append(
        "Set-Cookie",
        await commitAuthState(request, state),
      );
    }

    return response;
  },
];

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "문제가 발생했습니다";
  let details = "예상치 못한 오류가 발생했습니다.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "오류";
    details =
      error.status === 404
        ? "요청하신 페이지를 찾을 수 없습니다."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
