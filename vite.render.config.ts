import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: "app/src/single-page.tsx",
      output: {
        entryFileNames: "single-page.js",
      },
    },
    outDir: "dist-render",
  },
});
