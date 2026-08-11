type Bucket = { count: number; resetsAt: number };

const globalBuckets = globalThis as typeof globalThis & {
  aprendeVestRateLimits?: Map<string, Bucket>;
};
const buckets =
  globalBuckets.aprendeVestRateLimits ??
  (globalBuckets.aprendeVestRateLimits = new Map());

export function checkRateLimit(
  key: string,
  options: { limit: number; windowMs: number },
  now = Date.now(),
) {
  const previous = buckets.get(key);
  const bucket =
    !previous || previous.resetsAt <= now
      ? { count: 0, resetsAt: now + options.windowMs }
      : previous;
  bucket.count += 1;
  buckets.set(key, bucket);
  return {
    allowed: bucket.count <= options.limit,
    remaining: Math.max(0, options.limit - bucket.count),
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetsAt - now) / 1_000)),
  };
}

export function rateLimitRequest(request: Request, scope: string, limit = 60) {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const client = forwarded || request.headers.get("x-real-ip") || "unknown";
  return checkRateLimit(`${scope}:${client}`, { limit, windowMs: 60_000 });
}
