import { Link } from "react-router";

/**
 * 로그인 후 전역 크롬. 좌측 MTM(→ /), 우측 내 정보 · 로그아웃.
 * 로그인 전(`/login`·`/signup`)에는 렌더하지 않는다. (Figma 2:18)
 */
export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-solid border-border-strong bg-surface-base px-6 py-[14px]">
      <Link to="/" className="text-[15px] font-bold tracking-[1px] text-text-primary">
        MTM
      </Link>
      <nav className="flex items-center gap-3 text-[11px] text-text-tertiary">
        <Link to="/profile">내 정보</Link>
        {/* 로그아웃 동작은 엔드포인트 미정(⚠B2) — 자리만 둔다 */}
        <span>로그아웃</span>
      </nav>
    </header>
  );
}
