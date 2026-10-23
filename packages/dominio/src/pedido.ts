// Ciclo de vida do pedido (docs/requisitos.md, seção 4 — Módulo 2).
import { pagamentoLiberaPreparo, type StatusPagamento } from "./pagamento.js";

export const STATUS_PEDIDO = [
  "rascunho",
  "aguardando_confirmacao",
  "confirmado",
  "em_preparo",
  "pronto",
  "saiu_para_entrega",
  "aguardando_retirada",
  "servido",
  "concluido",
  "cancelado",
] as const;

export type StatusPedido = (typeof STATUS_PEDIDO)[number];

export type TipoPedido = "entrega" | "retirada" | "local";

export type PerfilUsuario = "ia" | "atendente" | "cozinha" | "entregador" | "gerente";

const TRANSICOES: Record<StatusPedido, readonly StatusPedido[]> = {
  rascunho: ["aguardando_confirmacao", "cancelado"],
  aguardando_confirmacao: ["rascunho", "confirmado", "cancelado"],
  confirmado: ["em_preparo", "cancelado"],
  em_preparo: ["pronto", "cancelado"],
  pronto: ["saiu_para_entrega", "aguardando_retirada", "servido", "cancelado"],
  saiu_para_entrega: ["concluido"],
  aguardando_retirada: ["concluido", "cancelado"],
  servido: ["concluido"],
  concluido: [],
  cancelado: [],
};

const DESTINO_POR_TIPO: Partial<Record<StatusPedido, TipoPedido>> = {
  saiu_para_entrega: "entrega",
  aguardando_retirada: "retirada",
  servido: "local",
};

// A partir de "em preparo", cancelar exige gerente (seção 4 dos requisitos).
const CANCELAMENTO_SO_GERENTE: readonly StatusPedido[] = [
  "em_preparo",
  "pronto",
  "aguardando_retirada",
];

export type ResultadoTransicao = { ok: true } | { ok: false; motivo: string };

export function podeTransicionar(
  de: StatusPedido,
  para: StatusPedido,
  contexto: { tipo: TipoPedido; perfil: PerfilUsuario; pagamento: StatusPagamento },
): ResultadoTransicao {
  if (!TRANSICOES[de].includes(para)) {
    return { ok: false, motivo: `Transição inválida: ${de} → ${para}` };
  }
  const tipoExigido = DESTINO_POR_TIPO[para];
  if (tipoExigido && tipoExigido !== contexto.tipo) {
    return { ok: false, motivo: `Status ${para} não se aplica a pedido do tipo ${contexto.tipo}` };
  }
  if (
    para === "cancelado" &&
    CANCELAMENTO_SO_GERENTE.includes(de) &&
    contexto.perfil !== "gerente"
  ) {
    return { ok: false, motivo: "Cancelamento após o início do preparo exige gerente" };
  }
  if (para === "em_preparo" && !pagamentoLiberaPreparo(contexto.pagamento)) {
    return {
      ok: false,
      motivo: "Pagamento pendente: o pedido só vai para a cozinha depois do PIX pago",
    };
  }
  return { ok: true };
}
