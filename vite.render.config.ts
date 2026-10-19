import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: "app/src/page-render.tsx",
      output: {
        entryFileNames: "page-render.js",
      },
    },
    outDir: "dist-render",
  },
});
