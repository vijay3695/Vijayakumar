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

  await page.goto("https://openzine.pen-ine.workers.dev/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await new Promise(r => setTimeout(r, 20000));

  const info = await page.evaluate(() => {
    const stage = document.querySelector("#stage") || document.querySelector(".stage") || document.querySelector("[data-stage]");
    const book = document.querySelector("#book") || document.querySelector(".book");
    const body = document.body;
    return {
      bodySize: body.offsetWidth + "x" + body.offsetHeight,
      bookSize: book ? book.offsetWidth + "x" + book.offsetHeight : "no book",
      stageSize: stage ? stage.offsetWidth + "x" + stage.offsetHeight : "no stage",
      htmlSize: document.documentElement.offsetWidth + "x" + document.documentElement.offsetHeight,
    };
  });
  console.log("Demo sizes:", JSON.stringify(info));

  await browser.close();
})();
