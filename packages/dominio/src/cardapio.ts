// Cardápio e preço de um item com as opções escolhidas (PED-20, PED-21, ATD-06).
// A IA nunca calcula preço: ela monta as escolhas e esta função valida e calcula.
import { somar, type Centavos } from "./dinheiro.js";

export type TipoGrupo = "adicionar" | "remover" | "escolher";

export interface Opcao {
  id: string;
  nome: string;
  precoCentavos: Centavos;
  disponivel: boolean;
}

export interface GrupoOpcoes {
  id: string;
  nome: string;
  tipo: TipoGrupo;
  minimo: number;
  maximo: number;
  opcoes: Opcao[];
}

export interface ItemCardapio {
  id: string;
  nome: string;
  precoCentavos: Centavos;
  disponivel: boolean;
  grupos: GrupoOpcoes[];
}

/** O que fica gravado no pedido: nome e preço do momento da venda. */
export interface OpcaoEscolhida {
  opcaoId: string;
  nome: string;
  precoCentavos: Centavos;
}

export type ResultadoItem =
  | { ok: true; precoUnitarioCentavos: Centavos; opcoes: OpcaoEscolhida[] }
  | { ok: false; erros: string[] };

export function calcularItem(item: ItemCardapio, idsOpcoes: readonly string[]): ResultadoItem {
  const erros: string[] = [];
  if (!item.disponivel) erros.push(`${item.nome} está indisponível no momento`);

  const opcoesDoItem = new Map(
    item.grupos.flatMap((g) => g.opcoes.map((o) => [o.id, { grupo: g, opcao: o }] as const)),
  );
  const escolhidas: OpcaoEscolhida[] = [];
  const porGrupo = new Map<string, number>();

  for (const id of new Set(idsOpcoes)) {
    const achada = opcoesDoItem.get(id);
    if (!achada) {
      erros.push(`Opção ${id} não existe para ${item.nome}`);
      continue;
    }
    if (!achada.opcao.disponivel) erros.push(`${achada.opcao.nome} está indisponível no momento`);
    porGrupo.set(achada.grupo.id, (porGrupo.get(achada.grupo.id) ?? 0) + 1);
    escolhidas.push({
      opcaoId: achada.opcao.id,
      nome: achada.opcao.nome,
      precoCentavos: achada.opcao.precoCentavos,
    });
  }

  for (const g of item.grupos) {
    const n = porGrupo.get(g.id) ?? 0;
    if (n < g.minimo) erros.push(`${g.nome}: escolha ao menos ${g.minimo}`);
    if (n > g.maximo) erros.push(`${g.nome}: no máximo ${g.maximo}`);
  }

  if (erros.length > 0) return { ok: false, erros };
  return {
    ok: true,
    precoUnitarioCentavos: somar(item.precoCentavos, ...escolhidas.map((o) => o.precoCentavos)),
    opcoes: escolhidas,
  };
}
