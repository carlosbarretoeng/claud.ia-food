import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/esquema.ts",
  out: "./migracoes",
  schemaFilter: ["loja"],
  migrations: { schema: "loja", table: "migracoes" },
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
