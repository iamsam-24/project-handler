import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const threeUiSource = fileURLToPath(
  new URL("./src/shaders/landing-pages/LandingPages.tsx", import.meta.url),
);
const threeUiStyle = fileURLToPath(
  new URL("./src/shaders/threeui.css", import.meta.url),
);

const backend = process.env.VITE_BACKEND_URL ?? "http://localhost:8080";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@designcodeio\/threeui\/style\.css$/, replacement: threeUiStyle },
      { find: "@designcodeio/threeui", replacement: threeUiSource },
    ],
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: backend,
        changeOrigin: true,
      },
      "/chat": {
        target: backend,
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
