import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // relative base so the build works on GitHub Pages project paths
  // (vijay3695.github.io/Vijayakumar/) and on a custom domain, unchanged
  base: "./",
  build: {
    outDir: "dist",
    target: "es2020",
    assetsDir: "assets"
  },
  server: { host: true, port: 5173 }
});
