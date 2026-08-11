import type { HTMLAttributes } from "react";

export function VisuallyHidden({
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={[
        "absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0",
        "[clip:rect(0,0,0,0)] [clip-path:inset(50%)]",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
