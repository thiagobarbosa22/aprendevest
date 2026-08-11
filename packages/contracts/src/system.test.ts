import { describe, expect, it } from "vitest";

import { healthResponseSchema } from "./system";

describe("healthResponseSchema", () => {
  it("aceita o diagnóstico público documentado", () => {
    const result = healthResponseSchema.safeParse({
      status: "ok",
      service: "web",
      version: "0.1.0",
      timestamp: "2026-08-10T23:00:00.000Z",
      checks: { database: "ok" },
    });

    expect(result.success).toBe(true);
  });

  it("rejeita estados e datas fora do contrato", () => {
    const result = healthResponseSchema.safeParse({
      status: "healthy",
      service: "web",
      version: "0.1.0",
      timestamp: "agora",
      checks: { database: "talvez" },
    });

    expect(result.success).toBe(false);
  });
});
