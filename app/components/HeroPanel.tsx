/**
 * 로그인 계열 화면을 채우는 사진. (Figma 8:356 · 8:373 · 29:69)
 *
 * 폼만 있는 흰 화면은 이 서비스가 무엇을 파는지 말하지 않는다. 가방을 든 사람이
 * 먼저 보이는 것이 「내 사진 위에서 입어본다」는 값어치를 설명한다.
 *
 * 넓은 화면에서는 왼쪽 기둥, 좁은 화면에서는 폼 위의 띠다. 좁은 화면용으로는
 * 세로로 긴 컷(29:69)을 따로 쓴다 — 가로로 긴 사진을 좁은 띠에 넣으면 사람이
 * 잘려 무엇을 파는지 알 수 없게 된다.
 *
 * 넓은 화면 폭은 시안의 639/1440 을 비율로 옮겼다. 고정 px 로 두면 폼을 밀어낸다.
 */
export function HeroPanel() {
  return (
    <>
      <img
        src="/hero-mobile.png"
        alt=""
        className="h-[220px] w-full shrink-0 object-cover object-top lg:hidden"
      />
      <div className="hidden h-full w-[44.4%] shrink-0 overflow-hidden bg-surface-muted lg:block">
        <img src="/hero.png" alt="" className="size-full object-cover" />
      </div>
    </>
  );
}
