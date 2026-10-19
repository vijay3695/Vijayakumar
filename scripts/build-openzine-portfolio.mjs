import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { execFile } from "node:child_process";
import puppeteer from "puppeteer";

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(root, "dist");
const pagesDir = path.join(root, ".tmp-openzine-pages");
const previewUrl = "http://127.0.0.1:4173";
const skillDir = path.join(root, ".codex", "skills", "openzine");
const builder = path.join(skillDir, "scripts", "make-book.mjs");

await fs.rm(pagesDir, { recursive: true, force: true });
await fs.mkdir(pagesDir, { recursive: true });
await fs.access(path.join(outputDir, "index.html"));
await fs.access(builder);

const preview = spawn("npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", "4173", "--strictPort"], {
  cwd: root,
  stdio: "ignore",
  shell: process.platform === "win32"
});
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(previewUrl);
      if (response.ok) { ready = true; break; }
    } catch {}
    await delay(500);
  }
  if (!ready) throw new Error("Vite preview did not become ready on port 4173.");

  browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  const scale = 1440 / 620;
  await page.setViewport({ width: 620, height: 900, deviceScaleFactor: scale });
  await page.goto(previewUrl, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".book-page--current .paper-sheet", { timeout: 30000 });
  await Promise.race([
    page.evaluate(() => document.fonts.ready),
    delay(8000)
  ]);
  await page.addStyleTag({ content: `
    .flipbook-topline,.book-top-caption,.book-shadow,.book-gesture-hint,.book-edge,.book-controls,.book-bottom-note{display:none!important}
    .flipbook-app{min-height:0!important;height:auto!important;overflow:visible!important}
    .flipbook-stage{min-height:0!important;margin:0!important;padding:0!important;display:block!important}
    .book-viewport{width:620px!important;height:853px!important;min-height:853px!important;max-height:none!important;perspective:none!important;overflow:hidden!important}
    .book-page,.paper-sheet{box-shadow:none!important}
    .paper-sheet__content{height:calc(100% - 54px)!important}
  ` });

  const total = await page.locator(".book-progress small").evaluate(el => Number(el.textContent?.split("/")[1]?.trim()));
  if (!Number.isFinite(total) || total < 2) throw new Error("Could not determine resume page count.");
  for (let index = 0; index < total; index++) {
    const file = path.join(pagesDir, `${String(index + 1).padStart(2, "0")}.jpg`);
    await page.locator(".book-page--current .paper-sheet").screenshot({ path: file, type: "jpeg", quality: 92 });
    if (index < total - 1) {
      await page.locator(".book-controls button[aria-label='Next page']").click();
      await page.waitForFunction(
        expected => Number(document.querySelector(".book-progress small")?.textContent?.split("/")[0]?.trim()) === expected,
        { timeout: 5000 },
        index + 2
      );
      await delay(60);
    }
  }
  await browser.close();
  browser = undefined;

  await execFileAsync(process.execPath, [
    builder, "--input", pagesDir, "--out", path.join(outputDir, "index.html"),
    "--title", "Vijayakumar Chandiran — Interactive Resume", "--portrait", "single"
  ], { cwd: root, maxBuffer: 1024 * 1024 * 10 });

  let html = await fs.readFile(path.join(outputDir, "index.html"), "utf8");
  html = html.replace("</head>", `<style>
    .portfolio-contact{margin-left:auto;display:flex;align-items:center;gap:14px;white-space:nowrap}
    .portfolio-contact a{font-size:12px;line-height:20px;text-decoration:none;color:var(--ink);opacity:.78}
    .portfolio-contact a:hover{opacity:1;text-decoration:underline;text-underline-offset:4px}
    @media(max-width:420px){.portfolio-contact{gap:8px}.portfolio-contact a{font-size:10px}header{padding-inline:12px!important}header h1{font-size:12px!important}}
  </style></head>`);
  html = html.replace("</body>", `<script>
    (()=>{const header=document.querySelector("header");if(!header||header.querySelector(".portfolio-contact"))return;
    const nav=document.createElement("nav");nav.className="portfolio-contact";nav.setAttribute("aria-label","Contact links");
    nav.innerHTML='<a href="https://www.linkedin.com/in/vijayakumar-chandiran" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="https://github.com/vijay3695" target="_blank" rel="noopener noreferrer">GitHub ↗</a>';
    header.append(nav)})();
  </script></body>`);
  await fs.writeFile(path.join(outputDir, "index.html"), html);
  console.log(`Built OpenZine resume book with ${total} pages at dist/index.html (single-page mode for desktop and mobile).`);
} finally {
  if (browser) await browser.close().catch(() => {});
  preview.kill("SIGTERM");
  await fs.rm(pagesDir, { recursive: true, force: true });
}
