const puppeteer = require("/workspace/app/node_modules/puppeteer/lib/puppeteer/puppeteer.js");
const CHROME = "/tmp/kilo-worktrees/a7daf38377cbcc3d4edf2a6223cd49ae02aaef69075accb69d652f17e0f3fdca/.cache/puppeteer/chrome/linux-155.0.8059.39/chrome-linux64/chrome";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1986, deviceScaleFactor: 1 });

  await page.goto("file:///tmp/test_fonts.html", {
    waitUntil: "networkidle0",
    timeout: 30000,
  });

  await new Promise(r => setTimeout(r, 3000));

  const fonts = await page.evaluate(() => {
    return document.fonts.check("72px Space Grotesk") && document.fonts.check("24px DM Sans");
  });
  console.log("Fonts loaded:", fonts);

  await page.screenshot({ path: "/tmp/test_fonts.png" });
  console.log("Screenshot saved");

  await browser.close();
})();
