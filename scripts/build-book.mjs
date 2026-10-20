import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";

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
  ctx.fillStyle = "#f4f0e6";
  ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  
  const margin = 120;
  const contentWidth = PAGE_WIDTH - 2 * margin;
  
  if (isCover) {
    // Cover page
    ctx.fillStyle = "#e9e2d3";
    ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    ctx.fillStyle = "#9b7846";
    ctx.font = "bold 24px serif";
    ctx.fillText("CURRICULUM VITAE", margin, 120);
    ctx.fillText("2026 EDITION", PAGE_WIDTH - margin - 200, 120);
    ctx.fillStyle = "#292820";
    ctx.font = "bold 96px serif";
    ctx.fillText("Vijayakumar", margin, 320);
    ctx.fillText("Chandiran.", margin, 420);
    ctx.font = "24px serif";
    ctx.fillStyle = "#6f685a";
    ctx.fillText(profile.role, margin, 500);
    ctx.font = "18px monospace";
    ctx.fillStyle = "#756d5d";
    ctx.fillText("CHENNAI, INDIA", margin, PAGE_HEIGHT - 120);
    ctx.fillText("TURN THE PAGE \u2192", PAGE_WIDTH - margin - 200, PAGE_HEIGHT - 120);
  } else {
    // Title
    ctx.fillStyle = "#292820";
    ctx.font = "bold 64px serif";
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
    ctx.font = "32px serif";
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
    
    // Draw GitHub chart if present
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
    ctx.font = "16px monospace";
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
  { title: manager.title, lines: [manager.subtitle, "", "25 team members led", "", ...manager.bullets.slice(0, 4)] },
  { title: "Delivery & Improvement", lines: ["2023 \u2014 2025", "", ...manager.bullets.slice(4)] },
  { title: leader.title, lines: [leader.subtitle, "", "30 team members supported", "", ...leader.bullets] },
  { title: senior.title, lines: [senior.subtitle, "", ...senior.bullets] },
  { title: associate.title, lines: [associate.subtitle, "", ...associate.bullets] },
  { title: "Core Competencies", lines: competencies.chips },
  { title: "How I Work", lines: ["Listen carefully. Find the root cause. Coach consistently. Measure what changes.", "", ...competencies.chips.slice(6)] },
  { title: "Certifications", lines: certifications.certs.map(c => `${c.name} \u2014 ${c.issuer} (${c.year})`) },
  { title: "Learning Record", lines: certifications.certs.slice(5).map(c => `${c.name} \u2014 ${c.issuer} (${c.year})`) },
  { title: "Education", lines: education.education.map(e => `${e.qualification} \u2014 ${e.institution} (${e.years})`) },
  { title: "GitHub & Open Source", eyebrow: "10 / CODE & CONTRIBUTIONS", lines: ["github.com/vijay3695", "", "Open source project: nuvio sync", "Building and maintaining developer tools.", "", "Key areas:", "\u2022 Frontend development with React & TypeScript", "\u2022 Automation and scripting", "\u2022 Open-source contributions", "\u2022 Developer tooling", "", "Profile: https://github.com/vijay3695"], hasChart: true },
  { title: "Contact", lines: ["Let's make good work happen.", "", "For opportunities in team leadership, service delivery, customer success, and operations.", "", `${profile.location} \u00b7 India`, "", ...profile.links.map(l => `${l.label}: ${l.href}`)] },
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

const child = spawn("node", [MAKE_BOOK, "--input", PAGES_DIR, "--out", BOOK_OUT, "--title", "Vijayakumar Chandiran \u2014 Interactive Resume", "--portrait", "single"], {
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
