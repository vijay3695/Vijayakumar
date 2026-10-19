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
    const book = document.querySelector("#book") || document.querySelector(".book");
    const parent = book ? book.parentElement : null;
    const grandparent = parent ? parent.parentElement : null;
    const stage = document.querySelector(".stage");
    return {
      bookSize: book ? book.offsetWidth + "x" + book.offsetHeight : "no book",
      parentClass: parent ? parent.className : "no parent",
      parentSize: parent ? parent.offsetWidth + "x" + parent.offsetHeight : "no parent",
      grandparentClass: grandparent ? grandparent.className : "no grandparent",
      grandparentSize: grandparent ? grandparent.offsetWidth + "x" + grandparent.offsetHeight : "no grandparent",
      stageSize: stage ? stage.offsetWidth + "x" + stage.offsetHeight : "no stage",
    };
  });
  console.log("Demo sizes:", JSON.stringify(info));

  await browser.close();
})();
