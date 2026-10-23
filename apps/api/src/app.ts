import Fastify from "fastify";
import {
  extrairMensagens,
  type MensagemRecebida,
  type PayloadWebhookWhatsApp,
} from "@claudia-food/mensageria";

export interface OpcoesApp {
  /** Token que a Meta envia na verificação do webhook (WHATSAPP_WEBHOOK_VERIFY_TOKEN). */
  tokenVerificacaoWebhook: string;
  /** Recebe as mensagens novas; a Recepção (agrupamento, IA) entra aqui. */
  aoReceber: (mensagens: MensagemRecebida[]) => Promise<void>;
  /** Idempotência (RNF-06): devolve true se a mensagem ainda não foi processada. */
  marcarComoProcessada: (idWhatsapp: string) => Promise<boolean>;
}

export function criarApp(opcoes: OpcoesApp) {
  const app = Fastify({ logger: { level: process.env.LOG_LEVEL ?? "info" } });

  app.get("/saude", async () => ({ ok: true }));

  // Verificação do webhook pela Meta (hub.challenge).
  app.get<{ Querystring: Record<string, string | undefined> }>(
    "/webhooks/whatsapp",
    async (req, reply) => {
      const q = req.query;
      if (
        q["hub.mode"] === "subscribe" &&
        q["hub.verify_token"] === opcoes.tokenVerificacaoWebhook
      ) {
        return reply.type("text/plain").send(q["hub.challenge"] ?? "");
      }
      return reply.code(403).send();
    },
  );

  // Mesmo endpoint para o simulador e para a Cloud API (ADR-0004).
  // TODO: validar a assinatura X-Hub-Signature-256 quando MENSAGERIA=cloud_api.
  app.post<{ Body: PayloadWebhookWhatsApp }>("/webhooks/whatsapp", async (req, reply) => {
    const novas: MensagemRecebida[] = [];
    for (const m of extrairMensagens(req.body)) {
      if (await opcoes.marcarComoProcessada(m.id)) novas.push(m);
    }
    if (novas.length > 0) await opcoes.aoReceber(novas);
    // A Meta espera 200 rápido; o processamento pesado vai para a fila.
    return reply.code(200).send();
  });

  return app;
}
