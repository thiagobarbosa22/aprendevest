import type { DatabaseHealthPort } from "@aprendevest/domain";
import postgres from "postgres";

export const databaseHealth: DatabaseHealthPort = {
  async check() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return "not_configured";
    }

    const client = postgres(databaseUrl, {
      connect_timeout: 3,
      idle_timeout: 3,
      max: 1,
    });

    try {
      await client`select 1`;
      return "ok";
    } catch {
      return "unavailable";
    } finally {
      await client.end({ timeout: 1 });
    }
  },
};
