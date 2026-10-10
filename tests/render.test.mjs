/* ============================================================================
   render.test.mjs — real render test.
   Boots index.html in jsdom, runs the actual site scripts, and asserts the
   DOM a visitor would get. Run: npm test
   ==========================================================================*/
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import assert from "node:assert/strict";

const root = new URL("..", import.meta.url).pathname;
const html = readFileSync(root + "index.html", "utf8");
const contentSrc = readFileSync(root + "content.js", "utf8");
const glowSrc = readFileSync(root + "js/glow.js", "utf8");
const mainSrc = readFileSync(root + "js/main.js", "utf8");

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("  \u2713 " + name); }
  catch (e) { failed++; console.error("  \u2717 " + name + "\n      " + e.message); }
}

/* A 2D canvas stub so glow.js can run its fallback path headlessly. */
function stubCanvas(window) {
  const grad = { addColorStop() {} };
  const ctx = {
    clearRect() {}, beginPath() {}, arc() {}, fill() {},
    createRadialGradient() { return grad; },
    fillStyle: "", globalCompositeOperation: ""
  };
  window.HTMLCanvasElement.prototype.getContext = function (kind) {
    return kind === "2d" ? ctx : null;   // force the 2D fallback path
  };
}

function boot(contentOverride) {
  const dom = new JSDOM(html, {
    runScripts: "outside-only",
    pretendToBeVisual: true,
    url: "https://example.com/"
  });
  const { window } = dom;
  const errors = [];
  window.console = {
    warn: (m) => errors.push(String(m)),
    error: (m) => errors.push(String(m)),
    log() {}
  };
  stubCanvas(window);
  window.matchMedia = window.matchMedia || function () {
    return { matches: false, addEventListener() {}, removeEventListener() {} };
  };

  window.eval(contentSrc);
  if (contentOverride) {
    window.eval("window.PORTFOLIO_CONTENT = " + JSON.stringify(contentOverride) + ";");
  }
  window.eval(glowSrc);
  window.eval(mainSrc);
  return { window, doc: window.document, errors };
}

console.log("\nrender.test.mjs\n");

/* ------------------------------------------------------------------ 1. main */
{
  const { doc, errors } = boot();

  test("project chapters render from content.js", () => {
    const n = doc.querySelectorAll("#work-mount .project").length;
    assert.equal(n, 3, "expected 3 project chapters, got " + n);
  });

  test("each project chapter has a sticky frame and a body", () => {
    const p = doc.querySelector("#work-mount .project");
    assert.ok(p.querySelector(".project__frame .frame__glyph"), "missing frame glyph");
    assert.ok(p.querySelector(".project__body .project__title"), "missing title");
    assert.ok(p.querySelector(".metrics .metric__value"), "missing metrics");
    assert.ok(p.querySelector(".decisions li"), "missing decisions");
  });

  test("proof of work collects every evidence row", () => {
    const n = doc.querySelectorAll("#proof-mount .proof__item").length;
    // project 1 has 2 entries; projects 2 and 3 have 1 each
    assert.equal(n, 4, "expected 4 proof rows, got " + n);
  });

  test("proof rows carry a reference id and a kind badge", () => {
    const first = doc.querySelector("#proof-mount .proof__item");
    assert.equal(first.querySelector(".proof__id").textContent, "01.1");
    assert.ok(first.querySelector(".proof__kind").textContent.length > 0);
  });

  test("proof rows only link out when a real href exists", () => {
    // content.js placeholders use href:"#", which must not become a link
    const links = doc.querySelectorAll("#proof-mount .proof__link").length;
    assert.equal(links, 0, "placeholder '#' hrefs should not render links");
  });

  test("about paragraphs and stack groups render", () => {
    assert.equal(doc.querySelectorAll("#about-body p").length, 3);
    assert.equal(doc.querySelectorAll("#stack-mount .stack__group").length, 4);
    assert.equal(doc.querySelectorAll("#stack-mount .stack__group li").length, 16);
  });

  test("contact list includes email plus profile links", () => {
    const n = doc.querySelectorAll("#contact-mount a").length;
    assert.equal(n, 4, "expected 4 contact links, got " + n);
    assert.match(doc.querySelector("#contact-mount a").getAttribute("href"), /^mailto:/);
  });

  test("identity is injected into hero and footer", () => {
    assert.equal(doc.querySelector("#hero-name").textContent, "Vijayakumar");
    assert.match(doc.querySelector("#hero-email").getAttribute("href"), /^mailto:/);
    assert.match(doc.querySelector("#footer-note").textContent, /Vijayakumar/);
  });

  test("chapter counter counts every section", () => {
    // hero + 3 projects + proof + about + contact
    assert.equal(doc.querySelector("#chapter-total").textContent, "07");
  });

  test("external links are safe", () => {
    const ext = doc.querySelector('#contact-mount a[href^="https://"]');
    assert.equal(ext.getAttribute("rel"), "noopener noreferrer");
    assert.equal(ext.getAttribute("target"), "_blank");
  });

  test("no runtime warnings during render", () => {
    assert.deepEqual(errors, [], "console output: " + errors.join(" | "));
  });
}

/* ------------------------------------------------------- 2. escaping / safety */
{
  const evil = "<img src=x onerror=alert(1)>";
  const { doc } = boot({
    identity: { name: evil, email: "a@b.c", location: evil },
    links: [{ label: evil, href: "javascript:alert(1)" }],
    about: [evil],
    stack: [{ group: evil, items: [evil] }],
    projects: [{
      id: "x", index: "99", title: evil, kicker: evil, year: evil, role: evil,
      context: evil, summary: evil, decisions: [evil],
      metrics: [{ value: evil, label: evil }],
      proof: [{ claim: evil, artefact: evil, href: "https://ok.example/x", kind: evil }]
    }]
  });

  test("injected markup is escaped, never parsed as HTML", () => {
    assert.equal(doc.querySelectorAll("img").length, 0, "an <img> was created from content");
    assert.ok(doc.body.textContent.includes(evil), "the literal text should still be visible");
  });

  test("content text survives into the DOM as text nodes", () => {
    assert.equal(doc.querySelector("#hero-name").textContent, evil);
    assert.equal(doc.querySelectorAll("#work-mount .project").length, 1);
    assert.equal(doc.querySelectorAll("#proof-mount .proof__item").length, 1);
  });
}

/* ------------------------------------------------------------- 3. resilience */
{
  const { doc } = boot({ identity: { name: "Bare" }, projects: [] });

  test("missing sections degrade without throwing", () => {
    assert.equal(doc.querySelectorAll("#work-mount .project").length, 0);
    assert.ok(doc.querySelector("#proof-mount").textContent.includes("content.js"),
      "empty proof section should explain how to fill it");
    assert.equal(doc.querySelector("#chapter-total").textContent, "04");
  });
}

console.log("\n" + passed + " passed, " + failed + " failed\n");
process.exit(failed ? 1 : 0);
