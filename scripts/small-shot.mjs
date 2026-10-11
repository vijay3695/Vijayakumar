/* Focused 1x captures, small enough to actually inspect. */
import puppeteer from "puppeteer";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join } from "node:path";

const DIST = "/workspace/dist";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
const srv = createServer(async (q, r) => {
  try {
    let p = (q.url || "/").split("?")[0];
    if (p.endsWith("/")) p += "index.html";
    const b = await readFile(join(DIST, p));
    r.writeHead(200, { "content-type": TYPES[extname(p)] || "application/octet-stream" });
    r.end(b);
  } catch { r.writeHead(404).end("x"); }
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const url = "http://127.0.0.1:" + srv.address().port + "/";

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"]
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true });
await page.goto(url, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 1500));   // no page animation, so this is plenty

await page.screenshot({ path: "/workspace/.screenshots/small-profile-top.png", clip: { x: 0, y: 0, width: 390, height: 470 } });
await page.evaluate(() => window.scrollTo(0, 470));
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: "/workspace/.screenshots/small-profile-grid.png", clip: { x: 0, y: 0, width: 390, height: 470 } });

await page.evaluate(() => {
  const t = document.querySelector(".ig-tile");
  if (t instanceof HTMLElement) t.click();
});
await new Promise((r) => setTimeout(r, 1800));
await page.screenshot({ path: "/workspace/.screenshots/small-reel-about.png", clip: { x: 0, y: 0, width: 390, height: 470 } });

await page.evaluate(() => {
  const s = document.querySelector(".reel-scroller");
  const kids = s ? Array.from(s.children) : [];
  const target = kids[4];
  if (s && target) s.scrollTop = target.offsetTop;
});
await new Promise((r) => setTimeout(r, 1800));
await page.screenshot({ path: "/workspace/.screenshots/small-reel-exp.png", clip: { x: 0, y: 0, width: 390, height: 470 } });

console.log("wrote 4 small captures");
await browser.close();
srv.close();
