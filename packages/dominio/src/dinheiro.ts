// Valores em dinheiro sempre em centavos inteiros (R$ 32,90 = 3290): sem erro de arredondamento.

export type Centavos = number & { readonly __centavos: unique symbol };

export function centavos(valor: number): Centavos {
  if (!Number.isSafeInteger(valor)) throw new Error(`Centavos precisam ser inteiros: ${valor}`);
  return valor as Centavos;
}

/** Converte texto em reais ("32,90", "R$ 1.032,90", "32.9") para centavos. */
export function deReais(texto: string): Centavos {
  const limpo = texto.replace(/R\$|\s/g, "");
  const normalizado = limpo.includes(",") ? limpo.replace(/\./g, "").replace(",", ".") : limpo;
  if (!/^-?\d+(\.\d{1,2})?$/.test(normalizado)) throw new Error(`Valor inválido: ${texto}`);
  return centavos(Math.round(Number(normalizado) * 100));
}

const formato = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 3290 → "R$ 32,90" (com espaço não separável, como o Intl gera). */
export function formatarReais(valor: Centavos): string {
  return formato.format(valor / 100);
}

export function somar(...valores: Centavos[]): Centavos {
  return centavos(valores.reduce((total, v) => total + v, 0));
}

export function multiplicar(valor: Centavos, quantidade: number): Centavos {
  if (!Number.isInteger(quantidade))
    throw new Error(`Quantidade precisa ser inteira: ${quantidade}`);
  return centavos(valor * quantidade);
}
