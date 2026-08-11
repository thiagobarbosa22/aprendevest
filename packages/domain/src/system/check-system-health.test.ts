import { describe, expect, it } from "vitest";

import {
  checkSystemHealth,
  type DatabaseHealthPort,
} from "./check-system-health";

describe("checkSystemHealth", () => {
  const fixedClock = () => new Date("2026-08-10T23:00:00.000Z");

  it("fica pronto quando o banco responde", async () => {
    const database: DatabaseHealthPort = {
      check: async () => "ok",
    };

    await expect(checkSystemHealth(database, fixedClock)).resolves.toEqual({
      status: "ok",
      timestamp: "2026-08-10T23:00:00.000Z",
      checks: { database: "ok" },
    });
  });

  it.each(["unavailable", "not_configured"] as const)(
    "fica degradado quando o banco está %s",
    async (databaseState) => {
      const database: DatabaseHealthPort = {
        check: async () => databaseState,
      };

      const result = await checkSystemHealth(database, fixedClock);

      expect(result.status).toBe("degraded");
      expect(result.checks.database).toBe(databaseState);
    },
  );
});
