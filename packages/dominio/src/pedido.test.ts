import { describe, expect, it } from "vitest";
import { podeTransicionar } from "./pedido.js";

const entregaIa = { tipo: "entrega", perfil: "ia", pagamento: "pago" } as const;

describe("podeTransicionar", () => {
  it("segue o fluxo feliz de uma entrega", () => {
    expect(podeTransicionar("rascunho", "aguardando_confirmacao", entregaIa).ok).toBe(true);
    expect(podeTransicionar("aguardando_confirmacao", "confirmado", entregaIa).ok).toBe(true);
    expect(podeTransicionar("confirmado", "em_preparo", entregaIa).ok).toBe(true);
    expect(podeTransicionar("pronto", "saiu_para_entrega", entregaIa).ok).toBe(true);
    expect(podeTransicionar("saiu_para_entrega", "concluido", entregaIa).ok).toBe(true);
  });

  it("não deixa pular a confirmação do cliente (ATD-10)", () => {
    expect(podeTransicionar("rascunho", "confirmado", entregaIa).ok).toBe(false);
  });

  it("só manda para a cozinha com PIX pago ou pagamento na entrega (FIN-02)", () => {
    const pendente = { ...entregaIa, pagamento: "pendente" } as const;
    expect(podeTransicionar("confirmado", "em_preparo", pendente)).toMatchObject({ ok: false });
    const naEntrega = { ...entregaIa, pagamento: "na_entrega" } as const;
    expect(podeTransicionar("confirmado", "em_preparo", naEntrega).ok).toBe(true);
  });

  it("não usa status de outro tipo de pedido", () => {
    expect(podeTransicionar("pronto", "servido", entregaIa).ok).toBe(false);
    const local = { tipo: "local", perfil: "atendente", pagamento: "na_entrega" } as const;
    expect(podeTransicionar("pronto", "servido", local).ok).toBe(true);
  });

  it("exige gerente para cancelar depois do início do preparo", () => {
    expect(podeTransicionar("confirmado", "cancelado", entregaIa).ok).toBe(true);
    expect(podeTransicionar("em_preparo", "cancelado", entregaIa).ok).toBe(false);
    const gerente = { ...entregaIa, perfil: "gerente" } as const;
    expect(podeTransicionar("em_preparo", "cancelado", gerente).ok).toBe(true);
  });

  it("não sai de status finais", () => {
    const gerente = { ...entregaIa, perfil: "gerente" } as const;
    expect(podeTransicionar("concluido", "cancelado", gerente).ok).toBe(false);
  });
});
