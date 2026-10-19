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

  page.on("console", msg => console.log("CONSOLE " + msg.type() + ":", msg.text().substring(0, 200)));
  page.on("pageerror", err => console.log("PAGE ERROR:", err.message.substring(0, 200)));

  await page.goto("file:///tmp/standalone_page.html?page=0", {
    waitUntil: "networkidle0",
    timeout: 30000,
  });

  await new Promise(r => setTimeout(r, 5000));

  const rootContent = await page.evaluate(() => {
    const root = document.getElementById("root");
    return root ? root.innerHTML.substring(0, 300) : "no root element";
  });
  console.log("Root content:", rootContent);

  await page.screenshot({ path: "/tmp/standalone_screenshot.png" });
  console.log("Screenshot saved");

  await browser.close();
})();
