const puppeteer = require("/workspace/app/node_modules/puppeteer");
const CHROME = "/tmp/kilo-worktrees/a7daf38377cbcc3d4edf2a6223cd49ae02aaef69075accb69d652f17e0f3fdca/.cache/puppeteer/chrome/linux-155.0.8059.39/chrome-linux64/chrome";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--ignore-certificate-errors", "--enable-unsafe-swiftshader"],
  });

  // Test our book
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto("https://vijay3695.github.io/Vijayakumar/?nocache=" + Date.now(), {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await new Promise(r => setTimeout(r, 20000));

  const info = await page.evaluate(() => {
    const book = document.querySelector("#book") || document.querySelector(".book");
    const body = document.body;
    const html = document.documentElement;
    return {
      bodySize: body.offsetWidth + "x" + body.offsetHeight,
      htmlSize: html.offsetWidth + "x" + html.offsetHeight,
      bookSize: book ? book.offsetWidth + "x" + book.offsetHeight : "no book",
      threeCanvas: document.querySelector("canvas") ? document.querySelector("canvas").width + "x" + document.querySelector("canvas").height : "no canvas",
    };
  });
  console.log("Our book sizes:", JSON.stringify(info));

  await browser.close();
})();
