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

  await page.goto("file:///tmp/test_demo_page.html", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await new Promise(r => setTimeout(r, 25000));

  // Check magazine layer canvas
  const info = await page.evaluate(() => {
    const magLayer = document.querySelector("[data-magazine-layer]");
    if (!magLayer) return { error: "no magazine layer" };
    const canvas = magLayer.querySelector("canvas");
    if (!canvas) return { error: "no canvas in magazine layer" };
    const ctx = canvas.getContext("2d");
    if (!ctx) return { error: "no 2d context" };
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let darkPixels = 0;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
      if (brightness < 100) darkPixels++;
    }
    return {
      canvasSize: canvas.width + "x" + canvas.height,
      darkPixels: darkPixels,
      percentage: (darkPixels / (data.length/4) * 100).toFixed(3) + "%",
    };
  });
  console.log("Magazine layer info:", JSON.stringify(info));

  await browser.close();
})();
