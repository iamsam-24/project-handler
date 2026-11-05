import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backend = process.env.VITE_BACKEND_URL ?? "http://localhost:8080";

export default defineConfig({
  plugins: [react()],
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
        configure: (proxy) => {
          proxy.on("proxyReqWs", (proxyReq, req) => {
            try {
              const url = new URL(req.url ?? "", "http://localhost:5173");
              const token = url.searchParams.get("token");
              if (token) {
                proxyReq.setHeader("Authorization", `Bearer ${token}`);
              }
            } catch {
              // ignore
            }
          });
          proxy.on("error", () => {
            // Suppress noisy ECONNABORTED errors on client disconnect
          });
        },
      },
    },
  },
});
