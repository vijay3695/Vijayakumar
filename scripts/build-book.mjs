import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import fsSync from "node:fs";

GlobalFonts.register(fsSync.readFileSync("/tmp/spacegrotesk.ttf"), "Space Grotesk");
GlobalFonts.register(fsSync.readFileSync("/tmp/dmsans.ttf"), "DM Sans");

const PROJECT_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PAGES_DIR = path.join(PROJECT_ROOT, "dist", "openzine-pages");
const BOOK_OUT = path.join(PROJECT_ROOT, "openzine-book.html");
const MAKE_BOOK = path.join(PROJECT_ROOT, ".codex", "skills", "openzine", "scripts", "make-book.mjs");

const PAGE_WIDTH = 1440;
const PAGE_HEIGHT = 1984;

const resumeModule = await import("/tmp/resume.js");
const { profile, sections } = resumeModule;

const webdev = sections.find((s) => s.id === "exp-web-developer");
const manager = sections.find((s) => s.id === "exp-team-manager");
const leader = sections.find((s) => s.id === "exp-team-leader");
const senior = sections.find((s) => s.id === "exp-senior-csa");
const associate = sections.find((s) => s.id === "exp-csa");
const about = sections.find((s) => s.id === "about");
const summary = sections.find((s) => s.id === "summary");
const competencies = sections.find((s) => s.id === "competencies");
const certifications = sections.find((s) => s.id === "certifications");
const education = sections.find((s) => s.id === "education");

await fs.mkdir(PAGES_DIR, { recursive: true });

function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";
  for (const word of words) {
    const testLine = currentLine ? currentLine + " " + word : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function createPage(title, contentLines, pageNum, totalPages, isCover = false, options = {}) {
  const canvas = createCanvas(PAGE_WIDTH, PAGE_HEIGHT);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);

  const margin = 100;
  const contentWidth = PAGE_WIDTH - 2 * margin;

  if (isCover) {
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    ctx.strokeStyle = "rgba(215,208,194,0.2)";
    ctx.lineWidth = 1;
    for (let gx = 0; gx < PAGE_WIDTH; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, PAGE_HEIGHT); ctx.stroke(); }
    for (let gy = 0; gy < PAGE_HEIGHT; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(PAGE_WIDTH, gy); ctx.stroke(); }
    ctx.fillStyle = "#9b7846";
    ctx.fillRect(margin, 80, 60, 4);
    ctx.font = '600 18px "DM Sans", sans-serif';
    ctx.fillStyle = "#9b7846";
    ctx.fillText("CURRICULUM VITAE", margin, 130);
    ctx.textAlign = "right";
    ctx.fillStyle = "#8a8477";
    ctx.fillText("2026 EDITION", PAGE_WIDTH - margin, 130);
    ctx.textAlign = "left";
    ctx.strokeStyle = "rgba(155,120,70,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(PAGE_WIDTH - 200, 280, 120, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(PAGE_WIDTH - 200, 280, 80, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#292820";
    ctx.font = 'bold 180px "Space Grotesk", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("Vijayakumar", PAGE_WIDTH / 2, 820);
    ctx.fillText("Chandiran.", PAGE_WIDTH / 2, 980);
    ctx.textAlign = "left";
    ctx.fillStyle = "#9b7846";
    ctx.fillRect(PAGE_WIDTH / 2 - 150, 1010, 300, 4);
    ctx.font = '400 48px "DM Sans", sans-serif';
    ctx.fillStyle = "#6f685a";
    ctx.textAlign = "center";
    ctx.fillText(profile.role, PAGE_WIDTH / 2, 1090);
    ctx.textAlign = "left";
    ctx.strokeStyle = "#d7d0c2";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin, 1160);
    ctx.lineTo(PAGE_WIDTH - margin, 1160);
    ctx.stroke();
    ctx.font = '14px "DM Sans", monospace';
    ctx.fillStyle = "#8a8477";
    ctx.fillText("CHENNAI, INDIA", margin, PAGE_HEIGHT - 120);
    ctx.textAlign = "right";
    ctx.fillText("TURN THE PAGE", PAGE_WIDTH - margin, PAGE_HEIGHT - 120);
    ctx.fillStyle = "#9b7846";
    ctx.font = 'bold 20px "DM Sans", sans-serif';
    ctx.fillText("\u2192", PAGE_WIDTH - margin, PAGE_HEIGHT - 90);
    ctx.textAlign = "left";
    ctx.font = 'bold 48px "Space Grotesk", sans-serif';
    ctx.fillStyle = "rgba(155,120,70,0.12)";
    ctx.fillText("VC", PAGE_WIDTH - 200, PAGE_HEIGHT - 200);
  } else {
    ctx.fillStyle = "#292820";
    ctx.font = 'bold 64px "Space Grotesk", sans-serif';
    ctx.fillText(title, margin, 120);
    ctx.strokeStyle = "#d7d0c2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, 150);
    ctx.lineTo(PAGE_WIDTH - margin, 150);
    ctx.stroke();
    ctx.fillStyle = "#9b7846";
    ctx.fillRect(PAGE_WIDTH - margin - 46, 147, 46, 6);
    ctx.strokeStyle = "rgba(155,120,70,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin, 195);
    ctx.lineTo(PAGE_WIDTH - margin, 195);
    ctx.stroke();

    ctx.font = '40px "DM Sans", sans-serif';
    ctx.fillStyle = "#59564c";
    let y = 220;
    const lineHeight = 56;
    let li = 0;
    for (const line of contentLines) {
      if (y > PAGE_HEIGHT - 120) break;
      if (line === "") { y += 40; continue; }
      const lines = wrapText(ctx, line, contentWidth);
      for (const l of lines) {
        if (y > PAGE_HEIGHT - 120) break;
        const display = (options.bulletFrom != null && li >= options.bulletFrom) ? "\u00b7 " + l : l;
        ctx.fillText(display, margin, y);
        y += lineHeight;
      }
      li++;
    }

    if (options.hasChart && githubChart) {
      const chartW = contentWidth;
      const chartH = Math.round(chartW * (githubChart.height / githubChart.width));
      const chartX = margin;
      const chartY = Math.max(y + 20, PAGE_HEIGHT - 300 - chartH);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(chartX - 10, chartY - 10, chartW + 20, chartH + 20);
      ctx.strokeStyle = "#d7d0c2";
      ctx.lineWidth = 1;
      ctx.strokeRect(chartX - 10, chartY - 10, chartW + 20, chartH + 20);
      ctx.drawImage(githubChart, chartX, chartY, chartW, chartH);
    }

    ctx.font = '14px "DM Sans", monospace';
    ctx.fillStyle = "#8a8477";
    ctx.fillText("VIJAYAKUMAR CHANDIRAN", margin, PAGE_HEIGHT - 40);
    ctx.textAlign = "right";
    ctx.fillText(`${String(pageNum).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`, PAGE_WIDTH - margin, PAGE_HEIGHT - 40);
    ctx.textAlign = "left";
  }

  return canvas.toBuffer("image/png");
}

