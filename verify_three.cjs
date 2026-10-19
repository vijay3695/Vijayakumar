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

  await new Promise(r => setTimeout(r, 25000));

  // Try to access Three.js scene
  const info = await page.evaluate(() => {
    // Check if there's a global THREE or scene
    if (window.THREE) return { three: true };
    // Check for the book's internal state
    if (window.flipBook) {
      const state = window.flipBook.getState();
      return { flipBook: true, state: JSON.stringify(state).substring(0, 200) };
    }
    return { three: false, flipBook: false };
  });
  console.log("Info:", JSON.stringify(info));

  await browser.close();
})();
