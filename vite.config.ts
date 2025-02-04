import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [vue()],
    server: {
      port : 8001,
      host: '0.0.0.0',
      hmr: {
        host: env.VITE_WWW_URL,
        protocol: 'wss',
      },
    },
    resolve: {
      alias: {
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    base: env.VITE_BASE_URL || "/",
    build: {
      chunkSizeWarningLimit: 3000,
    },
  };
});
