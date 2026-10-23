import { describe, expect, it } from "vitest";
import { podeTransicionar } from "./pedido.js";

const entregaIa = { tipo: "entrega", perfil: "ia" } as const;

describe("podeTransicionar", () => {
  it("segue o fluxo feliz de uma entrega", () => {
    expect(podeTransicionar("rascunho", "aguardando_confirmacao", entregaIa).ok).toBe(true);
    expect(podeTransicionar("aguardando_confirmacao", "confirmado", entregaIa).ok).toBe(true);
    expect(podeTransicionar("pronto", "saiu_para_entrega", entregaIa).ok).toBe(true);
    expect(podeTransicionar("saiu_para_entrega", "concluido", entregaIa).ok).toBe(true);
  });

  it("não deixa pular a confirmação do cliente (ATD-10)", () => {
    expect(podeTransicionar("rascunho", "confirmado", entregaIa).ok).toBe(false);
  });

  it("não usa status de outro tipo de pedido", () => {
    expect(podeTransicionar("pronto", "servido", entregaIa).ok).toBe(false);
    expect(podeTransicionar("pronto", "servido", { tipo: "local", perfil: "atendente" }).ok).toBe(
      true,
    );
  });

  it("exige gerente para cancelar depois do início do preparo", () => {
    expect(podeTransicionar("confirmado", "cancelado", entregaIa).ok).toBe(true);
    expect(podeTransicionar("em_preparo", "cancelado", entregaIa).ok).toBe(false);
    expect(
      podeTransicionar("em_preparo", "cancelado", { tipo: "entrega", perfil: "gerente" }).ok,
    ).toBe(true);
  });

  it("não sai de status finais", () => {
    expect(
      podeTransicionar("concluido", "cancelado", { tipo: "local", perfil: "gerente" }).ok,
    ).toBe(false);
  });
});
