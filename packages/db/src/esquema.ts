// Esquema do banco (docs/requisitos.md, seção 11). Cresce por migração a cada requisito.
// Tudo fica no schema "loja", fora da API REST pública do Supabase, e com RLS ligado
// (sem políticas = ninguém além do dono lê). A API do sistema acessa o banco direto.
// Dinheiro sempre em centavos inteiros (colunas *_centavos).
import {
  boolean,
  integer,
  jsonb,
  pgSchema,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { FORMAS_PAGAMENTO, STATUS_PAGAMENTO, STATUS_PEDIDO } from "@claudia-food/dominio";

export const loja = pgSchema("loja");

const criadoEm = () => timestamp("criado_em", { withTimezone: true }).notNull().defaultNow();

// ---------- Cardápio ----------

export const tipoGrupo = loja.enum("tipo_grupo", ["adicionar", "remover", "escolher"]);

export const categorias = loja
  .table("categorias", {
    id: uuid("id").primaryKey().defaultRandom(),
    nome: text("nome").notNull().unique(),
    ordem: integer("ordem").notNull().default(0),
    ativa: boolean("ativa").notNull().default(true),
  })
  .enableRLS();

export const itensCardapio = loja
  .table("itens_cardapio", {
    id: uuid("id").primaryKey().defaultRandom(),
    categoriaId: uuid("categoria_id")
      .notNull()
      .references(() => categorias.id),
    nome: text("nome").notNull().unique(),
    descricao: text("descricao"),
    precoCentavos: integer("preco_centavos").notNull(),
    ingredientes: text("ingredientes"),
    alergenicos: text("alergenicos").array().notNull().default([]),
    ordem: integer("ordem").notNull().default(0),
    /** Pausado pelo atendente ou por falta de insumo (PED-08, GER-05). */
    disponivel: boolean("disponivel").notNull().default(true),
    motivoPausa: text("motivo_pausa"),
    /** Itens não são apagados: pedidos antigos apontam para eles. */
    ativo: boolean("ativo").notNull().default(true),
    criadoEm: criadoEm(),
  })
  .enableRLS();

export const gruposOpcoes = loja
  .table("grupos_opcoes", {
    id: uuid("id").primaryKey().defaultRandom(),
    nome: text("nome").notNull().unique(),
    tipo: tipoGrupo("tipo").notNull(),
    minimo: integer("minimo").notNull().default(0),
    maximo: integer("maximo").notNull(),
  })
  .enableRLS();

export const opcoes = loja
  .table(
    "opcoes",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      grupoId: uuid("grupo_id")
        .notNull()
        .references(() => gruposOpcoes.id),
      nome: text("nome").notNull(),
      precoCentavos: integer("preco_centavos").notNull().default(0),
      ordem: integer("ordem").notNull().default(0),
      disponivel: boolean("disponivel").notNull().default(true),
    },
    (t) => [unique().on(t.grupoId, t.nome)],
  )
  .enableRLS();

/** Grupos reaproveitáveis: o mesmo "Adicionais" vale para vários itens. */
export const itensGrupos = loja
  .table(
    "itens_grupos",
    {
      itemId: uuid("item_id")
        .notNull()
        .references(() => itensCardapio.id),
      grupoId: uuid("grupo_id")
        .notNull()
        .references(() => gruposOpcoes.id),
      ordem: integer("ordem").notNull().default(0),
    },
    (t) => [primaryKey({ columns: [t.itemId, t.grupoId] })],
  )
  .enableRLS();

// ---------- Entrega e clientes ----------

export const bairros = loja
  .table("bairros", {
    id: uuid("id").primaryKey().defaultRandom(),
    nome: text("nome").notNull().unique(),
    taxaCentavos: integer("taxa_centavos").notNull(),
    tempoEstimadoMin: integer("tempo_estimado_min").notNull(),
    ativo: boolean("ativo").notNull().default(true),
  })
  .enableRLS();

export const clientes = loja
  .table("clientes", {
    id: uuid("id").primaryKey().defaultRandom(),
    telefone: text("telefone").notNull().unique(),
    nome: text("nome"),
    preferencias: jsonb("preferencias").$type<string[]>().notNull().default([]),
    aceitaOfertasEm: timestamp("aceita_ofertas_em", { withTimezone: true }),
    criadoEm: criadoEm(),
  })
  .enableRLS();

export const enderecos = loja
  .table("enderecos", {
    id: uuid("id").primaryKey().defaultRandom(),
    clienteId: uuid("cliente_id")
      .notNull()
      .references(() => clientes.id),
    apelido: text("apelido"),
    logradouro: text("logradouro").notNull(),
    numero: text("numero").notNull(),
    complemento: text("complemento"),
    bairroId: uuid("bairro_id")
      .notNull()
      .references(() => bairros.id),
    referencia: text("referencia"),
    principal: boolean("principal").notNull().default(false),
    criadoEm: criadoEm(),
  })
  .enableRLS();

// ---------- Pedidos ----------

export const statusPedido = loja.enum("status_pedido", STATUS_PEDIDO);
export const statusPagamento = loja.enum("status_pagamento", STATUS_PAGAMENTO);
export const formaPagamento = loja.enum("forma_pagamento", FORMAS_PAGAMENTO);
export const tipoPedido = loja.enum("tipo_pedido", ["entrega", "retirada", "local"]);
export const origemPedido = loja.enum("origem_pedido", ["whatsapp", "balcao", "mesa"]);

export const pedidos = loja
  .table("pedidos", {
    id: uuid("id").primaryKey().defaultRandom(),
    numero: integer("numero").generatedAlwaysAsIdentity(),
    clienteId: uuid("cliente_id").references(() => clientes.id),
    origem: origemPedido("origem").notNull(),
    tipo: tipoPedido("tipo").notNull(),
    status: statusPedido("status").notNull().default("rascunho"),
    statusPagamento: statusPagamento("status_pagamento").notNull().default("pendente"),
    formaPagamento: formaPagamento("forma_pagamento"),
    enderecoId: uuid("endereco_id").references(() => enderecos.id),
    bairroId: uuid("bairro_id").references(() => bairros.id),
    taxaEntregaCentavos: integer("taxa_entrega_centavos").notNull().default(0),
    totalCentavos: integer("total_centavos").notNull().default(0),
    observacoes: text("observacoes"),
    criadoEm: criadoEm(),
  })
  .enableRLS();

/** Guarda nome e preço do momento da venda: mudanças no cardápio não alteram pedidos antigos. */
export const itensPedido = loja
  .table("itens_pedido", {
    id: uuid("id").primaryKey().defaultRandom(),
    pedidoId: uuid("pedido_id")
      .notNull()
      .references(() => pedidos.id, { onDelete: "cascade" }),
    itemCardapioId: uuid("item_cardapio_id")
      .notNull()
      .references(() => itensCardapio.id),
    nome: text("nome").notNull(),
    quantidade: integer("quantidade").notNull(),
    precoUnitarioCentavos: integer("preco_unitario_centavos").notNull(),
    opcoes: jsonb("opcoes")
      .$type<{ opcaoId: string; nome: string; precoCentavos: number }[]>()
      .notNull()
      .default([]),
    observacao: text("observacao"),
  })
  .enableRLS();

/** Idempotência dos webhooks (RNF-06): cada ID de mensagem do WhatsApp é processado uma vez. */
export const mensagensProcessadas = loja
  .table("mensagens_processadas", {
    idWhatsapp: text("id_whatsapp").primaryKey(),
    recebidaEm: timestamp("recebida_em", { withTimezone: true }).notNull().defaultNow(),
  })
  .enableRLS();
