import type { ConteudoRecebido, MensagemRecebida } from "./tipos.js";

// Subconjunto do payload de webhook da WhatsApp Cloud API usado pelo sistema.
// O simulador envia exatamente este formato, para a troca por cloud_api ser só configuração.
export interface PayloadWebhookWhatsApp {
  object: "whatsapp_business_account";
  entry: {
    id: string;
    changes: {
      field: string;
      value: {
        messaging_product: "whatsapp";
        contacts?: { wa_id: string; profile?: { name?: string } }[];
        messages?: MensagemCloudApi[];
      };
    }[];
  }[];
}

export interface MensagemCloudApi {
  id: string;
  from: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  audio?: { id: string };
  image?: { id: string; caption?: string };
  interactive?: { type: string; button_reply?: { id: string; title: string } };
}

function converterConteudo(m: MensagemCloudApi): ConteudoRecebido | undefined {
  if (m.type === "text" && m.text) return { tipo: "texto", texto: m.text.body };
  if (m.type === "audio" && m.audio) return { tipo: "audio", midiaId: m.audio.id };
  if (m.type === "image" && m.image) {
    return m.image.caption === undefined
      ? { tipo: "imagem", midiaId: m.image.id }
      : { tipo: "imagem", midiaId: m.image.id, legenda: m.image.caption };
  }
  if (m.type === "interactive" && m.interactive?.button_reply) {
    const b = m.interactive.button_reply;
    return { tipo: "botao", botaoId: b.id, titulo: b.title };
  }
  return undefined;
}

/** Extrai as mensagens suportadas de um webhook; tipos não suportados são ignorados. */
export function extrairMensagens(payload: PayloadWebhookWhatsApp): MensagemRecebida[] {
  const resultado: MensagemRecebida[] = [];
  for (const entry of payload.entry) {
    for (const change of entry.changes) {
      if (change.field !== "messages") continue;
      const nomes = new Map(
        (change.value.contacts ?? []).map((c) => [c.wa_id, c.profile?.name] as const),
      );
      for (const m of change.value.messages ?? []) {
        const conteudo = converterConteudo(m);
        if (!conteudo) continue;
        const nome = nomes.get(m.from);
        resultado.push({
          id: m.id,
          de: m.from,
          em: new Date(Number(m.timestamp) * 1000),
          conteudo,
          ...(nome === undefined ? {} : { nomePerfil: nome }),
        });
      }
    }
  }
  return resultado;
}
