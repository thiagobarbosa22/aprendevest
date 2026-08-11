import { healthResponseSchema } from "@aprendevest/contracts";
import { afterEach, describe, expect, it } from "vitest";

import { GET } from "./route";

const originalDatabaseUrl = process.env.DATABASE_URL;

afterEach(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

describe("GET /api/v1/health", () => {
  it("retorna diagnóstico degradado e válido quando o banco não está configurado", async () => {
    delete process.env.DATABASE_URL;

    const response = await GET();
    const body: unknown = await response.json();

    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(healthResponseSchema.parse(body)).toMatchObject({
      status: "degraded",
      service: "web",
      checks: { database: "not_configured" },
    });
  });
});
