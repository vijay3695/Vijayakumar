const puppeteer = require("/workspace/app/node_modules/puppeteer");
const CHROME = "/tmp/kilo-worktrees/a7daf38377cbcc3d4edf2a6223cd49ae02aaef69075accb69d652f17e0f3fdca/.cache/puppeteer/chrome/linux-155.0.8059.39/chrome-linux64/chrome";
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--ignore-certificate-errors", "--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto("https://openzine.pen-ine.workers.dev/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await new Promise(r => setTimeout(r, 20000));

  const dataUrl = await page.evaluate(() => {
    const magLayer = document.querySelector("[data-magazine-layer]");
    if (!magLayer || magLayer.tagName !== "CANVAS") return "no canvas: " + (magLayer ? magLayer.tagName : "null");
    try {
      return magLayer.toDataURL("image/png");
    } catch (e) {
      return "error: " + e.message;
    }
  });

  if (dataUrl && dataUrl.startsWith("data:image/png")) {
    const base64 = dataUrl.split(',')[1];
    fs.writeFileSync("/tmp/demo_maglayer.png", Buffer.from(base64, "base64"));
    console.log("Saved demo magazine layer image");
  } else {
    console.log("Failed:", dataUrl);
  }

  await browser.close();
})();
