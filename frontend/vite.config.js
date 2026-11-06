import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  const djangoProxy = {
    target: "http://127.0.0.1:8000",
    changeOrigin: true,
  };

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 5173,
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