let githubChart = null;
try {
  const chartRes = await fetch("https://ghchart.rshah.org/vijay3695");
  const chartSvg = await chartRes.text();
  githubChart = await loadImage(Buffer.from(chartSvg));
  console.log("GitHub chart loaded:", githubChart.width, "x", githubChart.height);
} catch (e) {
  console.log("Failed to load GitHub chart:", e.message);
}

const pageDefs = [
  { title: "Cover", lines: [], isCover: true },
  { title: "About Me", eyebrow: "01 / THE PERSON", lines: about.body },
  { title: "Professional Summary", eyebrow: "02 / PROFESSIONAL PROFILE", lines: ["Operations & customer success leader \u00b7 7 years", "", ...summary.body] },
  { title: webdev.title, eyebrow: "03 / WEB DEVELOPMENT", lines: [webdev.subtitle, webdev.meta, "", ...webdev.bullets], bulletFrom: 2 },
  { title: manager.title, eyebrow: "04 / EXPERIENCE", lines: [manager.subtitle, manager.meta, "", ...manager.bullets], bulletFrom: 2 },
  { title: leader.title, eyebrow: "05 / EXPERIENCE", lines: [leader.subtitle, leader.meta, "", ...leader.bullets], bulletFrom: 2 },
  { title: senior.title, eyebrow: "06 / EXPERIENCE", lines: [senior.subtitle, senior.meta, "", ...senior.bullets], bulletFrom: 2 },
  { title: associate.title, eyebrow: "07 / EXPERIENCE", lines: [associate.subtitle, associate.meta, "", ...associate.bullets], bulletFrom: 2 },
  { title: "Core Competencies", eyebrow: "08 / CAPABILITIES", lines: competencies.chips, bulletFrom: 0 },
  { title: "How I Work", eyebrow: "08 / CAPABILITIES \u00b7 CONTINUED", lines: ["Listen carefully. Find the root cause. Coach consistently. Measure what changes.", "", ...competencies.chips.slice(6)] },
  { title: "Certifications", eyebrow: "09 / CONTINUOUS LEARNING", lines: certifications.certs.map(c => `${c.name} \u2014 ${c.issuer} (${c.year})`), bulletFrom: 0 },
  { title: "Learning Record", eyebrow: "09 / CONTINUOUS LEARNING \u00b7 CONTINUED", lines: certifications.certs.slice(5).map(c => `${c.name} \u2014 ${c.issuer} (${c.year})`), bulletFrom: 0 },
  { title: "Education", eyebrow: "10 / EDUCATION", lines: education.education.map(e => `${e.qualification} \u2014 ${e.institution} (${e.years})`) },
  { title: "GitHub & Open Source", eyebrow: "11 / CODE & CONTRIBUTIONS", lines: ["github.com/vijay3695", "", "Open source project: nuvio sync", "Building and maintaining developer tools.", "", "Key areas:", "\u2022 Frontend development with React & TypeScript", "\u2022 Automation and scripting", "\u2022 Open-source contributions", "\u2022 Developer tooling", "", "Profile: https://github.com/vijay3695"], hasChart: true },
  { title: "Contact", eyebrow: "12 / THE NEXT CHAPTER", lines: ["Let's make good work happen.", "", "For opportunities in team leadership, service delivery, customer success, and operations.", "", profile.location, "", ...profile.links.map(l => l.label + ": " + l.href)] },
];

const totalPages = pageDefs.length;
for (let i = 0; i < pageDefs.length; i++) {
  const opts = { hasChart: pageDefs[i].hasChart, bulletFrom: pageDefs[i].bulletFrom };
  const buf = createPage(pageDefs[i].title, pageDefs[i].lines, i + 1, totalPages, pageDefs[i].isCover, opts);
  await fs.writeFile(path.join(PAGES_DIR, `page-${String(i + 1).padStart(2, "0")}.png`), buf);
  console.log(`Created page ${i + 1}: ${pageDefs[i].title}`);
}

const child = spawn("node", [MAKE_BOOK, "--input", PAGES_DIR, "--out", BOOK_OUT, "--title", "Vijayakumar Chandiran \u2014 Resume", "--portrait", "single"], {
  stdio: "inherit",
  cwd: PROJECT_ROOT,
});
child.on("close", (code) => {
  if (code === 0) {
    console.log("Book created at:", BOOK_OUT);
  } else {
    console.error("make-book failed with code", code);
    process.exit(1);
  }
});
