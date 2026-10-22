# ADR-0001 — Desenvolver um sistema próprio

- **Data:** 22/10/2026
- **Status:** aceita

## Contexto

O [estudo de mercado](../estudo-de-mercado.md) avaliou Anota AI, Cardápio Web, Saipos, Goomer e outras ferramentas. Todas empurram o cliente para um cardápio digital com carrinho, e nenhuma oferece um assistente de gestão (estoque, compras, caixa) operado por conversa no WhatsApp.

## Decisão

Desenvolver um sistema próprio em que:

- o pedido é feito **na conversa**, com atendimento direcionado pelo histórico do cliente;
- o gerente opera estoque, compras e caixa por um **assistente virtual no WhatsApp**.

## Consequências

- Custo de desenvolvimento e manutenção próprios, em troca de aderência total ao modelo de atendimento desejado.
- Dependência de serviços externos via API (WhatsApp, IA, PIX, NFC-e), sem mensalidade de software de terceiros.
