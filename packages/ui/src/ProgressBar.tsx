export interface ProgressBarProps {
  value: number;
  max?: number;
  label: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? Math.round((clamped / max) * 100) : 0;

  return (
    <div className={className}>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-[var(--color-text)]">{label}</span>
        <span className="font-medium text-[var(--color-text-muted)]">
          {percent}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]"
      >
        <div
          className="h-full rounded-full bg-[var(--color-secondary)] transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
