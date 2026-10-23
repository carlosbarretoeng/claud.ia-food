// Gateway de mensagens (ADR-0004): uma interface, duas implementações (simulador e cloud_api).

export type ConteudoRecebido =
  | { tipo: "texto"; texto: string }
  | { tipo: "audio"; midiaId: string }
  | { tipo: "imagem"; midiaId: string; legenda?: string }
  | { tipo: "botao"; botaoId: string; titulo: string };

export interface MensagemRecebida {
  /** ID da mensagem no WhatsApp; usado para idempotência (RNF-06). */
  id: string;
  /** Telefone do remetente no formato E.164 sem "+", como a Cloud API envia. */
  de: string;
  nomePerfil?: string;
  /** Data/hora em que o WhatsApp recebeu a mensagem. */
  em: Date;
  conteudo: ConteudoRecebido;
}

export type ConteudoEnviado =
  | { tipo: "texto"; texto: string }
  | { tipo: "botoes"; texto: string; botoes: { id: string; titulo: string }[] }
  | { tipo: "modelo"; nome: string; idioma: string; parametros: string[] };

export interface MensagemEnviada {
  para: string;
  conteudo: ConteudoEnviado;
  /** Pedido a que o envio pertence, para o orçamento de mensagens (RNF-18). */
  pedidoId?: string;
}

export type ResultadoEnvio =
  | { ok: true; id: string }
  | {
      ok: false;
      erro: "fora_da_janela_24h" | "mensagem_invalida" | "falha_envio";
      detalhe?: string;
    };

export interface GatewayMensagens {
  enviar(mensagem: MensagemEnviada): Promise<ResultadoEnvio>;
}

/** Janela de atendimento do WhatsApp: mensagem livre só até 24 h após a última do cliente. */
export const JANELA_ATENDIMENTO_MS = 24 * 60 * 60 * 1000;
