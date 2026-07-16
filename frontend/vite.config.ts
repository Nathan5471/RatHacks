import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import prerender from "@prerenderer/rollup-plugin";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    prerender({
      routes: ["/", "/past-events"],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        spa: path.resolve(__dirname, "spa.html"),
      },
    },
  },
});
