import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Vite 는 VITE_ 접두사가 붙은 값만 자동으로 노출한다. 서버 변수(API_BASE_URL 등)는
  // 브라우저에 새면 안 돼서 접두사를 안 쓰므로, .env 값을 process.env 로 직접 올린다.
  // 이미 실제 환경에 있는 값이 우선이다 — 배포 환경의 설정을 .env 가 덮지 않게.
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ""))) {
    process.env[key] ??= value;
  }

  return {
    plugins: [tailwindcss(), reactRouter()],
    resolve: {
      tsconfigPaths: true,
    },
  };
});
