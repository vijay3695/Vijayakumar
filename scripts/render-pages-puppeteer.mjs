import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import puppeteer from "/workspace/app/node_modules/puppeteer/lib/puppeteer/puppeteer.js";

const PROJECT_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PAGES_DIR = path.join(PROJECT_ROOT, "dist", "openzine-pages");
const BOOK_OUT = path.join(PROJECT_ROOT, "openzine-book.html");
const MAKE_BOOK = path.join(PROJECT_ROOT, ".codex", "skills", "openzine", "scripts", "make-book.mjs");
const CHROME = "/tmp/kilo-worktrees/a7daf38377cbcc3d4edf2a6223cd49ae02aaef69075accb69d652f17e0f3fdca/.cache/puppeteer/chrome/linux-155.0.8059.39/chrome-linux64/chrome";

const PAGE_WIDTH = 1440;
const PAGE_HEIGHT = 1986;
const TOTAL_PAGES = 14;

await fs.mkdir(PAGES_DIR, { recursive: true });

// Create HTML wrapper
const htmlWrapper = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;background:#f4f0e6}</style></head><body><div id="root" style="width:1440px;height:1986px;overflow:hidden;background:#f4f0e6"></div><script type="module" src="/page-render.js"></script></body></html>`;
await fs.writeFile(path.join(PROJECT_ROOT, "dist-render", "index.html"), htmlWrapper);

// Start HTTP server
const http = await import("node:http");
const server = http.createServer((req, res) => {
  const url = req.url === "/" ? "/index.html" : req.url;
  const filePath = path.join(PROJECT_ROOT, "dist-render", url.split("?")[0]);
  fs.readFile(filePath).then(data => {
    const ext = path.extname(filePath);
    const types = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css" };
    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
    res.end(data);
  }).catch(() => {
    res.writeHead(404);
    res.end("Not found");
  });
});
server.listen(9876, () => console.log("Server running on port 9876"));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});

for (let i = 0; i < TOTAL_PAGES; i++) {
  const page = await browser.newPage();
  await page.setViewport({ width: PAGE_WIDTH, height: PAGE_HEIGHT, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:9876/?page=${i}`, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(PAGES_DIR, `page-${String(i + 1).padStart(2, "0")}.png`),
    type: "png",
    clip: { x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT },
  });
  console.log(`Rendered page ${i + 1}/${TOTAL_PAGES}`);
  await page.close();
}

await browser.close();
server.close();

// Run make-book.mjs
const child = spawn("node", [MAKE_BOOK, "--input", PAGES_DIR, "--out", BOOK_OUT, "--title", "Vijayakumar Chandiran \u2014 Interactive Resume", "--portrait", "single"], {
  stdio: "inherit",
  cwd: PROJECT_ROOT,
});
child.on("close", (code) => {
  if (code === 0) {
    console.log("Book created at:", BOOK_OUT);
  } else {
    console.error("make-book failed with code", code);
    process.exit(1);
  }
});
