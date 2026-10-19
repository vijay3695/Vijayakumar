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

  await new Promise(r => setTimeout(r, 5000));

  const info = await page.evaluate(() => {
    return {
      orientation: window.matchMedia("(orientation: portrait)").matches ? "portrait" : "landscape",
      max600: window.matchMedia("(max-width: 600px)").matches,
      viewport: window.innerWidth + "x" + window.innerHeight,
      matchMedia: window.matchMedia("(max-width:600px),(orientation:portrait)").matches,
    };
  });
  console.log("Orientation info:", JSON.stringify(info));

  await browser.close();
})();
