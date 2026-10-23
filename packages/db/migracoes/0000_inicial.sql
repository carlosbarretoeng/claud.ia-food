CREATE SCHEMA IF NOT EXISTS "loja";
--> statement-breakpoint
CREATE TYPE "loja"."forma_pagamento" AS ENUM('pix', 'cartao_online', 'dinheiro', 'cartao_maquininha');--> statement-breakpoint
CREATE TYPE "loja"."origem_pedido" AS ENUM('whatsapp', 'balcao', 'mesa');--> statement-breakpoint
CREATE TYPE "loja"."status_pagamento" AS ENUM('pendente', 'pago', 'na_entrega', 'estornado');--> statement-breakpoint
CREATE TYPE "loja"."status_pedido" AS ENUM('rascunho', 'aguardando_confirmacao', 'confirmado', 'em_preparo', 'pronto', 'saiu_para_entrega', 'aguardando_retirada', 'servido', 'concluido', 'cancelado');--> statement-breakpoint
CREATE TYPE "loja"."tipo_grupo" AS ENUM('adicionar', 'remover', 'escolher');--> statement-breakpoint
CREATE TYPE "loja"."tipo_pedido" AS ENUM('entrega', 'retirada', 'local');--> statement-breakpoint
CREATE TABLE "loja"."bairros" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"taxa_centavos" integer NOT NULL,
	"tempo_estimado_min" integer NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "bairros_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
ALTER TABLE "loja"."bairros" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "loja"."categorias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL,
	"ativa" boolean DEFAULT true NOT NULL,
	CONSTRAINT "categorias_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
ALTER TABLE "loja"."categorias" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "loja"."clientes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"telefone" text NOT NULL,
	"nome" text,
	"preferencias" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"aceita_ofertas_em" timestamp with time zone,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clientes_telefone_unique" UNIQUE("telefone")
);
--> statement-breakpoint
ALTER TABLE "loja"."clientes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "loja"."enderecos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cliente_id" uuid NOT NULL,
	"apelido" text,
	"logradouro" text NOT NULL,
	"numero" text NOT NULL,
	"complemento" text,
	"bairro_id" uuid NOT NULL,
	"referencia" text,
	"principal" boolean DEFAULT false NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "loja"."enderecos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "loja"."grupos_opcoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"tipo" "loja"."tipo_grupo" NOT NULL,
	"minimo" integer DEFAULT 0 NOT NULL,
	"maximo" integer NOT NULL,
	CONSTRAINT "grupos_opcoes_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
ALTER TABLE "loja"."grupos_opcoes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "loja"."itens_cardapio" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"categoria_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"descricao" text,
	"preco_centavos" integer NOT NULL,
	"ingredientes" text,
	"alergenicos" text[] DEFAULT '{}' NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL,
	"disponivel" boolean DEFAULT true NOT NULL,
	"motivo_pausa" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "itens_cardapio_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
ALTER TABLE "loja"."itens_cardapio" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "loja"."itens_grupos" (
	"item_id" uuid NOT NULL,
	"grupo_id" uuid NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "itens_grupos_item_id_grupo_id_pk" PRIMARY KEY("item_id","grupo_id")
);
--> statement-breakpoint
ALTER TABLE "loja"."itens_grupos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "loja"."itens_pedido" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pedido_id" uuid NOT NULL,
	"item_cardapio_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"quantidade" integer NOT NULL,
	"preco_unitario_centavos" integer NOT NULL,
	"opcoes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"observacao" text
);
--> statement-breakpoint
ALTER TABLE "loja"."itens_pedido" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "loja"."mensagens_processadas" (
	"id_whatsapp" text PRIMARY KEY NOT NULL,
	"recebida_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "loja"."mensagens_processadas" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "loja"."opcoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grupo_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"preco_centavos" integer DEFAULT 0 NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL,
	"disponivel" boolean DEFAULT true NOT NULL,
	CONSTRAINT "opcoes_grupo_id_nome_unique" UNIQUE("grupo_id","nome")
);
--> statement-breakpoint
ALTER TABLE "loja"."opcoes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "loja"."pedidos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero" integer GENERATED ALWAYS AS IDENTITY (sequence name "loja"."pedidos_numero_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cliente_id" uuid,
	"origem" "loja"."origem_pedido" NOT NULL,
	"tipo" "loja"."tipo_pedido" NOT NULL,
	"status" "loja"."status_pedido" DEFAULT 'rascunho' NOT NULL,
	"status_pagamento" "loja"."status_pagamento" DEFAULT 'pendente' NOT NULL,
	"forma_pagamento" "loja"."forma_pagamento",
	"endereco_id" uuid,
	"bairro_id" uuid,
	"taxa_entrega_centavos" integer DEFAULT 0 NOT NULL,
	"total_centavos" integer DEFAULT 0 NOT NULL,
	"observacoes" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "loja"."pedidos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "loja"."enderecos" ADD CONSTRAINT "enderecos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "loja"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loja"."enderecos" ADD CONSTRAINT "enderecos_bairro_id_bairros_id_fk" FOREIGN KEY ("bairro_id") REFERENCES "loja"."bairros"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loja"."itens_cardapio" ADD CONSTRAINT "itens_cardapio_categoria_id_categorias_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "loja"."categorias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loja"."itens_grupos" ADD CONSTRAINT "itens_grupos_item_id_itens_cardapio_id_fk" FOREIGN KEY ("item_id") REFERENCES "loja"."itens_cardapio"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loja"."itens_grupos" ADD CONSTRAINT "itens_grupos_grupo_id_grupos_opcoes_id_fk" FOREIGN KEY ("grupo_id") REFERENCES "loja"."grupos_opcoes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loja"."itens_pedido" ADD CONSTRAINT "itens_pedido_pedido_id_pedidos_id_fk" FOREIGN KEY ("pedido_id") REFERENCES "loja"."pedidos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loja"."itens_pedido" ADD CONSTRAINT "itens_pedido_item_cardapio_id_itens_cardapio_id_fk" FOREIGN KEY ("item_cardapio_id") REFERENCES "loja"."itens_cardapio"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loja"."opcoes" ADD CONSTRAINT "opcoes_grupo_id_grupos_opcoes_id_fk" FOREIGN KEY ("grupo_id") REFERENCES "loja"."grupos_opcoes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loja"."pedidos" ADD CONSTRAINT "pedidos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "loja"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loja"."pedidos" ADD CONSTRAINT "pedidos_endereco_id_enderecos_id_fk" FOREIGN KEY ("endereco_id") REFERENCES "loja"."enderecos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loja"."pedidos" ADD CONSTRAINT "pedidos_bairro_id_bairros_id_fk" FOREIGN KEY ("bairro_id") REFERENCES "loja"."bairros"("id") ON DELETE no action ON UPDATE no action;