import type { MensagemEnviada } from "./tipos.js";

// Limites da WhatsApp Cloud API, aplicados igual no simulador e em produção:
// uma mensagem que passa no simulador não pode ser recusada pela Meta.
export const LIMITES_WHATSAPP = {
  textoLivre: 4096,
  corpoInterativo: 1024,
  botoesPorMensagem: 3,
  tituloBotao: 20,
  idBotao: 256,
} as const;

/** Devolve os problemas encontrados; lista vazia = mensagem válida. */
export function validarMensagem(mensagem: MensagemEnviada): string[] {
  const c = mensagem.conteudo;
  const problemas: string[] = [];
  if (c.tipo === "texto") {
    if (c.texto.trim() === "") problemas.push("Texto vazio");
    if (c.texto.length > LIMITES_WHATSAPP.textoLivre) {
      problemas.push(
        `Texto com ${c.texto.length} caracteres (máx. ${LIMITES_WHATSAPP.textoLivre})`,
      );
    }
  }
  if (c.tipo === "botoes") {
    if (c.texto.length > LIMITES_WHATSAPP.corpoInterativo) {
      problemas.push(
        `Texto com botões com ${c.texto.length} caracteres (máx. ${LIMITES_WHATSAPP.corpoInterativo})`,
      );
    }
    if (c.botoes.length < 1 || c.botoes.length > LIMITES_WHATSAPP.botoesPorMensagem) {
      problemas.push(`${c.botoes.length} botões (de 1 a ${LIMITES_WHATSAPP.botoesPorMensagem})`);
    }
    for (const b of c.botoes) {
      if (b.titulo.length > LIMITES_WHATSAPP.tituloBotao) {
        problemas.push(`Botão "${b.titulo}" passa de ${LIMITES_WHATSAPP.tituloBotao} caracteres`);
      }
      if (b.id.length === 0 || b.id.length > LIMITES_WHATSAPP.idBotao) {
        problemas.push(`ID do botão "${b.titulo}" inválido`);
      }
    }
    if (new Set(c.botoes.map((b) => b.id)).size !== c.botoes.length) {
      problemas.push("IDs de botão repetidos");
    }
  }
  return problemas;
}
