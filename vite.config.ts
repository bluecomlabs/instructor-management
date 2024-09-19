import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 외부에서 접근할 수 있도록 설정
    port: 8001, // 개발 서버의 포트
    hmr: {
      host: 'ulsan.sweduhub.com', // HMR 웹소켓 연결을 위한 호스트
      protocol: 'wss', // HTTPS 환경에서 WebSocket을 사용
    },
  },
  resolve: {
    alias: {
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: "/",
  build: {
    chunkSizeWarningLimit: 3000,
  },
});
