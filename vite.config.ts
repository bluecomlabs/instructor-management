import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd());

  // 숫자로 변환 가능한 환경 변수들은 변환
  const port = env.VITE_PORT ? parseInt(env.VITE_PORT) : 8001;

  return {
    plugins: [vue()],
    server: {
      port, // env에서 설정한 포트 사용

      host: '0.0.0.0', // 외부에서 접근할 수 있도록 설정
      hmr: {
        host: env.VITE_WWW_URL, // HMR 웹소켓 연결을 위한 호스트
        protocol: 'wss', // HTTPS 환경에서 WebSocket을 사용
      },
    },
    resolve: {
      alias: {
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    base: env.VITE_BASE_URL || "/", // env 파일에 설정된 base URL 사용
    build: {
      chunkSizeWarningLimit: 3000,
    },
  };
});
