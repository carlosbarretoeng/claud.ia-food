import { describe, expect, it } from "vitest";
import { calcularItem, type ItemCardapio } from "./cardapio.js";
import { centavos } from "./dinheiro.js";

const xBacon: ItemCardapio = {
  id: "x-bacon",
  nome: "X-Bacon",
  precoCentavos: centavos(2890),
  disponivel: true,
  grupos: [
    {
      id: "ponto",
      nome: "Ponto da carne",
      tipo: "escolher",
      minimo: 1,
      maximo: 1,
      opcoes: [
        { id: "ao-ponto", nome: "Ao ponto", precoCentavos: centavos(0), disponivel: true },
        { id: "bem", nome: "Bem passado", precoCentavos: centavos(0), disponivel: true },
      ],
    },
    {
      id: "adicionais",
      nome: "Adicionais",
      tipo: "adicionar",
      minimo: 0,
      maximo: 2,
      opcoes: [
        { id: "bacon", nome: "Bacon extra", precoCentavos: centavos(400), disponivel: true },
        { id: "cheddar", nome: "Cheddar", precoCentavos: centavos(400), disponivel: false },
        { id: "ovo", nome: "Ovo", precoCentavos: centavos(250), disponivel: true },
        { id: "queijo", nome: "Queijo extra", precoCentavos: centavos(300), disponivel: true },
      ],
    },
    {
      id: "retirar",
      nome: "Retirar",
      tipo: "remover",
      minimo: 0,
      maximo: 5,
      opcoes: [{ id: "cebola", nome: "Sem cebola", precoCentavos: centavos(0), disponivel: true }],
    },
  ],
};

describe("calcularItem", () => {
  it("soma o preço do item com os adicionais e guarda a foto das opções", () => {
    const r = calcularItem(xBacon, ["ao-ponto", "bacon", "cebola"]);
    expect(r).toEqual({
      ok: true,
      precoUnitarioCentavos: 3290,
      opcoes: [
        { opcaoId: "ao-ponto", nome: "Ao ponto", precoCentavos: 0 },
        { opcaoId: "bacon", nome: "Bacon extra", precoCentavos: 400 },
        { opcaoId: "cebola", nome: "Sem cebola", precoCentavos: 0 },
      ],
    });
  });

  it("exige o ponto da carne", () => {
    const r = calcularItem(xBacon, ["bacon"]);
    expect(r).toEqual({ ok: false, erros: ["Ponto da carne: escolha ao menos 1"] });
  });

  it("respeita o máximo de adicionais", () => {
    const r = calcularItem(xBacon, ["ao-ponto", "bacon", "ovo", "queijo"]);
    expect(r).toEqual({ ok: false, erros: ["Adicionais: no máximo 2"] });
  });

  it("recusa opção pausada, opção de outro item e item indisponível", () => {
    expect(calcularItem(xBacon, ["ao-ponto", "cheddar"])).toMatchObject({
      ok: false,
      erros: ["Cheddar está indisponível no momento"],
    });
    expect(calcularItem(xBacon, ["ao-ponto", "catupiry"])).toMatchObject({
      ok: false,
      erros: ["Opção catupiry não existe para X-Bacon"],
    });
    expect(calcularItem({ ...xBacon, disponivel: false }, ["ao-ponto"])).toMatchObject({
      ok: false,
      erros: ["X-Bacon está indisponível no momento"],
    });
  });

  it("ignora opção repetida", () => {
    const r = calcularItem(xBacon, ["ao-ponto", "bacon", "bacon"]);
    expect(r.ok && r.precoUnitarioCentavos).toBe(3290);
  });
});
