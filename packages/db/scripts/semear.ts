// Cardápio e bairros FICTÍCIOS para desenvolvimento (substituídos pelos reais na F0-03/F0-04).
// Pode rodar mais de uma vez: se já houver cardápio, não faz nada.
import { count } from "drizzle-orm";
import { deReais } from "@claudia-food/dominio";
import {
  bairros,
  categorias,
  criarBanco,
  gruposOpcoes,
  itensCardapio,
  itensGrupos,
  opcoes,
} from "../src/index.js";

const { banco, fechar } = criarBanco();

const [{ total } = { total: 0 }] = await banco.select({ total: count() }).from(itensCardapio);
if (total > 0) {
  console.log(`Cardápio já existe (${total} itens). Nada a fazer.`);
  await fechar();
  process.exit(0);
}

await banco.transaction(async (tx) => {
  const [lanches, porcoes, bebidas] = await tx
    .insert(categorias)
    .values([
      { nome: "Lanches", ordem: 1 },
      { nome: "Porções", ordem: 2 },
      { nome: "Bebidas", ordem: 3 },
    ])
    .returning();

  const [ponto, adicionais, retirar] = await tx
    .insert(gruposOpcoes)
    .values([
      { nome: "Ponto da carne", tipo: "escolher", minimo: 1, maximo: 1 },
      { nome: "Adicionais", tipo: "adicionar", minimo: 0, maximo: 5 },
      { nome: "Retirar", tipo: "remover", minimo: 0, maximo: 6 },
    ])
    .returning();

  const opcao = (grupoId: string, nome: string, preco: string, ordem: number) => ({
    grupoId,
    nome,
    precoCentavos: deReais(preco),
    ordem,
  });
  await tx
    .insert(opcoes)
    .values([
      opcao(ponto!.id, "Mal passado", "0", 1),
      opcao(ponto!.id, "Ao ponto", "0", 2),
      opcao(ponto!.id, "Bem passado", "0", 3),
      opcao(adicionais!.id, "Bacon", "4,00", 1),
      opcao(adicionais!.id, "Queijo extra", "3,00", 2),
      opcao(adicionais!.id, "Cheddar", "4,00", 3),
      opcao(adicionais!.id, "Ovo", "2,50", 4),
      opcao(adicionais!.id, "Hambúrguer extra", "9,00", 5),
      opcao(retirar!.id, "Sem cebola", "0", 1),
      opcao(retirar!.id, "Sem tomate", "0", 2),
      opcao(retirar!.id, "Sem alface", "0", 3),
      opcao(retirar!.id, "Sem picles", "0", 4),
      opcao(retirar!.id, "Sem maionese", "0", 5),
      opcao(retirar!.id, "Sem molho especial", "0", 6),
    ]);

  const item = (
    categoriaId: string,
    nome: string,
    preco: string,
    ordem: number,
    ingredientes?: string,
  ) => ({
    categoriaId,
    nome,
    precoCentavos: deReais(preco),
    ordem,
    ...(ingredientes ? { ingredientes } : {}),
  });
  const burgers = await tx
    .insert(itensCardapio)
    .values([
      item(
        lanches!.id,
        "X-Burger",
        "22,90",
        1,
        "Pão brioche, hambúrguer 150 g, queijo, molho especial",
      ),
      item(lanches!.id, "X-Salada", "24,90", 2, "X-Burger + alface, tomate e cebola"),
      item(lanches!.id, "X-Bacon", "28,90", 3, "X-Burger + bacon crocante"),
      item(lanches!.id, "X-Egg", "25,90", 4, "X-Burger + ovo"),
      item(lanches!.id, "X-Tudo", "34,90", 5, "Hambúrguer, bacon, ovo, queijo, salada e picles"),
      item(
        lanches!.id,
        "Smash Duplo",
        "31,90",
        6,
        "Dois smash 90 g, cheddar duplo, cebola caramelizada",
      ),
    ])
    .returning();
  const [frango, veggie] = await tx
    .insert(itensCardapio)
    .values([
      item(lanches!.id, "Frango Crispy", "27,90", 7, "Filé de frango empanado, alface, maionese"),
      item(lanches!.id, "Veggie", "29,90", 8, "Hambúrguer de grão-de-bico, queijo, salada"),
    ])
    .returning();
  await tx
    .insert(itensCardapio)
    .values([
      item(porcoes!.id, "Batata frita P", "12,00", 1),
      item(porcoes!.id, "Batata frita M", "16,00", 2),
      item(porcoes!.id, "Batata frita G", "20,00", 3),
      item(porcoes!.id, "Onion rings", "18,00", 4),
      item(bebidas!.id, "Refrigerante lata", "6,00", 1),
      item(bebidas!.id, "Refrigerante 2 L", "14,00", 2),
      item(bebidas!.id, "Suco natural", "9,00", 3),
      item(bebidas!.id, "Água", "4,00", 4),
    ]);

  // Ponto da carne só nos hambúrgueres de carne; adicionais e retirar em todos os lanches.
  await tx.insert(itensGrupos).values([
    ...burgers.map((b) => ({ itemId: b.id, grupoId: ponto!.id, ordem: 1 })),
    ...[...burgers, frango!, veggie!].flatMap((b) => [
      { itemId: b.id, grupoId: adicionais!.id, ordem: 2 },
      { itemId: b.id, grupoId: retirar!.id, ordem: 3 },
    ]),
  ]);

  await tx.insert(bairros).values([
    { nome: "Centro", taxaCentavos: deReais("5,00"), tempoEstimadoMin: 30 },
    { nome: "Vila Nova", taxaCentavos: deReais("6,00"), tempoEstimadoMin: 35 },
    { nome: "Jardim das Flores", taxaCentavos: deReais("7,00"), tempoEstimadoMin: 40 },
    { nome: "Bela Vista", taxaCentavos: deReais("8,00"), tempoEstimadoMin: 45 },
    { nome: "Distrito Industrial", taxaCentavos: deReais("10,00"), tempoEstimadoMin: 50 },
  ]);
});

console.log("Cardápio fictício criado: 3 categorias, 16 itens, 3 grupos de opções, 5 bairros.");
await fechar();
