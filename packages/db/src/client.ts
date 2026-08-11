import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

type Database = ReturnType<typeof createDatabase>;

const globalDatabase = globalThis as typeof globalThis & {
  aprendeVestDatabase?: Database;
};

function createDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL não configurada.");
  }

  const client = postgres(databaseUrl, {
    max: process.env.NODE_ENV === "production" ? 10 : 3,
    prepare: false,
  });

  return drizzle(client, { schema });
}

export function getDatabase(): Database {
  if (!globalDatabase.aprendeVestDatabase) {
    globalDatabase.aprendeVestDatabase = createDatabase();
  }

  return globalDatabase.aprendeVestDatabase;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
