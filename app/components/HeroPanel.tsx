/**
 * 로그인 계열 화면 왼쪽을 채우는 사진. (Figma 8:356 · 8:373)
 *
 * 폼만 있는 흰 화면은 이 서비스가 무엇을 파는지 말하지 않는다. 가방을 든 사람이
 * 먼저 보이는 것이 「내 사진 위에서 입어본다」는 값어치를 설명한다.
 *
 * 폭은 시안의 639/1440 을 비율로 옮겼다. 고정 px 로 두면 좁은 화면에서 폼을 밀어낸다.
 */
export function HeroPanel() {
  return (
    <div className="hidden h-full w-[44.4%] shrink-0 overflow-hidden bg-surface-muted lg:block">
      <img
        src="/hero.png"
        alt=""
        className="size-full object-cover"
      />
    </div>
  );
}
