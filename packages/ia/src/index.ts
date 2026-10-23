// Configuração dos agentes de IA (docs/arquitetura-tecnica.md, seções 5 e 6).
// Os agentes e ferramentas serão implementados aqui; o modelo só age por ferramentas (ADR-0003).

export type Agente = "atendimento" | "gerente";

export const CONFIG_AGENTES = {
  atendimento: { modelo: "claude-opus-5-5", esforco: "low" },
  gerente: { modelo: "claude-opus-5-5", esforco: "medium" },
} as const satisfies Record<Agente, { modelo: string; esforco: "low" | "medium" | "high" }>;

export const FERRAMENTAS: Record<Agente, readonly string[]> = {
  atendimento: [
    "buscar_ficha_cliente",
    "consultar_cardapio",
    "repetir_ultimo_pedido",
    "atualizar_rascunho",
    "calcular_entrega",
    "resumir_pedido",
    "consultar_status_pedido",
    "consultar_pontos",
    "registrar_preferencia",
    "escalar_para_humano",
  ],
  gerente: [
    "ler_nota_fiscal",
    "registrar_entrada",
    "registrar_falta",
    "registrar_reposicao",
    "lista_de_compras",
    "criar_lembrete",
    "consultar_vendas",
    "consultar_estoque",
    "abrir_caixa",
    "fechar_caixa",
    "lancar_conta",
  ],
};
