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

  const info = await page.evaluate(() => {
    const loading = document.querySelector("#loading");
    const book = document.querySelector("#book");
    const canvas = document.querySelector("canvas");
    return {
      loadingHidden: loading ? loading.hidden : "no loading",
      loadingText: loading ? document.querySelector("#loading-text")?.textContent : "n/a",
      magazineState: book ? book.getAttribute("data-magazine-state") : "no book",
      canvasWidth: canvas ? canvas.width : 0,
      canvasHeight: canvas ? canvas.height : 0,
      bookInnerHTML: book ? book.innerHTML.substring(0, 100) : "no book",
    };
  });
  console.log("Info:", JSON.stringify(info));

  await browser.close();
})();
