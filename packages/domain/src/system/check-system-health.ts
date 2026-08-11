export type DatabaseHealth = "ok" | "unavailable" | "not_configured";

export interface DatabaseHealthPort {
  check(): Promise<DatabaseHealth>;
}

export interface SystemHealth {
  status: "ok" | "degraded";
  timestamp: string;
  checks: {
    database: DatabaseHealth;
  };
}

export async function checkSystemHealth(
  database: DatabaseHealthPort,
  now: () => Date = () => new Date(),
): Promise<SystemHealth> {
  const databaseHealth = await database.check();

  return {
    status: databaseHealth === "ok" ? "ok" : "degraded",
    timestamp: now().toISOString(),
    checks: {
      database: databaseHealth,
    },
  };
}
