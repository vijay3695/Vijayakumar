/* ============================================================================
   shoot.mjs — render the real page in headless Chrome, capture screenshots,
   and assert that the CSS actually applied. Run: npm run shoot
   ==========================================================================*/
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(process.cwd());
const OUT = resolve(ROOT, ".screenshots");
mkdirSync(OUT, { recursive: true });

const url = "file://" + ROOT + "/index.html";
const consoleErrors = [];
const failedRequests = [];

const browser = await puppeteer.launch({
  headless: "new",
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--font-render-hinting=none",
    "--force-color-profile=srgb",
    "--hide-scrollbars"
  ]
});

const page = await browser.newPage();
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
page.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message));
page.on("requestfailed", (r) => failedRequests.push(r.url() + " :: " + r.failure()?.errorText));

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 1800));   // fonts + first paint settle

/* ------------------------------------------------- verify the CSS really ran */
const audit = await page.evaluate(() => {
  const cs = (sel, prop) => {
    const n = document.querySelector(sel);
    return n ? getComputedStyle(n)[prop] : null;
  };
  const canvas = document.getElementById("glow");
  return {
    title: document.title,
    bodyBg: cs("body", "backgroundColor"),
    bodyFont: cs("body", "fontFamily"),
    heroSize: cs(".hero__title", "fontSize"),
    heroFamily: cs(".hero__title", "fontFamily"),
    heroCase: cs(".hero__title", "textTransform"),
    accent: getComputedStyle(document.documentElement).getPropertyValue("--accent").trim(),
    grain: cs(".grain", "backgroundImage")?.slice(0, 24) || null,
    grainAnim: cs(".grain", "animationName"),
    glowSize: canvas ? canvas.width + "x" + canvas.height : null,
    projects: document.querySelectorAll(".project").length,
    proofRows: document.querySelectorAll(".proof__item").length,
    revealsShown: document.querySelectorAll(".reveal.is-in").length,
    revealsTotal: document.querySelectorAll(".reveal").length,
    docHeight: document.documentElement.scrollHeight,
    fontLoaded: document.fonts ? document.fonts.check("16px Anton") : "n/a"
  };
});

/* ------------------------------------------------------------- screenshots */
async function shot(name, { scrollTo = null, full = false } = {}) {
  if (scrollTo) {
    await page.evaluate((sel) => {
      const n = document.querySelector(sel);
      if (n) window.scrollTo({ top: n.offsetTop - 40, behavior: "instant" });
    }, scrollTo);
  } else {
    await page.evaluate(() => window.scrollTo(0, 0));
  }
  await new Promise((r) => setTimeout(r, 1400));   // let reveals finish
  await page.screenshot({ path: OUT + "/" + name + ".png", fullPage: full });
  console.log("  captured " + name + ".png");
}

console.log("\nshooting desktop (1440x900)");
await shot("01-hero");
await shot("02-project", { scrollTo: "#work-atlas" });
await shot("03-proof", { scrollTo: "#proof" });
await shot("04-about", { scrollTo: "#about" });
await shot("05-contact", { scrollTo: "#contact" });

console.log("shooting mobile (390x844)");
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
await page.reload({ waitUntil: "load" });
await new Promise((r) => setTimeout(r, 1600));
await shot("06-mobile-hero");
await shot("07-mobile-proof", { scrollTo: "#proof" });

/* ------------------------------------------------------------------ report */
console.log("\n--- audit ---");
for (const [k, v] of Object.entries(audit)) console.log("  " + k + ": " + v);

const problems = [];
if (audit.bodyBg !== "rgb(7, 7, 10)") problems.push("body background not applied: " + audit.bodyBg);
if (audit.heroCase !== "uppercase") problems.push("display type not uppercase");
if (audit.grainAnim !== "grain") problems.push("grain animation missing");
if (audit.projects !== 3) problems.push("expected 3 projects, saw " + audit.projects);
if (audit.proofRows !== 4) problems.push("expected 4 proof rows, saw " + audit.proofRows);
if (audit.revealsShown === 0) problems.push("no reveal elements ever became visible");
if (consoleErrors.length) problems.push("console errors: " + consoleErrors.join(" | "));

console.log("\n--- network ---");
console.log("  failed requests: " + (failedRequests.length ? failedRequests.join(" | ") : "none"));

await browser.close();

if (problems.length) {
  console.error("\nPROBLEMS:");
  problems.forEach((p) => console.error("  - " + p));
  process.exit(1);
}
console.log("\nall visual checks passed\n");
