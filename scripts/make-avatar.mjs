/* Crop + resize the recovered avatar using headless Chrome's canvas, then emit
   an optimised WebP data URI. Run:
     node scripts/make-avatar.mjs <source.png> <outfile.ts>
*/
import puppeteer from "puppeteer";
import { readFile, writeFile } from "node:fs/promises";

const [, , srcPath = "private/avatar-source.png", outPath = "src/data/avatar.ts"] = process.argv;

const src = await readFile(srcPath);
const dataUri = "data:image/png;base64," + src.toString("base64");

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
});
const page = await browser.newPage();
await page.setContent("<canvas id='c'></canvas>");

const result = await page.evaluate(
  async (uri, crop, size) => {
    const img = new Image();
    img.src = uri;
    await img.decode();

    // The subject sits left-of-centre; this crop frames head + shoulders and
    // deliberately excludes the generator watermark in the bottom-right corner.
    const sx = Math.round(img.naturalWidth * crop.x);
    const sy = Math.round(img.naturalHeight * crop.y);
    const sw = Math.round(img.naturalWidth * crop.w);
    const sh = Math.round(img.naturalHeight * crop.h);

    const c = document.getElementById("c");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, size, size);

    // sample the four corners so we can prove the watermark is gone (it was a
    // bright near-white glyph on a light grey wall, so the corner should be flat)
    const px = (x, y) => Array.from(ctx.getImageData(x, y, 1, 1).data);
    return {
      natural: [img.naturalWidth, img.naturalHeight],
      crop: [sx, sy, sw, sh],
      webp: c.toDataURL("image/webp", 0.88),
      png: c.toDataURL("image/png"),
      corners: { tl: px(2, 2), tr: px(size - 3, 2), bl: px(2, size - 3), br: px(size - 3, size - 3) },
      varianceBottomRight: (() => {
        const d = ctx.getImageData(size - 40, size - 40, 38, 38).data;
        let min = 255, max = 0;
        for (let i = 0; i < d.length; i += 4) {
          const v = (d[i] + d[i + 1] + d[i + 2]) / 3;
          if (v < min) min = v;
          if (v > max) max = v;
        }
        return Math.round(max - min);
      })()
    };
  },
  dataUri,
  { x: 0.12, y: 0.17, w: 0.5, h: 0.5 },
  320
);

await browser.close();

const webpBytes = Math.round(((result.webp.length - "data:image/webp;base64,".length) * 3) / 4);
const pngBytes = Math.round(((result.png.length - "data:image/png;base64,".length) * 3) / 4);
const useWebp = webpBytes < pngBytes;
const chosen = useWebp ? result.webp : result.png;

await writeFile(
  outPath,
  `/* ============================================================================\n` +
    `   avatar.ts - the display picture, inlined as a ${useWebp ? "WebP" : "PNG"} data URI.\n` +
    `\n` +
    `   Inlined ON PURPOSE. Keeping it as a file in public/ would leave a plainly\n` +
    `   downloadable /avatar.png on the site for anyone (or any scraper) to fetch.\n` +
    `   This way there is no image file on the site at all - the bytes travel with\n` +
    `   the bundle. It is a speed bump, not a lock: anything the browser renders can\n` +
    `   still be captured from the network tab.\n` +
    `\n` +
    `   Regenerate with:  node scripts/make-avatar.mjs <source.png>\n` +
    `   ==========================================================================*/\n` +
    `\n` +
    `export const avatarImage =\n  "${chosen}";\n`
);

console.log("source        :", result.natural.join("x"));
console.log("crop          :", result.crop.join(", "), "-> 320x320");
console.log("webp payload  :", webpBytes, "bytes");
console.log("png payload   :", pngBytes, "bytes");
console.log("chosen        :", useWebp ? "webp" : "png");
console.log("bottom-right variance (high = glyph still present):", result.varianceBottomRight);
console.log("wrote", outPath);
