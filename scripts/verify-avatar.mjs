/* Objective check that the subject is actually VISIBLE in the rendered avatar.
   Renders the built site, grabs the avatar element, and inspects its pixels.
   Run: node scripts/verify-avatar.mjs
*/
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
await page.setViewport({ width: 400, height: 860, deviceScaleFactor: 2, isMobile: true });
await page.goto(url, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 4300));

const boxes = await page.evaluate(() => {
  const grab = (sel) => {
    const n = document.querySelector(sel);
    if (!n) return null;
    const r = n.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  };
  return { header: grab(".ig-avatar__photo"), nav: grab(".ig-bottomnav__photo") };
});

async function inspect(label, box) {
  if (!box) return console.log(`  ${label}: ELEMENT MISSING`);
  const png = await page.screenshot({ clip: box });
  const stats = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let dark = 0, total = 0, minLum = 255, maxSat = 0;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
      if (a < 40) continue;                       // outside the circle
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const sat = mx === 0 ? 0 : (mx - mn) / mx;
      total++;
      if (lum < 110) dark++;                      // hair / dark shirt
      if (lum < minLum) minLum = lum;
      if (sat > maxSat) maxSat = sat;
    }
    return {
      opaquePixels: total,
      darkPixels: dark,
      darkPct: +((dark / Math.max(total, 1)) * 100).toFixed(1),
      darkestLuminance: Math.round(minLum),
      peakSaturation: +maxSat.toFixed(2)
    };
  }, png.toString("base64"));
  const subjectVisible = stats.darkPct > 3 && stats.darkestLuminance < 110;
  console.log(`  ${label}: ${subjectVisible ? "SUBJECT VISIBLE" : "SUBJECT MAY BE MISSING"}`,
              JSON.stringify(stats));
}

console.log("\n=== rendered avatar contents ===");
await inspect("header avatar", boxes.header);
await inspect("bottom nav   ", boxes.nav);

await browser.close();
srv.close();
