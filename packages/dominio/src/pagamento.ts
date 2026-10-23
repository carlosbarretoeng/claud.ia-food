// Pagamento é um status separado do pedido (FIN-01 a FIN-04).

export const STATUS_PAGAMENTO = ["pendente", "pago", "na_entrega", "estornado"] as const;
export type StatusPagamento = (typeof STATUS_PAGAMENTO)[number];

export const FORMAS_PAGAMENTO = ["pix", "cartao_online", "dinheiro", "cartao_maquininha"] as const;
export type FormaPagamento = (typeof FORMAS_PAGAMENTO)[number];

/** PIX pago ou pagamento combinado na entrega/retirada liberam o pedido para a cozinha (FIN-02, FIN-04). */
export function pagamentoLiberaPreparo(status: StatusPagamento): boolean {
  return status === "pago" || status === "na_entrega";
}
