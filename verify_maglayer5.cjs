const puppeteer = require("/workspace/app/node_modules/puppeteer");
const CHROME = "/tmp/kilo-worktrees/a7daf38377cbcc3d4edf2a6223cd49ae02aaef69075accb69d652f17e0f3fdca/.cache/puppeteer/chrome/linux-155.0.8059.39/chrome-linux64/chrome";

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

  // Get pixel data from the magazine layer canvas
  const pixelInfo = await page.evaluate(() => {
    const magLayer = document.querySelector("[data-magazine-layer]");
    if (!magLayer || magLayer.tagName !== "CANVAS") return { error: "no canvas" };
    const ctx = magLayer.getContext("2d");
    if (!ctx) return { error: "no 2d context" };
    const data = ctx.getImageData(0, 0, magLayer.width, magLayer.height).data;
    let darkPixels = 0;
    let totalPixels = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
      if (brightness < 100) darkPixels++;
    }
    return {
      size: magLayer.width + "x" + magLayer.height,
      darkPixels: darkPixels,
      totalPixels: totalPixels,
      percentage: (darkPixels / totalPixels * 100).toFixed(3) + "%",
    };
  });
  console.log("Magazine layer pixels:", JSON.stringify(pixelInfo));

  await browser.close();
})();
