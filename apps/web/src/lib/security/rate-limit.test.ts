import { describe, expect, it } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  it("bloqueia excesso e libera após a janela", () => {
    const key = `test-${crypto.randomUUID()}`;
    expect(checkRateLimit(key, { limit: 1, windowMs: 1_000 }, 10).allowed).toBe(
      true,
    );
    expect(checkRateLimit(key, { limit: 1, windowMs: 1_000 }, 20).allowed).toBe(
      false,
    );
    expect(
      checkRateLimit(key, { limit: 1, windowMs: 1_000 }, 1_011).allowed,
    ).toBe(true);
  });
});
