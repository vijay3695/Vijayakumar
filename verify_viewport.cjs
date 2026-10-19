const puppeteer = require("/workspace/app/node_modules/puppeteer");
const CHROME = "/tmp/kilo-worktrees/a7daf38377cbcc3d4edf2a6223cd49ae02aaef69075accb69d652f17e0f3fdca/.cache/puppeteer/chrome/linux-155.0.8059.39/chrome-linux64/chrome";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--ignore-certificate-errors", "--enable-unsafe-swiftshader"],
  });

  for (const vp of [{width:1280,height:800},{width:1920,height:1080},{width:800,height:600}]) {
    const page = await browser.newPage();
    await page.setViewport(vp);

    await page.goto("https://openzine.pen-ine.workers.dev/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await new Promise(r => setTimeout(r, 15000));

    const info = await page.evaluate(() => {
      const canvas = document.querySelector("canvas");
      return {
        canvasSize: canvas ? canvas.width + "x" + canvas.height : "none",
        viewport: window.innerWidth + "x" + window.innerHeight,
        dpr: window.devicePixelRatio,
      };
    });
    console.log("Viewport " + vp.width + "x" + vp.height + ":", JSON.stringify(info));

    await page.close();
  }

  await browser.close();
})();
