// Esquema inicial (docs/requisitos.md, seção 11). Cresce por migração a cada requisito.
import {
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { STATUS_PEDIDO } from "@claudia-food/dominio";

export const statusPedido = pgEnum("status_pedido", STATUS_PEDIDO);
export const tipoPedido = pgEnum("tipo_pedido", ["entrega", "retirada", "local"]);
export const origemPedido = pgEnum("origem_pedido", ["whatsapp", "balcao", "mesa"]);

export const clientes = pgTable("clientes", {
  id: uuid("id").primaryKey().defaultRandom(),
  telefone: text("telefone").notNull().unique(),
  nome: text("nome"),
  preferencias: jsonb("preferencias").$type<string[]>().notNull().default([]),
  aceitaOfertas: timestamp("aceita_ofertas_em", { withTimezone: true }),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});

export const pedidos = pgTable("pedidos", {
  id: uuid("id").primaryKey().defaultRandom(),
  numero: integer("numero").generatedAlwaysAsIdentity(),
  clienteId: uuid("cliente_id").references(() => clientes.id),
  origem: origemPedido("origem").notNull(),
  tipo: tipoPedido("tipo").notNull(),
  status: statusPedido("status").notNull().default("rascunho"),
  enderecoEntrega: text("endereco_entrega"),
  taxaEntrega: numeric("taxa_entrega", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull().default("0"),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});

export const itensPedido = pgTable("itens_pedido", {
  id: uuid("id").primaryKey().defaultRandom(),
  pedidoId: uuid("pedido_id")
    .notNull()
    .references(() => pedidos.id, { onDelete: "cascade" }),
  itemCardapioId: uuid("item_cardapio_id").notNull(),
  quantidade: integer("quantidade").notNull(),
  precoUnitario: numeric("preco_unitario", { precision: 10, scale: 2 }).notNull(),
  opcoes: jsonb("opcoes").$type<{ nome: string; preco: string }[]>().notNull().default([]),
  observacao: text("observacao"),
});

/** Idempotência dos webhooks (RNF-06): cada ID de mensagem do WhatsApp é processado uma vez. */
export const mensagensProcessadas = pgTable("mensagens_processadas", {
  idWhatsapp: text("id_whatsapp").primaryKey(),
  recebidaEm: timestamp("recebida_em", { withTimezone: true }).notNull().defaultNow(),
});
