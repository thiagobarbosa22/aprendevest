export type StatusTone = "ok" | "degraded" | "unknown";

export interface StatusBadgeProps {
  tone: StatusTone;
  label: string;
  className?: string;
}

const toneStyles: Record<StatusTone, string> = {
  ok: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
  degraded: "bg-[var(--color-accent)]/10 text-[var(--color-accent)]",
  unknown: "bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)]",
};

const toneSymbol: Record<StatusTone, string> = {
  ok: "✓",
  degraded: "⚠",
  unknown: "–",
};

export function StatusBadge({ tone, label, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
        toneStyles[tone],
        className,
      ].join(" ")}
    >
      <span aria-hidden="true">{toneSymbol[tone]}</span>
      {label}
    </span>
  );
}
