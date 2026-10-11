/* Verify the reel layout uses the frame, and that the backdrop actually moves. */
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
await new Promise((r) => setTimeout(r, 800));

await page.evaluate(() => {
  const t = document.querySelector(".ig-tile");
  if (t instanceof HTMLElement) t.click();
});
await new Promise((r) => setTimeout(r, 1800));

const layout = await page.evaluate(() => {
  const panel = document.querySelector(".reel-panel").getBoundingClientRect();
  const active = document.querySelector(".reel-scroller").children[0];
  const body = active.querySelector(".reel__body").getBoundingClientRect();
  const title = active.querySelector(".reel__title");
  return {
    panelH: Math.round(panel.height),
    bodyTop: Math.round(body.top - panel.top),
    bodyBottomGap: Math.round(panel.bottom - body.bottom),
    bodyHeight: Math.round(body.height),
    bodyLeft: Math.round(body.left - panel.left),
    bodyRightGap: Math.round(panel.right - body.right),
    bodyWidthPctOfPanel: Math.round((body.width / panel.width) * 100),
    titleText: title ? title.textContent : null,
    eyebrow: !!active.querySelector(".reel__eyebrow"),
    identityName: active.querySelector(".reel__identity-name")?.textContent || null,
    blobs: active.querySelectorAll(".reel__blob").length
  };
});

/* does the backdrop actually move? */
const t1 = await page.evaluate(() => getComputedStyle(document.querySelector(".reel__blob--1")).transform);
await new Promise((r) => setTimeout(r, 2500));
const t2 = await page.evaluate(() => getComputedStyle(document.querySelector(".reel__blob--1")).transform);

console.log("\nREEL LAYOUT (frame height " + layout.panelH + "px)");
console.log("  content top offset      :", layout.bodyTop + "px");
console.log("  space below content     :", layout.bodyBottomGap + "px");
console.log("  content height          :", layout.bodyHeight + "px");
console.log("  left gutter             :", layout.bodyLeft + "px");
console.log("  right gutter (for rail) :", layout.bodyRightGap + "px");
console.log("  content width           :", layout.bodyWidthPctOfPanel + "% of the frame");
console.log("\nCONTENT");
console.log("  title                   :", JSON.stringify(layout.titleText));
console.log("  eyebrow                 :", layout.eyebrow);
console.log("  name card               :", JSON.stringify(layout.identityName));
console.log("  backdrop layers         :", layout.blobs);
console.log("\nBACKDROP MOTION");
console.log("  t=0.0s :", t1);
console.log("  t=2.5s :", t2);
console.log("  moving :", t1 !== t2);

await browser.close();
srv.close();
