import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Cambia "iit-chatbot" por el nombre exacto de tu repo en GitHub
  base: "/iit-chatbot/",
});
