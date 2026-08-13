import { Link } from "react-router";

/**
 * 로그인 후 전역 크롬. 좌측 MTM(→ /), 우측 내 정보 · 로그아웃.
 * 로그인 전(`/login`·`/signup`)에는 렌더하지 않는다.
 *
 * 다크 서피스다 — 흰 화면 위에서 헤더만 검게 잘려 브랜드 바 역할을 한다.
 * PC 1440×46 · padding 14×24. (Figma 8-32)
 */
export function Header() {
  return (
    <header className="flex items-center justify-between bg-surface-header px-6 py-[14px] text-text-inverse">
      <Link to="/" className="text-[15px] font-bold tracking-[1px]">
        MTM
      </Link>
      <nav className="flex items-center gap-3 text-[11px]">
        <Link to="/profile">내 정보</Link>
        {/* 로그아웃 동작은 엔드포인트 미정(⚠B2) — 자리만 둔다 */}
        <span>로그아웃</span>
      </nav>
    </header>
  );
}
