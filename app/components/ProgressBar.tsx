/**
 * 트랙 2px, 진행바 #212121. 상태 라벨을 반드시 동반한다.
 * (Figma 6:128 착용 화면 300px · 8:32 사진첩 120px)
 *
 * `value` 를 주지 않으면 **불확정** 막대가 된다. 생성 요청이 동기라 진행률을
 * 알 수 없기 때문이다 — 70%에 멈춰 있는 막대는 알지 못하는 것을 아는 척한다.
 */
export function ProgressBar({
  value,
  label,
  width = 300,
  className = "items-center gap-[10px]",
}: {
  value?: number;
  label: string;
  width?: number;
  /** 자리마다 정렬·간격이 다르다 — Z1 좌측 6px · Z2 중앙 10px · 사진첩 중앙 8px */
  className?: string;
}) {
  const indeterminate = value == null;

  return (
    <div className={"flex flex-col " + className}>
      <div
        role="progressbar"
        // 불확정 막대는 aria-valuenow 를 비운다. 보조기술이 "진행률 미상"으로 읽는다.
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-[2px] overflow-hidden bg-surface-track"
        style={{ width }}
      >
        <div
          className={
            "h-[2px] bg-text-primary " +
            (indeterminate ? "w-1/4 animate-indeterminate" : "")
          }
          style={indeterminate ? undefined : { width: `${value}%` }}
        />
      </div>
      <p className="text-[11px] tracking-[1px] text-text-secondary">{label}</p>
    </div>
  );
}
