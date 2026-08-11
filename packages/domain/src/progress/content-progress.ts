export type ContentProgressState = {
  percent: number;
  positionSeconds: number;
  status: "not_started" | "in_progress" | "completed";
};

export function mergeContentProgress(
  previous: ContentProgressState | null,
  update: { percent: number; positionSeconds?: number; complete?: boolean },
): ContentProgressState {
  const boundedPercent = Math.max(0, Math.min(100, Math.round(update.percent)));
  const percent = update.complete
    ? 100
    : Math.max(previous?.percent ?? 0, boundedPercent);
  const positionSeconds = Math.max(
    previous?.positionSeconds ?? 0,
    Math.max(0, Math.round(update.positionSeconds ?? 0)),
  );
  return {
    percent,
    positionSeconds,
    status:
      percent >= 100
        ? "completed"
        : percent > 0
          ? "in_progress"
          : "not_started",
  };
}
