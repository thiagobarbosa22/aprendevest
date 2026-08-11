import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ["../../.env.local", "../../.env"], quiet: true });

const migrationDatabaseUrl =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!migrationDatabaseUrl) {
  throw new Error(
    "DATABASE_URL_UNPOOLED ou DATABASE_URL é obrigatória para gerar ou executar migrações.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  out: "./migrations",
  schema: "./src/schema/**/*.ts",
  dbCredentials: {
    url: migrationDatabaseUrl,
  },
  strict: true,
  verbose: true,
});
