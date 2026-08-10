/**
 * 트랙 2px, 진행바 #212121. 상태 라벨을 반드시 동반한다.
 * (Figma 6:128 착용 화면 300px · 8:32 사진첩 120px)
 */
export function ProgressBar({
  value,
  label,
  width = 300,
}: {
  value: number;
  label: string;
  width?: number;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-[2px] overflow-hidden bg-track"
        style={{ width }}
      >
        <div className="h-[2px] bg-ink" style={{ width: `${value}%` }} />
      </div>
      <p className="text-[11px] tracking-[1px] text-ink-muted">{label}</p>
    </div>
  );
}
