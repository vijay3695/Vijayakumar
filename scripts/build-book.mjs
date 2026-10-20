import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
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
  
  // Background
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  
  const margin = 120;
  const contentWidth = PAGE_WIDTH - 2 * margin;
  
  if (isCover) {
    // Cover page - premium design
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    // Subtle grid
    ctx.strokeStyle = "rgba(215,208,194,0.2)";
    ctx.lineWidth = 1;
    for (let gx = 0; gx < PAGE_WIDTH; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, PAGE_HEIGHT); ctx.stroke(); }
    for (let gy = 0; gy < PAGE_HEIGHT; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(PAGE_WIDTH, gy); ctx.stroke(); }
    // Accent bar top
    ctx.fillStyle = "#9b7846";
    ctx.fillRect(100, 80, 60, 4);
    ctx.font = "600 18px \"DM Sans\", sans-serif";
    ctx.fillStyle = "#9b7846";
    ctx.fillText("CURRICULUM VITAE", 100, 130);
    ctx.textAlign = "right";
    ctx.fillStyle = "#8a8477";
    ctx.fillText("2026 EDITION", PAGE_WIDTH - 100, 130);
    ctx.textAlign = "left";
    // Decorative circle
    ctx.strokeStyle = "rgba(155,120,70,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(PAGE_WIDTH - 200, 280, 120, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(PAGE_WIDTH - 200, 280, 80, 0, Math.PI * 2); ctx.stroke();
    // Main name centered
    ctx.fillStyle = "#292820";
    ctx.font = "bold 180px \"Space Grotesk\", sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Vijayakumar", PAGE_WIDTH / 2, 820);
    ctx.fillText("Chandiran.", PAGE_WIDTH / 2, 980);
    ctx.textAlign = "left";
    // Accent line
    ctx.fillStyle = "#9b7846";
    ctx.fillRect(PAGE_WIDTH / 2 - 150, 1010, 300, 4);
    // Role
    ctx.font = "400 48px \"DM Sans\", sans-serif";
    ctx.fillStyle = "#6f685a";
    ctx.textAlign = "center";
    ctx.fillText(profile.role, PAGE_WIDTH / 2, 1090);
    ctx.textAlign = "left";
    // Divider
    ctx.strokeStyle = "#d7d0c2";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 1160);
    ctx.lineTo(PAGE_WIDTH - 100, 1160);
    ctx.stroke();
    // Bottom
    ctx.font = "14px \"DM Sans\", monospace";
    ctx.fillStyle = "#8a8477";
    ctx.fillText("CHENNAI, INDIA", 100, PAGE_HEIGHT - 120);
    ctx.textAlign = "right";
    ctx.fillText("TURN THE PAGE", PAGE_WIDTH - 100, PAGE_HEIGHT - 120);
    ctx.fillStyle = "#9b7846";
    ctx.font = "bold 20px \"DM Sans\", sans-serif";
    ctx.fillText("→", PAGE_WIDTH - 100, PAGE_HEIGHT - 90);
    ctx.textAlign = "left";
    // VC monogram watermark
    ctx.font = "bold 48px \"Space Grotesk\", sans-serif";
    ctx.fillStyle = "rgba(155,120,70,0.12)";
    ctx.fillText("VC", PAGE_WIDTH - 200, PAGE_HEIGHT - 200);
  } else {
    // Title
    ctx.fillStyle = "#292820";
    ctx.font = "bold 64px \"Space Grotesk\", sans-serif";
    ctx.fillText(title, margin, 120);
    
    // Underline
    ctx.strokeStyle = "#d7d0c2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, 150);
    ctx.lineTo(PAGE_WIDTH - margin, 150);
    ctx.stroke();
    
    // Accent bar
    ctx.fillStyle = "#9b7846";
    ctx.fillRect(PAGE_WIDTH - margin - 46, 147, 46, 6);
    
    // Content
    ctx.font = "32px \"DM Sans\", sans-serif";
    ctx.fillStyle = "#59564c";
    let y = 220;
    const lineHeight = 48;
    
    for (const line of contentLines) {
      if (y > PAGE_HEIGHT - 120) break;
      if (line === "") { y += 24; continue; }
      const lines = wrapText(ctx, line, contentWidth);
      for (const l of lines) {
        if (y > PAGE_HEIGHT - 120) break;
        ctx.fillText(l, margin, y);
        y += lineHeight;
      }
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

    // Footer
    ctx.font = "14px \"DM Sans\", monospace";
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
  { title: "About Me", lines: about.body },
  { title: "Professional Summary", lines: ["Operations & customer success leader \u00b7 7 years", "", ...summary.body] },
  { title: manager.title, lines: [manager.subtitle, manager.meta, "", ...manager.bullets] },
  { title: leader.title, lines: [leader.subtitle, leader.meta, "", ...leader.bullets] },
  { title: senior.title, lines: [senior.subtitle, senior.meta, "", ...senior.bullets] },
  { title: associate.title, lines: [associate.subtitle, associate.meta, "", ...associate.bullets] },
  { title: "Core Competencies", lines: competencies.chips },
  { title: "How I Work", lines: ["Listen carefully. Find the root cause. Coach consistently. Measure what changes.", "", ...competencies.chips.slice(6)] },
  { title: "Certifications", lines: certifications.certs.map(c => `${c.name} \u2014 ${c.issuer} (${c.year})`) },
  { title: "Learning Record", lines: certifications.certs.slice(5).map(c => `${c.name} \u2014 ${c.issuer} (${c.year})`) },
  { title: "Education", lines: education.education.map(e => `${e.qualification} \u2014 ${e.institution} (${e.years})`) },
  { title: "Contact", lines: ["Let's make good work happen.", "", "For opportunities in team leadership, service delivery, customer success, and operations.", "", profile.location, "", ...profile.links.map(l => l.label + ": " + l.href)] },
  { title: "GitHub & Open Source", eyebrow: "11 / CODE & CONTRIBUTIONS", lines: ["github.com/vijay3695", "", "Active contributor to open-source projects.", "Building tools and sharing knowledge with the developer community.", "", "Key areas:", "• Frontend development with React & TypeScript", "• Automation and scripting", "• Open-source contributions", "• Developer tooling", "", "Profile: https://github.com/vijay3695"] , hasChart: true },
  { title: "", lines: [], isBlank: true },
];

const totalPages = pageDefs.length;
for (let i = 0; i < pageDefs.length; i++) {
  if (pageDefs[i].isBlank) {
    const blankCanvas = createCanvas(PAGE_WIDTH, PAGE_HEIGHT);
    const bctx = blankCanvas.getContext("2d");
    bctx.fillStyle = "#f0f0f0";
    bctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    bctx.font = "14px \"DM Sans\", monospace";
    bctx.fillStyle = "#8a8477";
    bctx.fillText("VIJAYAKUMAR CHANDIRAN", 100, PAGE_HEIGHT - 40);
    bctx.textAlign = "right";
    bctx.fillText(String(i + 1).padStart(2, "0") + " / " + String(totalPages).padStart(2, "0"), PAGE_WIDTH - 100, PAGE_HEIGHT - 40);
    bctx.textAlign = "left";
    await fs.writeFile(path.join(PAGES_DIR, "page-" + String(i + 1).padStart(2, "0") + ".png"), blankCanvas.toBuffer("image/png"));
    console.log("Created page " + (i + 1) + ": (blank)");
    continue;
  }
  const buf = createPage(pageDefs[i].title, pageDefs[i].lines, i + 1, totalPages, pageDefs[i].isCover, { hasChart: pageDefs[i].hasChart });
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
