import "dotenv/config";

import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL é obrigatória para gerar ou executar migrações.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  out: "./migrations",
  schema: "./src/schema/**/*.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
  verbose: true,
});
