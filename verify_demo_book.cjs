const puppeteer = require("/workspace/app/node_modules/puppeteer");
const CHROME = "/tmp/kilo-worktrees/a7daf38377cbcc3d4edf2a6223cd49ae02aaef69075accb69d652f17e0f3fdca/.cache/puppeteer/chrome/linux-155.0.8059.39/chrome-linux64/chrome";
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--ignore-certificate-errors"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Load the test book from file
  await page.goto("file:///tmp/test_demo_book.html", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await new Promise(r => setTimeout(r, 40000));

  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 200));
  console.log("Body text:", bodyText.replace(/\n/g, " | ").substring(0, 200));

  const loadingInfo = await page.evaluate(() => {
    const loading = document.querySelector("#loading");
    return {
      hidden: loading ? loading.hidden : "no loading",
      text: loading ? document.querySelector("#loading-text")?.textContent : "n/a",
    };
  });
  console.log("Loading info:", JSON.stringify(loadingInfo));

  await page.screenshot({ path: "/tmp/demo_book_screenshot.png" });
  console.log("Screenshot saved");

  await browser.close();
})();
