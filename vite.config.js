import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base relativa: funciona em qualquer caminho do GitHub Pages (usuario.github.io/repositorio/)
export default defineConfig({
  base: "./",
  plugins: [react()]
});
