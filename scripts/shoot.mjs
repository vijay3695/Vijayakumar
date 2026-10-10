/* ============================================================================
   shoot.mjs - render the real built site in headless Chrome and capture
   screenshots. Run: node scripts/shoot.mjs
   ==========================================================================*/
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve } from "node:path";

const ROOT = resolve(process.cwd());
const DIST = resolve(ROOT, "dist");
const OUT = resolve(ROOT, ".screenshots");
mkdirSync(OUT, { recursive: true });

/* ES modules cannot load over file:// (CORS), so serve the build locally. */
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2"
};
const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent((req.url || "/").split("?")[0]);
    if (path.endsWith("/")) path += "index.html";
    const body = await readFile(join(DIST, path));
    res.writeHead(200, { "content-type": TYPES[extname(path)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const url = "http://127.0.0.1:" + server.address().port + "/";
console.log("serving " + DIST + " at " + url);

const errors = [];
const failed = [];

const browser = await puppeteer.launch({
  headless: "new",
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--font-render-hinting=none",
    "--force-color-profile=srgb",
    "--hide-scrollbars"
  ]
});

const page = await browser.newPage();
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("requestfailed", (r) => failed.push(r.url().slice(0, 90) + " :: " + (r.failure()?.errorText || "")));

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(name, w, h, scale = 2) {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: scale, isMobile: w < 700 });
  await wait(600);
  await page.screenshot({ path: OUT + "/" + name + ".png" });
  console.log("  " + name + ".png");
}

/* ---------------------------------------------------------------- mobile */
await page.setViewport({ width: 400, height: 860, deviceScaleFactor: 2, isMobile: true });
await page.goto(url, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await wait(4200);   // let the entrance timeline finish

await shot("01-mobile-profile", 400, 860);

/* full page of the profile */
await page.setViewport({ width: 400, height: 860, deviceScaleFactor: 2, isMobile: true });
await page.screenshot({ path: OUT + "/02-mobile-full.png", fullPage: true });
console.log("  02-mobile-full.png");

/* open the first reel via the grid tile */
await page.evaluate(() => {
  const t = document.querySelector(".ig-tile");
  if (t instanceof HTMLElement) t.click();
});
await wait(2600);
await shot("03-mobile-reel", 400, 860);

/* scroll to the next reel */
await page.evaluate(() => {
  const s = document.querySelector(".reel-scroller");
  const kids = s ? s.children : [];
  if (s && kids[1]) s.scrollTop = (kids[1]).offsetTop;
});
await wait(2200);
await shot("04-mobile-reel-2", 400, 860);

/* the proof reel (richest content) */
await page.evaluate(() => {
  const s = document.querySelector(".reel-scroller");
  const kids = s ? Array.from(s.children) : [];
  const last = kids[kids.length - 2];
  if (s && last) s.scrollTop = last.offsetTop;
});
await wait(2400);
await shot("05-mobile-reel-proof", 400, 860);

/* tabs */
await page.evaluate(() => {
  const close = document.querySelector(".reel-close");
  if (close instanceof HTMLElement) close.click();
});
await wait(1400);
await page.evaluate(() => {
  const tabs = document.querySelectorAll(".ig-tab");
  if (tabs[1] instanceof HTMLElement) tabs[1].click();
});
await wait(1200);
await shot("06-mobile-skills", 400, 860);

await page.evaluate(() => {
  const tabs = document.querySelectorAll(".ig-tab");
  if (tabs[2] instanceof HTMLElement) tabs[2].click();
});
await wait(1200);
await shot("07-mobile-proof-tab", 400, 860);

/* --------------------------------------------------------------- desktop */
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await page.reload({ waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await wait(4200);
await shot("08-desktop-profile", 1440, 900, 1.5);

await page.evaluate(() => {
  const t = document.querySelector(".ig-tile");
  if (t instanceof HTMLElement) t.click();
});
await wait(2600);
await shot("09-desktop-reel", 1440, 900, 1.5);

/* ----------------------------------------------------------------- audit */
const audit = await page.evaluate(() => {
  const cs = (sel, prop) => {
    const n = document.querySelector(sel);
    return n ? getComputedStyle(n)[prop] : null;
  };
  return {
    bodyFont: cs("body", "fontFamily"),
    interLoaded: document.fonts.check('16px "Inter"'),
    tiles: document.querySelectorAll(".ig-tile").length,
    tilesVisible: Array.from(document.querySelectorAll(".ig-tile")).filter(
      (t) => getComputedStyle(t).opacity === "1"
    ).length,
    bottomNavItems: document.querySelectorAll(".ig-bottomnav__item").length,
    highlights: document.querySelectorAll(".ig-highlight").length,
    reels: document.querySelectorAll(".reel").length,
    railButtons: document.querySelectorAll(".reel__rail-btn").length,
    progressSegs: document.querySelectorAll(".reel-progress__seg").length,
    tileHasArt: !!document.querySelector(".ig-tile__art"),
    grainOnTile: cs(".ig-tile__art", "backgroundImage")?.includes("svg") ?? null
  };
});

console.log("\n--- audit ---");
for (const [k, v] of Object.entries(audit)) console.log("  " + k + ": " + v);
console.log("\n--- console errors ---\n  " + (errors.length ? errors.join("\n  ") : "none"));
console.log("--- failed requests ---\n  " + (failed.length ? failed.join("\n  ") : "none"));

await browser.close();
server.close();
