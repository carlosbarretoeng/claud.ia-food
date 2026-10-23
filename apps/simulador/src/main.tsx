import { StrictMode, useState, type FormEvent } from "react";
import { createRoot } from "react-dom/client";

// Simulador de WhatsApp (F0-08, ADR-0004): envia à API o mesmo payload de webhook da Cloud API.
// Próximo passo: receber e exibir as respostas do sistema.

interface Bolha {
  id: string;
  texto: string;
  status: "enviando" | "entregue" | "erro";
}

function payloadDeTexto(id: string, telefone: string, nome: string, texto: string) {
  return {
    object: "whatsapp_business_account",
    entry: [
      {
        id: "waba-simulador",
        changes: [
          {
            field: "messages",
            value: {
              messaging_product: "whatsapp",
              contacts: [{ wa_id: telefone, profile: { name: nome } }],
              messages: [
                {
                  id,
                  from: telefone,
                  timestamp: String(Math.floor(Date.now() / 1000)),
                  type: "text",
                  text: { body: texto },
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

function Simulador() {
  const [telefone, setTelefone] = useState("5565999990000");
  const [nome, setNome] = useState("Cliente de teste");
  const [texto, setTexto] = useState("");
  const [bolhas, setBolhas] = useState<Bolha[]>([]);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;
    const id = `wamid.sim.${crypto.randomUUID()}`;
    setBolhas((b) => [...b, { id, texto, status: "enviando" }]);
    setTexto("");
    const r = await fetch("/webhooks/whatsapp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payloadDeTexto(id, telefone, nome, texto)),
    }).catch(() => undefined);
    const status = r?.ok ? "entregue" : "erro";
    setBolhas((b) => b.map((x) => (x.id === id ? { ...x, status } : x)));
  }

  return (
    <main style={{ maxWidth: 420, margin: "24px auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 18 }}>Simulador de WhatsApp</h1>
      <label>
        Telefone <input value={telefone} onChange={(e) => setTelefone(e.target.value)} />
      </label>{" "}
      <label>
        Nome <input value={nome} onChange={(e) => setNome(e.target.value)} />
      </label>
      <section style={{ minHeight: 300, background: "#efeae2", padding: 12, margin: "12px 0" }}>
        {bolhas.map((b) => (
          <p
            key={b.id}
            style={{ background: "#d9fdd3", marginLeft: "auto", width: "fit-content", padding: 8 }}
          >
            {b.texto}{" "}
            <small>{b.status === "entregue" ? "✓✓" : b.status === "erro" ? "⚠" : "…"}</small>
          </p>
        ))}
      </section>
      <form onSubmit={(e) => void enviar(e)} style={{ display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1 }}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Mensagem"
        />
        <button type="submit">Enviar</button>
      </form>
    </main>
  );
}

createRoot(document.getElementById("raiz")!).render(
  <StrictMode>
    <Simulador />
  </StrictMode>,
);
