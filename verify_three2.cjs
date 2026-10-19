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

  // Try to access the flipBook's internal renderer
  const info = await page.evaluate(() => {
    const fb = window.flipBook;
    if (!fb) return { error: "no flipBook" };
    // Try to get the book element
    const book = document.querySelector("#book");
    // Check if there are any img elements
    const imgs = document.querySelectorAll("img");
    // Check for any data URLs in the DOM
    const allElements = document.querySelectorAll("*");
    let dataUrlCount = 0;
    allElements.forEach(el => {
      if (el.src && el.src.startsWith("data:")) dataUrlCount++;
      if (el.style && el.style.backgroundImage && el.style.backgroundImage.includes("data:")) dataUrlCount++;
    });
    return {
      flipBookKeys: Object.keys(fb),
      imgCount: imgs.length,
      dataUrlCount: dataUrlCount,
      bookChildren: book ? book.children.length : 0,
    };
  });
  console.log("Info:", JSON.stringify(info));

  await browser.close();
})();
