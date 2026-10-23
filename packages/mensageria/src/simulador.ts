import {
  JANELA_ATENDIMENTO_MS,
  type GatewayMensagens,
  type MensagemEnviada,
  type MensagemRecebida,
  type ResultadoEnvio,
} from "./tipos.js";
import { validarMensagem } from "./validacao.js";

export interface EnvioRegistrado extends MensagemEnviada {
  id: string;
  em: Date;
}

/**
 * Gateway em memória para desenvolvimento e testes (ADR-0004).
 * Aplica a regra da janela de 24 h e conta envios por pedido (RNF-18).
 */
export class GatewaySimulador implements GatewayMensagens {
  readonly enviadas: EnvioRegistrado[] = [];
  private readonly ultimaDoContato = new Map<string, Date>();
  private sequencia = 0;

  constructor(private readonly agora: () => Date = () => new Date()) {}

  /** Registra uma mensagem que chegou do contato, abrindo a janela de atendimento. */
  registrarRecebida(mensagem: MensagemRecebida): void {
    this.ultimaDoContato.set(mensagem.de, mensagem.em);
  }

  async enviar(mensagem: MensagemEnviada): Promise<ResultadoEnvio> {
    const problemas = validarMensagem(mensagem);
    if (problemas.length > 0) {
      return { ok: false, erro: "mensagem_invalida", detalhe: problemas.join("; ") };
    }
    if (mensagem.conteudo.tipo !== "modelo" && !this.janelaAberta(mensagem.para)) {
      return { ok: false, erro: "fora_da_janela_24h" };
    }
    const id = `sim.${++this.sequencia}`;
    this.enviadas.push({ ...mensagem, id, em: this.agora() });
    return { ok: true, id };
  }

  janelaAberta(contato: string): boolean {
    const ultima = this.ultimaDoContato.get(contato);
    return (
      ultima !== undefined && this.agora().getTime() - ultima.getTime() < JANELA_ATENDIMENTO_MS
    );
  }

  enviosDoPedido(pedidoId: string): number {
    return this.enviadas.filter((e) => e.pedidoId === pedidoId).length;
  }
}
