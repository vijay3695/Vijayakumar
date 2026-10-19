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

  // Load the test demo book
  await page.goto("file:///tmp/test_demo_book.html", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await new Promise(r => setTimeout(r, 30000));

  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 200));
  console.log("Body text:", bodyText.replace(/\n/g, " | ").substring(0, 200));

  await page.screenshot({ path: "/tmp/demo_book_swift.png" });
  console.log("Screenshot saved");

  const info = await page.evaluate(() => {
    const loading = document.querySelector("#loading");
    return {
      loadingHidden: loading ? loading.hidden : "no loading",
      text: loading ? document.querySelector("#loading-text")?.textContent : "n/a",
    };
  });
  console.log("Loading info:", JSON.stringify(info));

  await browser.close();
})();
