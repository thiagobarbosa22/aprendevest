import type { HTMLAttributes, ReactNode } from "react";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
}

const variantStyles: Record<
  AlertVariant,
  { border: string; bg: string; icon: ReactNode; label: string }
> = {
  info: {
    border: "border-[var(--color-primary)]/30",
    bg: "bg-[var(--color-primary)]/5",
    label: "Informação",
    icon: (
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="h-5 w-5 shrink-0 text-[var(--color-primary)]"
      >
        <path
          fill="currentColor"
          d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm1 9H9v-6h2v6Z"
        />
      </svg>
    ),
  },
  success: {
    border: "border-[var(--color-success)]/30",
    bg: "bg-[var(--color-success)]/5",
    label: "Sucesso",
    icon: (
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="h-5 w-5 shrink-0 text-[var(--color-success)]"
      >
        <path
          fill="currentColor"
          d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-1 11.4-3.4-3.4 1.4-1.4L9 10.6l4-4 1.4 1.4L9 13.4Z"
        />
      </svg>
    ),
  },
  warning: {
    border: "border-[var(--color-accent)]/30",
    bg: "bg-[var(--color-accent)]/5",
    label: "Atenção",
    icon: (
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="h-5 w-5 shrink-0 text-[var(--color-accent)]"
      >
        <path
          fill="currentColor"
          d="M10 2 1 18h18L10 2Zm1 13H9v-2h2v2Zm0-4H9V7h2v4Z"
        />
      </svg>
    ),
  },
  error: {
    border: "border-[var(--color-danger)]/30",
    bg: "bg-[var(--color-danger)]/5",
    label: "Erro",
    icon: (
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="h-5 w-5 shrink-0 text-[var(--color-danger)]"
      >
        <path
          fill="currentColor"
          d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 12H9v-2h2v2Zm0-4H9V5h2v5Z"
        />
      </svg>
    ),
  },
};

export function Alert({
  variant = "info",
  title,
  className = "",
  children,
  ...props
}: AlertProps) {
  const style = variantStyles[variant];
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={[
        "flex gap-3 rounded-lg border p-4",
        style.border,
        style.bg,
        className,
      ].join(" ")}
      {...props}
    >
      {style.icon}
      <div className="text-sm text-[var(--color-text)]">
        <p className="font-semibold">{title ?? style.label}</p>
        <div className="mt-1 text-[var(--color-text-muted)]">{children}</div>
      </div>
    </div>
  );
}
