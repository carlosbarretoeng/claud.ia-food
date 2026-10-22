# claud.ia-food

Sistema de atendimento e gestão para lanchonetes e hamburguerias pequenas, com o **WhatsApp como canal principal**:

- **Atendimento conversacional:** uma IA (com humano por perto) atende o cliente pelo nome, conhece o cardápio e o histórico dele, e monta o pedido na própria conversa, sem cardápio digital.
- **Gerente virtual:** o gerente manda texto, áudio ou foto no WhatsApp e o sistema lança entradas no estoque, avisa faltas, monta a lista de compras, cria lembretes e fecha o caixa.
- **Operação:** fila única de pedidos (WhatsApp, balcão e mesa), impressão na cozinha, entregadores, PIX com confirmação automática e relatórios.

> Status: **fase 0 (preparação)**. Requisitos definidos; arquitetura técnica e stack em definição.

## Documentação

| Documento | Conteúdo |
| --- | --- |
| [Estudo de mercado](docs/estudo-de-mercado.md) | Ferramentas existentes, preços, matriz de pontuação e por que desenvolver |
| [Requisitos](docs/requisitos.md) | Cerca de 110 requisitos numerados (ATD, PED, CLI, GER, FIN, REL, RNF) com prioridade e critério de aceite |
| [Decisões de arquitetura](docs/decisoes/) | Registros de decisão (ADR) |
| [Wiki](../../wiki) | Visão geral, roadmap, glossário e como trabalhar no projeto |

## Gestão do projeto

- **Issues:** um issue por requisito, com o ID no título (ex.: `ATD-04`), etiqueta do módulo e da prioridade.
- **Milestones:** `Fase 0 — Preparação`, `MVP`, `v2`, `v3`.
- **Commits e PRs:** citar o ID do requisito (ex.: `ATD-04: interpretar pedido em linguagem natural`) e fechar o issue com `Closes #N`.

## Segurança

Repositório público: **nenhuma chave, token, credencial ou senha** pode ser armazenada ou commitada. Veja [SECURITY.md](SECURITY.md).

## Premissas principais

- Uma loja, até ~500 pedidos/mês, maioria delivery.
- Um número oficial de WhatsApp (Cloud API da Meta) para clientes, equipe e fornecedores.
- A IA fica restrita ao escopo da loja e só lê ou altera dados por ferramentas do backend.
- Fora de escopo agora: iFood/marketplaces, cardápio digital com carrinho, múltiplas lojas.
