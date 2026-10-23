import { criarApp } from "./app.js";

const processadas = new Set<string>();

const app = criarApp({
  tokenVerificacaoWebhook: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ?? "",
  // Provisório até a Recepção e o banco: idempotência em memória e log das mensagens.
  marcarComoProcessada: async (id) => {
    if (processadas.has(id)) return false;
    processadas.add(id);
    return true;
  },
  aoReceber: async (mensagens) => {
    for (const m of mensagens)
      app.log.info({ de: m.de, conteudo: m.conteudo }, "mensagem recebida");
  },
});

const porta = Number(process.env.PORTA ?? 3000);
await app.listen({ port: porta, host: "0.0.0.0" });
