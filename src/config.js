// ─────────────────────────────────────────────
//  CONFIGURACIÓN IIT CHATBOT
// ─────────────────────────────────────────────

// OPCIÓN A: Anthropic API directo (desarrollo local)
// Crea un archivo .env en la raíz con:
//   VITE_ANTHROPIC_API_KEY=sk-ant-...
export const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "";

// OPCIÓN B: Tu relay.js propio (recomendado para producción)
// Descomenta y pon la URL de tu relay en VPS/PM2:
// export const RELAY_URL = "https://tu-dominio.com/api/ai/chat";

// ─── Modelo ───────────────────────────────────
export const MODEL = "claude-sonnet-4-20250514";
export const MAX_TOKENS = 1000;

// ─── Colores de marca IIT ─────────────────────
export const BRAND = {
  bg:     "#080b10",
  bgCard: "#0d1117",
  bgInput:"#111827",
  cyan:   "#00d4ff",
  green:  "#10b981",
  purple: "#7c3aed",
  border: "#1f2937",
  text:   "#e2e8f0",
  muted:  "#6b7280",
};
