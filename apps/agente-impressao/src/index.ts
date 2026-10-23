// Agente de impressão (PED-05): roda no PC da loja, escuta a fila de impressão
// (Supabase Realtime) e imprime as comandas em ESC/POS na impressora térmica.
// Esqueleto: a conexão com a fila e com a impressora vêm no issue PED-05.

export function formatarComanda(numero: number, linhas: string[]): string {
  const largura = 42; // caracteres por linha em bobina de 80 mm (fonte padrão)
  const separador = "-".repeat(largura);
  return [
    separador,
    `PEDIDO #${numero}`.padStart((largura + 10) / 2),
    separador,
    ...linhas,
    separador,
  ].join("\n");
}

console.log(
  "Agente de impressão iniciado. Aguardando a fila de impressão (ainda não implementada).",
);
