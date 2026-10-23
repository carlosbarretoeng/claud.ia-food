import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Painel da loja (PED-01 e seguintes). Esqueleto: a fila de pedidos em tempo real vem a seguir.

function Painel() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 20 }}>Fila de pedidos</h1>
      <p>Nenhum pedido ainda.</p>
    </main>
  );
}

createRoot(document.getElementById("raiz")!).render(
  <StrictMode>
    <Painel />
  </StrictMode>,
);
