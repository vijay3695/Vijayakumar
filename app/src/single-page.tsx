import React from "react";
import { createRoot } from "react-dom/client";
import { renderPage, flipbookStyles, TOTAL_PAGES } from "./page-defs";

const params = new URLSearchParams(window.location.search);
const pageIndex = parseInt(params.get("page") || "0", 10);

const root = document.getElementById("root");
if (root) {
  const style = document.createElement("style");
  style.textContent = flipbookStyles.replace(/^@import[^;]+;\s*/m, "");
  document.head.appendChild(style);
  const container = document.createElement("div");
  container.style.width = "1440px";
  container.style.height = "1986px";
  container.style.overflow = "hidden";
  container.style.background = "#f4f0e6";
  root.appendChild(container);
  const reactRoot = createRoot(container);
  const idx = Math.min(pageIndex, TOTAL_PAGES - 1);
  reactRoot.render(renderPage(idx));
}
