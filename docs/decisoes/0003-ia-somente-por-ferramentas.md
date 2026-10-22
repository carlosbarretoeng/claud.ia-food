# ADR-0003 — A IA só age por ferramentas do backend

- **Data:** 22/10/2026
- **Status:** aceita

## Contexto

Um modelo de linguagem pode inventar itens ou preços, conceder descontos indevidos ou ser manipulado por mensagens (prompt injection).

## Decisão

- Preços, itens, disponibilidade, taxas, descontos, permissões e status são decididos pelos **serviços de negócio**, nunca pelo modelo.
- A IA lê e altera dados apenas chamando **ferramentas** (function calling) liberadas para o perfil daquela conversa (cliente ou gerente).
- Toda chamada de ferramenta é registrada para auditoria (RNF-12).
- Pedidos só vão para a cozinha após confirmação explícita do cliente (ATD-10) e, no início, aprovação do atendente (ATD-13).

## Consequências

- O painel e a IA usam os mesmos serviços: humano e IA veem e mudam os mesmos pedidos.
- Cada nova capacidade da IA exige uma ferramenta explícita no backend, com testes.
