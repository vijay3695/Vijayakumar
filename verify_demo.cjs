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

  await page.goto("https://openzine.pen-ine.workers.dev/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await new Promise(r => setTimeout(r, 10000));

  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 300));
  console.log("Demo body text:", bodyText.replace(/\n/g, " | ").substring(0, 300));

  // Analyze screenshot for dark pixels
  await page.screenshot({ path: "/tmp/demo_screenshot.png" });
  console.log("Screenshot saved");

  await browser.close();
})();
