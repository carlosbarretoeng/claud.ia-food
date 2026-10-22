# Estudo de mercado — gestão de lanchonetes com WhatsApp

22/10/2026 · Carlos Barreto · versão viva: [Claude Docs](https://claude.ai/artifact/AXZzTr7iJgaWbC45PjFzni)

## Resumo

Para uma lanchonete pequena com salão + delivery e WhatsApp como canal principal, o mercado se divide em dois caminhos: **atendente de WhatsApp com cardápio** (Anota AI, Brendi, Cardápio Web, Goomer) ou **sistema de gestão/PDV** com WhatsApp como módulo (Saipos, Consumer). Nenhuma das ferramentas cobra comissão por pedido; o custo é mensalidade, de R$ 0 a cerca de R$ 625/mês.

- **Melhor custo para começar:** Goomer (grátis até 30 pedidos/mês; chatbot de WhatsApp a partir de R$ 138,68/mês no anual) ou Anota AI na faixa de até 150 pedidos (R$ 99,99/mês).
- **WhatsApp mais forte (IA que conversa):** Anota AI (do grupo iFood) e Brendi (entende texto, áudio e imagem).
- **Salão + delivery + fiscal num só lugar:** Cardápio Web (plano Premium) ou Saipos (a partir de R$ 240,79/mês, com NFC-e, KDS e app garçom).

Os preços abaixo são referências públicas e mudam com frequência; vários vêm de páginas de concorrentes. Confirme com cotação formal antes de contratar.

## Comparativo

| Ferramenta | Tipo | Preço de referência (R$/mês) | WhatsApp | Salão / mesas | iFood | Fiscal |
| --- | --- | --- | --- | --- | --- | --- |
| [Anota AI](https://anota.ai/planos) | Atendente WhatsApp + cardápio | 99,99 (até 150 pedidos) · 199,99 (151–250) · 299,99 (251+); Gestão Avançada 399,99 ([ref.](https://cardapily.com.br/cardapio-digital/guias/anota-ai-preco-alternativa), set/2026) | Robô com IA no número da loja | App garçom | Sim (empresa do iFood) | Nota fiscal, KDS e estoque só no Gestão Avançada |
| [Brendi](https://brendi.com.br/blog/melhor-sistema-gestao-delivery-hamburgueria/) | IA de WhatsApp + cardápio + tráfego pago | Variável conforme faturamento; teste de 15 dias | IA conversacional (texto, áudio, imagem), disparos e recuperação de clientes | Não citado | Importa cardápio e horários do iFood | Não citado |
| [Cardápio Web](https://www.cardapioweb.com/) | Cardápio + chatbot + gestão | 169,99 a 624,93 (planos Delivery, Premium, Mesas) | Chatbot com IA e disparador | Mesas, comandas, KDS | Sim | Emissor de notas |
| [Saipos](https://saipos.com/planos-e-precos) | Sistema de gestão / PDV | A partir de 240,79 | Assistente virtual como extra pago | Várias frentes de caixa, app garçom, KDS | Sim (+50 plataformas) | NFC-e (certificado A1) |
| [Goomer](https://www.goomer.com.br/planos) | Cardápio delivery e QR Code | Grátis (30 pedidos) · 99,90 · 184,90 · 299,90 (anual: 59,94 · 138,68 · 224,92) | Pedido pelo WhatsApp; chatbot a partir do Automatizar | Mesa e comanda por QR (Automatizar) | Logística iFood no Integrar | Não informado; integra com PDV no Integrar |
| [Consumer](https://www.getapp.com/all-software/a/consumer/) | Sistema de gestão / PDV | A partir de 44,90 por usuário | Cardápio próprio (MenuDino) | Mesas, QR Code, app entregador | Sim | Cupom fiscal |
| [OlaClick](https://olaclick.com/sistema-de-delivery-para-hamburgueria/) | Cardápio WhatsApp | Grátis; pagos a partir de ~39 ([fonte secundária](https://finder.techleap.nl/companies/olaclick_1)) | Pedido pelo WhatsApp; chatbot no pago | QR Code, PDV básico | Não informado | Não informado |
| [Neemo](https://saipos.com/neemo) (Linx) | Cardápio / site delivery | 129 · 189 · 289 (sem data) | Pedidos via WhatsApp | Não | Integra via Saipos | Não |
| [Rei do Delivery](https://reidodelivery.com.br/blog/melhores-sistemas-de-cardapio-digital) | Cardápio WhatsApp | Grátis ou 49,90 | Pedido formatado no WhatsApp | Não informado | Não informado | Não informado |
| [API oficial do WhatsApp](https://chatmaxima.com/pt-br/whatsapp-api-pricing/brazil/) (Meta) | Infraestrutura para robôs e disparos | Por mensagem: marketing R$ 0,32 · utilidade R$ 0,035 (+15–25% do provedor) | Número oficial, sem risco de banimento por automação | — | — | — |

Nenhuma cobra comissão por pedido (só taxas de pagamento online). Para comparação, marketplaces como iFood cobram de 23% a 30% por pedido ([Correio Braziliense, 2022](https://www.correiobraziliense.com.br/economia/2022/02/amp/4982972-restaurantes-criam-delivery-proprio-para-fugir-da-dependencia-do-ifood.html)).

## Categorias do mercado

| Camada | O que resolve | Exemplos | Custo típico |
| --- | --- | --- | --- |
| Atendente de WhatsApp + cardápio digital | Responde o cliente, envia o cardápio, fecha o pedido e o pagamento, avisa status | Anota AI, Brendi, Cardápio Web, Goomer, OlaClick | R$ 0 a R$ 300/mês |
| Gestão / PDV | Caixa, mesas e comandas, cozinha (KDS), estoque, financeiro, NFC-e, acerto de motoboy | Saipos, Consumer, Cardápio Web (Premium) | R$ 45 a R$ 625/mês |
| Infraestrutura WhatsApp | Número oficial para robôs e disparos sem risco de bloqueio | API oficial da Meta, via provedor | Por mensagem enviada |
| Marketplace | Novos clientes e entrega terceirizada | iFood, 99Food, Aiqfome | 23% a 30% por pedido |

Robôs que operam no número comum do WhatsApp Business (não API) têm relatos de números banidos.

## Matriz de pontuação ponderada (sem iFood)

| Critério | Peso | Anota AI | Cardápio Web | Saipos | Goomer |
| --- | --- | --- | --- | --- | --- |
| Atendimento no WhatsApp (robô/IA, status do pedido) | 30% | 5 | 4 | 2 | 3 |
| Custo para pequeno porte | 25% | 4 | 3 | 3 | 5 |
| Gestão e fiscal (NFC-e, KDS, estoque) | 20% | 2 | 4 | 5 | 1 |
| Salão (mesas, comandas, garçom) | 15% | 3 | 5 | 5 | 4 |
| Clareza de preço e contrato | 10% | 3 | 2 | 3 | 5 |
| **Total ponderado** | **100%** | **3,65** | **3,70** | **3,40** | **3,45** |

Cenário focado em delivery (WhatsApp 40%, custo 30%, fiscal 10%, salão 10%, clareza 10%): Anota AI 4,00 · Goomer 3,70 · Cardápio Web 3,60 · Saipos 3,00.

## Conclusão que levou ao desenvolvimento próprio

Nenhuma ferramenta pesquisada atende ao mesmo tempo: pedido **na conversa** (sem empurrar o cliente para um cardápio digital), atendimento direcionado pelo histórico do cliente e um **gerente virtual** no WhatsApp para estoque e compras. Daí a decisão de desenvolver o sistema — ver [requisitos](requisitos.md).

## Fontes

- [Saipos — Planos e preços](https://saipos.com/planos-e-precos)
- [Goomer — Planos](https://www.goomer.com.br/planos)
- [Cardápio Web](https://www.cardapioweb.com/)
- [Anota AI](https://anota.ai/planos)
- [Cardapily — preços do Anota AI (set/2026)](https://cardapily.com.br/cardapio-digital/guias/anota-ai-preco-alternativa)
- [Brendi — sistema para hamburgueria](https://brendi.com.br/blog/melhor-sistema-gestao-delivery-hamburgueria/)
- [Rei do Delivery — comparativo](https://reidodelivery.com.br/blog/melhores-sistemas-de-cardapio-digital)
- [GetApp — Consumer](https://www.getapp.com/all-software/a/consumer/)
- [Techleap — OlaClick](https://finder.techleap.nl/companies/olaclick_1)
- [Saipos — Neemo](https://saipos.com/neemo)
- [ChatMaxima — preço da API do WhatsApp no Brasil](https://chatmaxima.com/pt-br/whatsapp-api-pricing/brazil/)
- [Correio Braziliense — taxas de marketplaces (2022)](https://www.correiobraziliense.com.br/economia/2022/02/amp/4982972-restaurantes-criam-delivery-proprio-para-fugir-da-dependencia-do-ifood.html)
