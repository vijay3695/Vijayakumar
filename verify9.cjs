const puppeteer = require("/workspace/app/node_modules/puppeteer");
const CHROME = "/tmp/kilo-worktrees/a7daf38377cbcc3d4edf2a6223cd49ae02aaef69075accb69d652f17e0f3fdca/.cache/puppeteer/chrome/linux-155.0.8059.39/chrome-linux64/chrome";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--ignore-certificate-errors"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto("https://vijay3695.github.io/Vijayakumar/?nocache=" + Date.now(), {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await new Promise(r => setTimeout(r, 20000));

  // Analyze the Three.js canvas
  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return { error: "no canvas" };
    const ctx = canvas.getContext("2d");
    if (!ctx) return { error: "no 2d context" };
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let darkPixels = 0;
    let lightPixels = 0;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
      if (brightness < 100) darkPixels++;
      else if (brightness > 200) lightPixels++;
    }
    return {
      width: canvas.width,
      height: canvas.height,
      darkPixels,
      lightPixels,
      totalPixels: data.length / 4,
    };
  });
  console.log("Canvas info:", JSON.stringify(canvasInfo));

  await page.screenshot({ path: "/tmp/verify9.png" });
  console.log("Screenshot saved");

  await browser.close();
})();
