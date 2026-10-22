# ADR-0005 — Stack: TypeScript, Supabase e Claude API

- **Data:** 22/10/2026
- **Status:** proposta (aguardando aprovação no PR)
- **Detalhes:** [arquitetura técnica](../arquitetura-tecnica.md)

## Contexto

Projeto de um desenvolvedor, uma loja, ~500 pedidos/mês, com painel em tempo real, webhooks de WhatsApp e PIX, agentes de IA com ferramentas e um serviço local de impressão. Sem preferência prévia de linguagem.

## Decisão

- **TypeScript** em todo o sistema, em monorepo com pnpm workspaces.
- **API:** Node.js 22 LTS + Fastify + Zod; jobs com pg-boss no próprio Postgres.
- **Dados e plataforma:** Supabase (PostgreSQL, Auth, Realtime, Storage), região São Paulo; Drizzle ORM para esquema e migrações.
- **Painel e simulador:** React + Vite (PWA).
- **IA:** Claude API com tool use; modelo `claude-opus-5-5` (esforço `low` no atendimento, `medium` no gerente virtual), prompt caching e fallback do servidor em caso de recusa.
- **Hospedagem da API:** contêiner (Fly.io, região São Paulo).
- **Qualidade:** Vitest, Playwright e bateria de conversas da IA no GitHub Actions.

## Alternativas consideradas

- **Python (FastAPI) no backend + React no painel:** bom para IA, mas duas linguagens e tipos duplicados entre API e painel.
- **Postgres próprio + Redis + autenticação própria:** mais controle, mais infraestrutura para um desenvolvedor só.
- **Modelo mais barato (Sonnet 5.5 ou Haiku 5.5) desde o início:** decidir só depois de medir a qualidade com a bateria de conversas; a troca é uma configuração.

## Consequências

- Menos infraestrutura para manter (login, tempo real e arquivos prontos no Supabase).
- Dependência do Supabase; mitigada por ser Postgres padrão (migrações em Drizzle, exportável).
- Custo estimado de produção ~R$ 500–550/mês no MVP, com a IA em ~R$ 0,38 por pedido.
