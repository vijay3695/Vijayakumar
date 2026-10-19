const puppeteer = require("/workspace/app/node_modules/puppeteer");
const CHROME = "/tmp/kilo-worktrees/a7daf38377cbcc3d4edf2a6223cd49ae02aaef69075accb69d652f17e0f3fdca/.cache/puppeteer/chrome/linux-155.0.8059.39/chrome-linux64/chrome";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--enable-webgl", "--enable-unsafe-swiftshader", "--use-gl=swiftshader"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto("file:///tmp/live_book.html", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await new Promise(r => setTimeout(r, 25000));

  const info = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    const gl = canvas ? canvas.getContext("webgl2") || canvas.getContext("webgl") : null;
    return {
      webglSupported: !!gl,
      renderer: gl ? gl.getParameter(gl.RENDERER) : "none",
      vendor: gl ? gl.getParameter(gl.VENDOR) : "none",
    };
  });
  console.log("WebGL info:", JSON.stringify(info));

  await page.screenshot({ path: "/tmp/webgl_screenshot.png" });
  console.log("Screenshot saved");

  await browser.close();
})();
