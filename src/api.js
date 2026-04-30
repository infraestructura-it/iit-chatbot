import { ANTHROPIC_KEY, MODEL, MAX_TOKENS } from "./config.js";

const BASE_SYSTEM = `Eres el asistente experto de InfraestructuraIT (IIT), empresa colombiana de Bogotá 
especializada en infraestructura IT: data centers, IoT, redes, energía solar y automatización con IA.
Responde SIEMPRE en español. Sé conciso, técnico pero accesible. 
Usa ejemplos del contexto colombiano cuando sea relevante.
No uses markdown excesivo — respuestas limpias y directas.
Máximo 3 párrafos por respuesta salvo que te pidan más detalle.`;

export async function sendMessage(messages, topic) {
  // ── OPCIÓN A: Directo a Anthropic ─────────────────────────────────────────
  if (ANTHROPIC_KEY) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: `${BASE_SYSTEM}\n\nTema actual: ${topic.title}. ${topic.system}`,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.content?.[0]?.text || "Sin respuesta.";
  }

  // ── OPCIÓN B: Relay propio (relay.js / PM2) ────────────────────────────────
  // Descomenta y ajusta si usas tu relay en VPS:
  /*
  const { RELAY_URL } = await import("./config.js");
  const res = await fetch(RELAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer TU_TOKEN_RELAY",
    },
    body: JSON.stringify({
      topic: topic.title,
      system_extra: topic.system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  const data = await res.json();
  return data.reply || data.text || "Sin respuesta.";
  */

  throw new Error("No hay API configurada. Agrega VITE_ANTHROPIC_API_KEY en .env");
}
