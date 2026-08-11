export interface SkipLinkProps {
  targetId: string;
  children?: string;
}

export function SkipLink({
  targetId,
  children = "Pular para o conteúdo principal",
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={[
        "absolute left-4 top-4 z-50 -translate-y-20 rounded-lg px-4 py-2 text-sm font-medium",
        "bg-[var(--color-primary)] text-white transition-transform",
        "focus:translate-y-0",
      ].join(" ")}
    >
      {children}
    </a>
  );
}
