import { describe, expect, it } from "vitest";
import { GatewaySimulador } from "./simulador.js";
import { extrairMensagens, type PayloadWebhookWhatsApp } from "./webhook.js";

const payload: PayloadWebhookWhatsApp = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "waba-ficticia",
      changes: [
        {
          field: "messages",
          value: {
            messaging_product: "whatsapp",
            contacts: [{ wa_id: "5565999990000", profile: { name: "João" } }],
            messages: [
              {
                id: "wamid.1",
                from: "5565999990000",
                timestamp: "1792700000",
                type: "text",
                text: { body: "o de sempre" },
              },
              {
                id: "wamid.2",
                from: "5565999990000",
                timestamp: "1792700005",
                type: "interactive",
                interactive: {
                  type: "button_reply",
                  button_reply: { id: "confirmar", title: "Confirmar" },
                },
              },
              { id: "wamid.3", from: "5565999990000", timestamp: "1792700006", type: "sticker" },
            ],
          },
        },
      ],
    },
  ],
};

describe("extrairMensagens", () => {
  it("converte texto e botão e ignora tipos não suportados", () => {
    const msgs = extrairMensagens(payload);
    expect(msgs).toHaveLength(2);
    expect(msgs[0]).toMatchObject({
      id: "wamid.1",
      de: "5565999990000",
      nomePerfil: "João",
      conteudo: { tipo: "texto", texto: "o de sempre" },
    });
    expect(msgs[1]?.conteudo).toEqual({ tipo: "botao", botaoId: "confirmar", titulo: "Confirmar" });
  });
});

describe("GatewaySimulador", () => {
  const contato = "5565999990000";

  it("recusa mensagem livre sem janela de 24 h aberta, mas aceita modelo", async () => {
    const gw = new GatewaySimulador();
    expect(await gw.enviar({ para: contato, conteudo: { tipo: "texto", texto: "oi" } })).toEqual({
      ok: false,
      erro: "fora_da_janela_24h",
    });
    const modelo = await gw.enviar({
      para: contato,
      conteudo: { tipo: "modelo", nome: "promocao", idioma: "pt_BR", parametros: [] },
    });
    expect(modelo.ok).toBe(true);
  });

  it("fecha a janela 24 h depois da última mensagem do cliente", async () => {
    let agora = new Date("2026-10-22T20:00:00Z");
    const gw = new GatewaySimulador(() => agora);
    gw.registrarRecebida({
      id: "wamid.1",
      de: contato,
      em: agora,
      conteudo: { tipo: "texto", texto: "oi" },
    });
    expect(gw.janelaAberta(contato)).toBe(true);
    agora = new Date("2026-10-23T20:00:01Z");
    expect(gw.janelaAberta(contato)).toBe(false);
  });

  it("conta envios por pedido (RNF-18)", async () => {
    const gw = new GatewaySimulador();
    gw.registrarRecebida({
      id: "w",
      de: contato,
      em: new Date(),
      conteudo: { tipo: "texto", texto: "oi" },
    });
    await gw.enviar({ para: contato, pedidoId: "p1", conteudo: { tipo: "texto", texto: "a" } });
    await gw.enviar({ para: contato, pedidoId: "p1", conteudo: { tipo: "texto", texto: "b" } });
    await gw.enviar({ para: contato, pedidoId: "p2", conteudo: { tipo: "texto", texto: "c" } });
    expect(gw.enviosDoPedido("p1")).toBe(2);
  });
});
