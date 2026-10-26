import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const frontendUrl = cleanTunnelUrl(env.VITE_NGROK_FRONTEND_URL);
  const ngrokHost = frontendUrl
    ? new URL(frontendUrl).hostname
    : undefined;
  const djangoProxy = {
    target: "http://127.0.0.1:8000",
    changeOrigin: true,
  };

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 5173,
      allowedHosts: ngrokHost ? [ngrokHost] : [],
      proxy: {
        "/management/api": djangoProxy,
        "/management/admin/": djangoProxy,
        "/management/login/": djangoProxy,
        "/management/logout/": djangoProxy,
        "/head": djangoProxy,
        "/api": djangoProxy,
        "/get/": djangoProxy,
        "/my/": djangoProxy,
        "/login/": djangoProxy,
        "/signup/": djangoProxy,
        "/logout/": djangoProxy,
        "/token": djangoProxy,
        "/static": djangoProxy,
        "/media": djangoProxy,
      },
    },
  };
});

function cleanTunnelUrl(value) {
  return value?.split("->", 1)[0].trim().replace(/\/+$/, "");
}
