import { describe, expect, it } from "vitest";
import { centavos, deReais, formatarReais, multiplicar, somar } from "./dinheiro.js";

describe("dinheiro", () => {
  it("converte texto em reais para centavos", () => {
    expect(deReais("32,90")).toBe(3290);
    expect(deReais("R$ 1.032,90")).toBe(103290);
    expect(deReais("32.9")).toBe(3290);
    expect(deReais("8")).toBe(800);
    expect(() => deReais("abc")).toThrow();
    expect(() => deReais("1,234")).toThrow();
  });

  it("formata em reais", () => {
    expect(formatarReais(centavos(3290)).replace(/\s/g, " ")).toBe("R$ 32,90");
  });

  it("soma e multiplica sem erro de ponto flutuante", () => {
    expect(somar(centavos(10), centavos(20))).toBe(30);
    expect(multiplicar(centavos(3290), 3)).toBe(9870);
    expect(() => centavos(0.1 + 0.2)).toThrow();
  });
});
