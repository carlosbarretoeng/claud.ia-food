import { describe, expect, it } from "vitest";
import type { MensagemRecebida } from "@claudia-food/mensageria";
import { criarApp } from "./app.js";

function montar() {
  const recebidas: MensagemRecebida[] = [];
  const vistas = new Set<string>();
  const app = criarApp({
    tokenVerificacaoWebhook: "token-de-teste",
    aoReceber: async (m) => {
      recebidas.push(...m);
    },
    marcarComoProcessada: async (id) => (vistas.has(id) ? false : (vistas.add(id), true)),
  });
  app.log.level = "silent";
  return { app, recebidas };
}

const webhook = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "waba",
      changes: [
        {
          field: "messages",
          value: {
            messaging_product: "whatsapp",
            messages: [
              {
                id: "wamid.1",
                from: "5565999990000",
                timestamp: "1792700000",
                type: "text",
                text: { body: "oi" },
              },
            ],
          },
        },
      ],
    },
  ],
};

describe("api", () => {
  it("responde à verificação do webhook só com o token certo", async () => {
    const { app } = montar();
    const ok = await app.inject({
      url: "/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=token-de-teste&hub.challenge=123",
    });
    expect(ok.statusCode).toBe(200);
    expect(ok.body).toBe("123");
    const negado = await app.inject({
      url: "/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=errado&hub.challenge=123",
    });
    expect(negado.statusCode).toBe(403);
  });

  it("processa cada mensagem uma única vez (RNF-06)", async () => {
    const { app, recebidas } = montar();
    for (let i = 0; i < 2; i++) {
      const r = await app.inject({ method: "POST", url: "/webhooks/whatsapp", payload: webhook });
      expect(r.statusCode).toBe(200);
    }
    expect(recebidas).toHaveLength(1);
    expect(recebidas[0]?.conteudo).toEqual({ tipo: "texto", texto: "oi" });
  });
});
