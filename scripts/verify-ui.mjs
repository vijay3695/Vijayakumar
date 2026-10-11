/* Point-by-point verification of the reported issues, by measurement. */
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

/* 1. page load must be STATIC - no staggered entrance */
const atLoad = await page.evaluate(() => {
  const q = (s) => document.querySelector(s);
  const inline = (n) => (n && n.style ? { o: n.style.opacity, t: n.style.transform } : null);
  return {
    tileOpacity: getComputedStyle(q(".ig-tile")).opacity,
    tileInline: inline(q(".ig-tile")),
    nameOpacity: getComputedStyle(q(".ig-bio__name")).opacity,
    navOpacity: getComputedStyle(q(".ig-bottomnav__item")).opacity,
    visibleTiles: Array.from(document.querySelectorAll(".ig-tile")).filter(
      (t) => getComputedStyle(t).opacity === "1"
    ).length
  };
});

/* 2. verified badge size + alignment */
const badge = await page.evaluate(() => {
  const h1 = document.querySelector(".ig-bio__name");
  const svg = h1.querySelector("svg");
  const nameSpan = h1.querySelector("span");
  const r = svg.getBoundingClientRect();
  const nr = nameSpan.getBoundingClientRect();
  const nameSize = parseFloat(getComputedStyle(nameSpan).fontSize);
  return {
    badgePx: Math.round(r.width),
    nameCapPx: Math.round(nameSize),
    badgeCentreVsNameCentre: Math.round(
      (r.top + r.height / 2) - (nr.top + nr.height / 2)
    ),
    gapToName: Math.round(r.left - nr.right)
  };
});

/* 3. backgrounds - patterns gone, restrained glows in place */
const bg = await page.evaluate(() => {
  const art = document.querySelector(".ig-tile__art");
  const before = getComputedStyle(art, "::before").backgroundImage;
  const tile = getComputedStyle(art).backgroundImage;
  return {
    tileHasRepeatingPattern: /repeating|radial-gradient\(rgba\(255/.test(before),
    tileSheen: before.slice(0, 46),
    tileBackdropLayers: (tile.match(/gradient/g) || []).length
  };
});

/* 4. the reel DOES animate when opened */
await page.evaluate(() => {
  const t = document.querySelector(".ig-tile");
  if (t instanceof HTMLElement) t.click();
});
const frames = [];
for (const t of [16, 120, 300, 700, 1200]) {
  await new Promise((r) => setTimeout(r, t - (frames.length ? frames[frames.length - 1].t : 0)));
  frames.push({
    t,
    title: await page.evaluate(() => {
      // scope to the ACTIVE reel - querySelector on the document grabs reel 2's
      // title, which is never animated, and made this measurement lie
      const scroller = document.querySelector(".reel-scroller");
      const active = scroller ? scroller.children[0] : null;
      const n = active ? active.querySelector(".reel__identity-name, .reel__title") : null;
      return n ? +getComputedStyle(n).opacity.slice(0, 4) : null;
    }),
    rail: await page.evaluate(() => {
      const scroller = document.querySelector(".reel-scroller");
      const active = scroller ? scroller.children[0] : null;
      const n = active ? active.querySelector(".reel__rail-btn") : null;
      return n ? +getComputedStyle(n).opacity.slice(0, 4) : null;
    })
  });
}

/* 5. About reel structure */
const about = await page.evaluate(() => {
  const reel = document.querySelector(".reel");
  return {
    hasEyebrow: !!document.querySelector(".reel__eyebrow"),
    hasTitle: !!reel.querySelector(".reel__title"),
    leadsWith: reel.querySelector(".reel__identity-name")?.textContent || null,
    role: reel.querySelector(".reel__identity-role")?.textContent || null,
    links: Array.from(reel.querySelectorAll(".reel__idlink")).map((a) => a.textContent)
  };
});

console.log("\n1. PAGE LOAD (must be static):");
console.log("   tile opacity:", atLoad.tileOpacity, " inline styles:", JSON.stringify(atLoad.tileInline));
console.log("   tiles already visible:", atLoad.visibleTiles, "/", 9);
console.log("   name opacity:", atLoad.nameOpacity, " nav opacity:", atLoad.navOpacity);
console.log("\n2. VERIFIED BADGE:");
console.log("   badge:", badge.badgePx + "px  (name is " + badge.nameCapPx + "px)");
console.log("   vertical centre offset vs name:", badge.badgeCentreVsNameCentre + "px");
console.log("   gap after name:", badge.gapToName + "px");
console.log("\n3. TILE BACKGROUND:");
console.log("   repeating pattern present:", bg.tileHasRepeatingPattern);
console.log("   sheen:", bg.tileSheen);
console.log("   backdrop gradient layers:", bg.tileBackdropLayers);
console.log("\n4. REEL ANIMATION (content should animate in):");
frames.forEach((f) => console.log(`   t=${String(f.t).padStart(4)}ms  title opacity=${f.title}  rail opacity=${f.rail}`));
console.log("\n5. ABOUT REEL:");
console.log("   eyebrow present:", about.hasEyebrow, " title present:", about.hasTitle);
console.log("   leads with:", JSON.stringify(about.leadsWith));
console.log("   role:", JSON.stringify(about.role), " links:", JSON.stringify(about.links));

await browser.close();
srv.close();
