import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["app/src/**/*.test.tsx", "app/src/**/*.test.ts"],
    setupFiles: ["./app/src/test/setup.ts"]
  }
});
