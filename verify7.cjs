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

  // Capture console messages
  page.on("console", msg => console.log("CONSOLE:", msg.type(), msg.text().substring(0, 200)));
  page.on("pageerror", err => console.log("PAGE ERROR:", err.message.substring(0, 200)));

  await page.goto("https://vijay3695.github.io/Vijayakumar/?nocache=" + Date.now(), {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await new Promise(r => setTimeout(r, 15000));

  console.log("=== Final state ===");
  const state = await page.evaluate(() => {
    const book = document.querySelector("#book");
    return book ? book.getAttribute("data-magazine-state") : "no book";
  });
  console.log("Magazine state:", state);

  await browser.close();
})();
