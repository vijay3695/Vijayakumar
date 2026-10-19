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

  await page.goto("file:///tmp/live_book.html", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await new Promise(r => setTimeout(r, 30000));

  // Get the magazine layer canvas as a data URL
  const dataUrl = await page.evaluate(() => {
    const magLayer = document.querySelector("[data-magazine-layer]");
    if (!magLayer || magLayer.tagName !== "CANVAS") return "no canvas";
    try {
      return magLayer.toDataURL("image/png");
    } catch (e) {
      return "error: " + e.message;
    }
  });

  if (dataUrl && dataUrl.startsWith("data:image/png")) {
    const base64 = dataUrl.split(',')[1];
    fs.writeFileSync("/tmp/maglayer.png", Buffer.from(base64, "base64"));
    console.log("Saved magazine layer image");
  } else {
    console.log("Failed to get magazine layer:", dataUrl);
  }

  await browser.close();
})();
