import { Form, Link } from "react-router";

/**
 * 로그인 후 전역 크롬. 좌측 MTM(→ /), 우측 내 정보 · 로그아웃.
 * 로그인 전(`/login`·`/signup`)에는 렌더하지 않는다.
 *
 * 다크 서피스다 — 흰 화면 위에서 헤더만 검게 잘려 브랜드 바 역할을 한다.
 * PC 1440×46 · padding 14×24. (Figma 8-32)
 */
export function Header() {
  return (
    // 바는 화면 끝까지 이어지고 안쪽 내용만 본문 폭에 맞춘다. 다크 바가 중간에서
    // 끊기면 브랜드 바 역할을 못 한다.
    <header className="w-full bg-surface-header text-text-inverse">
      <div className="mx-auto flex w-full max-w-page items-center justify-between px-6 py-[14px]">
      <Link to="/" className="text-[15px] font-bold tracking-[1px]">
        MTM
      </Link>
      <nav className="flex items-center gap-3 text-[11px]">
        <Link to="/profile">내 정보</Link>
        {/* 백엔드 로그아웃 엔드포인트는 없다(⚠B2). 세션 쿠키를 지우는 것으로 끝낸다. */}
        <Form method="post" action="/logout">
          <button type="submit" className="text-[11px] text-text-inverse">
            로그아웃
          </button>
        </Form>
      </nav>
      </div>
    </header>
  );
}
