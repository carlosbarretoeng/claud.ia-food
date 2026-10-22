# ADR-0004 — Gateway de mensagens com simulador de WhatsApp

- **Data:** 22/10/2026
- **Status:** aceita
- **Relacionada:** [ADR-0002](0002-whatsapp-cloud-api-numero-unico.md)

## Contexto

Ativar a WhatsApp Cloud API em produção exige conta Meta Business, um número dedicado e, para limites maiores, verificação da empresa com CNPJ (5 a 15 dias, segundo relatos). A loja ainda não está aberta. Esperar por isso travaria o desenvolvimento, e cada teste com a API real consome mensagens pagas.

## Decisão

Todo envio e recebimento de mensagens passa por uma interface única, o **gateway de mensagens**, com duas implementações trocáveis por configuração:

| Implementação | Uso | Comportamento |
| --- | --- | --- |
| `simulador` | Desenvolvimento, testes automáticos, demonstrações | Tela web semelhante ao WhatsApp onde se conversa como cliente, gerente ou fornecedor. Gera webhooks no **mesmo formato da Cloud API** e recebe as respostas do sistema. |
| `cloud_api` | Homologação e produção | Integração real com a Meta. |

Regras para o simulador ser fiel:

- Mesmo formato de payload dos webhooks e das chamadas de envio da Cloud API (texto, áudio, imagem, botões interativos, status de entrega).
- Respeitar a janela de 24 h: fora dela, só modelos cadastrados podem ser enviados.
- Contar mensagens enviadas por pedido e por conversa, para validar o orçamento de mensagens (RNF-18).
- Simular falhas: atraso, mensagem duplicada (idempotência, RNF-06) e fora de ordem.
- Nenhuma credencial real é necessária para rodar o simulador.

## Consequências

- O MVP pode ser desenvolvido e testado sem número, sem conta Meta e sem custo de mensagens.
- A F0-01 (conta Meta e número oficial) sai da fase 0 e passa a ser pré-requisito do **lançamento do MVP**; a verificação da empresa deve começar algumas semanas antes do lançamento.
- Antes do lançamento, rodar a mesma bateria de testes com o número de teste da Meta para detectar diferenças entre simulador e API real.
- Manter o simulador atualizado quando a Meta mudar formatos ou regras.
