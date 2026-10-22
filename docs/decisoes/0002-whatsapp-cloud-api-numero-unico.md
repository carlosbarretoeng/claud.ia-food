# ADR-0002 — WhatsApp Cloud API oficial com um único número

- **Data:** 22/10/2026
- **Status:** aceita

## Contexto

Robôs no número comum do WhatsApp Business têm relatos de banimento. A API oficial da Meta permite automação, mas cobra por mensagem enviada. Desde 01/10/2026 as mensagens de serviço também são cobradas após 1.000 grátis por mês por número ([Meta](https://developers.facebook.com/docs/whatsapp/pricing)). Desde 15/01/2026 a Meta proíbe assistentes de IA de uso geral na API, mas permite IA para atendimento e vendas da própria empresa.

## Decisão

- Usar a **WhatsApp Cloud API** oficial.
- Usar **um único número** para clientes, equipe e fornecedores; o sistema separa os fluxos pelo telefone cadastrado.
- Manter a IA restrita ao escopo da loja.
- Seguir o **orçamento de mensagens** (RNF-18): no máximo 5 envios por pedido de cliente recorrente.

## Consequências

- Custo estimado de ~R$ 70/mês em mensagens com o fluxo enxuto (500 pedidos/mês).
- Mensagens da equipe somam na mesma franquia e no mesmo custo; precisam ser agrupadas.
- Mensagens iniciadas pelo sistema fora da janela de 24 h exigem modelos aprovados pela Meta.
