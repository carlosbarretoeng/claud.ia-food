import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as esquema from "./esquema.js";

export type Banco = ReturnType<typeof criarBanco>["banco"];

/** Abre a conexão com o Postgres (Supabase do homelab via DATABASE_URL). */
export function criarBanco(url = process.env.DATABASE_URL) {
  if (!url) throw new Error("DATABASE_URL não definida (veja .env.example)");
  const cliente = postgres(url, { max: 5 });
  return { banco: drizzle(cliente, { schema: esquema }), fechar: () => cliente.end() };
}
