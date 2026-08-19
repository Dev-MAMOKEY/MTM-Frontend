/**
 * MTM 워드마크. (Figma 23:52 검정 · 23:58 흰색)
 *
 * 두 벌은 같은 벡터에 색만 다르다. 다크 헤더 위에서는 흰색이 아니면 보이지 않아
 * 색을 CSS 로 바꾸는 대신 시안이 내보낸 두 파일을 그대로 쓴다.
 *
 * 시안 크기는 37×18 이다. 너비·높이를 둘 다 고정해 원본 크기로 커지지 않게 한다.
 */
export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <img
      src={inverse ? "/logo-mtm-inverse.svg" : "/logo-mtm.svg"}
      alt="MTM"
      width={37}
      height={18}
      className="h-[18px] w-[37px]"
    />
  );
}
