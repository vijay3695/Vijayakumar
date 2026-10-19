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

  await new Promise(r => setTimeout(r, 20000));

  const info = await page.evaluate(() => {
    const mq1 = window.matchMedia("(max-width:600px)");
    const mq2 = window.matchMedia("(orientation:portrait)");
    const mq3 = window.matchMedia("(max-width:600px),(orientation:portrait)");
    const body = document.body;
    const computed = getComputedStyle(body);
    return {
      mq1: mq1.matches,
      mq2: mq2.matches,
      mq3: mq3.matches,
      gridTemplateRows: computed.gridTemplateRows,
      gridTemplateAreas: computed.gridTemplateAreas,
    };
  });
  console.log("MQ info:", JSON.stringify(info));

  await browser.close();
})();
