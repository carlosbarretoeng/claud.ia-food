import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Encaminha os webhooks simulados para a API (no Docker: http://api:3000).
    proxy: { "/webhooks": process.env.API_URL ?? "http://localhost:3000" },
  },
});
