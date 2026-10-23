// Esquema inicial (docs/requisitos.md, seção 11). Cresce por migração a cada requisito.
import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { FORMAS_PAGAMENTO, STATUS_PAGAMENTO, STATUS_PEDIDO } from "@claudia-food/dominio";

// Dinheiro sempre em centavos inteiros (colunas *_centavos).

export const statusPedido = pgEnum("status_pedido", STATUS_PEDIDO);
export const tipoPedido = pgEnum("tipo_pedido", ["entrega", "retirada", "local"]);
export const statusPagamento = pgEnum("status_pagamento", STATUS_PAGAMENTO);
export const formaPagamento = pgEnum("forma_pagamento", FORMAS_PAGAMENTO);
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
  statusPagamento: statusPagamento("status_pagamento").notNull().default("pendente"),
  formaPagamento: formaPagamento("forma_pagamento"),
  taxaEntregaCentavos: integer("taxa_entrega_centavos").notNull().default(0),
  totalCentavos: integer("total_centavos").notNull().default(0),
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
  precoUnitarioCentavos: integer("preco_unitario_centavos").notNull(),
  opcoes: jsonb("opcoes").$type<{ nome: string; precoCentavos: number }[]>().notNull().default([]),
  observacao: text("observacao"),
});

/** Idempotência dos webhooks (RNF-06): cada ID de mensagem do WhatsApp é processado uma vez. */
export const mensagensProcessadas = pgTable("mensagens_processadas", {
  idWhatsapp: text("id_whatsapp").primaryKey(),
  recebidaEm: timestamp("recebida_em", { withTimezone: true }).notNull().defaultNow(),
});
