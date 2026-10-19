import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { createCanvas } from "@napi-rs/canvas";

const PROJECT_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PAGES_DIR = path.join(PROJECT_ROOT, "dist", "openzine-pages");
const BOOK_OUT = path.join(PROJECT_ROOT, "openzine-book.html");
const MAKE_BOOK = path.join(PROJECT_ROOT, ".codex", "skills", "openzine", "scripts", "make-book.mjs");

import { GlobalFonts } from "@napi-rs/canvas";
GlobalFonts.registerFromPath("/tmp/dmsans.woff2", "DM Sans");
GlobalFonts.registerFromPath("/tmp/spacegrotesk.ttf", "Space Grotesk");

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

function createPage(title, contentLines, pageNum, totalPages, isCover = false) {
  const canvas = createCanvas(PAGE_WIDTH, PAGE_HEIGHT);
  const ctx = canvas.getContext("2d");
  
  // Background
  ctx.fillStyle = "#f4f0e6";
  ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  
  const margin = 100;
  const contentWidth = PAGE_WIDTH - 2 * margin;
  
  if (isCover) {
    // Cover page - premium design
    ctx.fillStyle = "#f4f0e6";
    ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    // Subtle grid
    ctx.strokeStyle = "rgba(215,208,194,0.2)";
    ctx.lineWidth = 1;
    for (let gx = 0; gx < PAGE_WIDTH; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, PAGE_HEIGHT); ctx.stroke(); }
    for (let gy = 0; gy < PAGE_HEIGHT; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(PAGE_WIDTH, gy); ctx.stroke(); }
    // Accent bar top
    ctx.fillStyle = "#9b7846";
    ctx.fillRect(margin, 80, 60, 4);
    // Small label top-left
    ctx.font = "600 18px \"DM Sans\", sans-serif";
    ctx.fillStyle = "#9b7846";
    ctx.fillText("CURRICULUM VITAE", margin, 130);
    // Top-right label
    ctx.textAlign = "right";
    ctx.fillStyle = "#8a8477";
    ctx.fillText("2026 EDITION", PAGE_WIDTH - margin, 130);
    ctx.textAlign = "left";
    // Decorative circle
    ctx.strokeStyle = "rgba(155,120,70,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(PAGE_WIDTH - 200, 280, 120, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(PAGE_WIDTH - 200, 280, 80, 0, Math.PI * 2); ctx.stroke();
    // Main name
    ctx.fillStyle = "#292820";
    ctx.font = "bold 180px \"Space Grotesk\", sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Vijayakumar", PAGE_WIDTH / 2, 820);
    ctx.fillText("Chandiran.", PAGE_WIDTH / 2, 980);
    ctx.textAlign = "left";
    // Accent line under name
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
    ctx.moveTo(margin, 1160);
    ctx.lineTo(PAGE_WIDTH - margin, 1160);
    ctx.stroke();
    // Bottom
    ctx.font = "14px \"DM Sans\", monospace";
    ctx.fillStyle = "#8a8477";
    ctx.fillText("CHENNAI, INDIA", margin, PAGE_HEIGHT - 120);
    ctx.textAlign = "right";
    ctx.fillText("TURN THE PAGE", PAGE_WIDTH - margin, PAGE_HEIGHT - 120);
    ctx.fillStyle = "#9b7846";
    ctx.font = "bold 20px \"DM Sans\", sans-serif";
    ctx.fillText("→", PAGE_WIDTH - margin, PAGE_HEIGHT - 90);
    ctx.textAlign = "left";
    // VC monogram watermark
    ctx.font = "bold 48px \"Space Grotesk\", sans-serif";
    ctx.fillStyle = "rgba(155,120,70,0.12)";
    ctx.fillText("VC", PAGE_WIDTH - 200, PAGE_HEIGHT - 200);
  } else {
    // Title
    ctx.fillStyle = "#292820";
    ctx.font = "bold 72px \"Space Grotesk\", sans-serif";
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
    ctx.font = "40px \"DM Sans\", sans-serif";
    ctx.fillStyle = "#59564c";
    let y = 200;
    const lineHeight = 60;
    
    for (const line of contentLines) {
      if (y > PAGE_HEIGHT - 120) break;
      if (line === "") { y += 36; continue; }
      const lines = wrapText(ctx, line, contentWidth);
      for (const l of lines) {
        if (y > PAGE_HEIGHT - 120) break;
        ctx.fillText(l, margin, y);
        y += lineHeight;
      }
    }
    
    // Footer
    ctx.font = "16px \"DM Sans\", monospace";
    ctx.fillStyle = "#8a8477";
    ctx.fillText("VIJAYAKUMAR CHANDIRAN", margin, PAGE_HEIGHT - 40);
    ctx.textAlign = "right";
    ctx.fillText(`${String(pageNum).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`, PAGE_WIDTH - margin, PAGE_HEIGHT - 40);
    ctx.textAlign = "left";
  }
  
  return canvas.toBuffer("image/png");
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
  { title: "Contact", lines: ["Let's make good work happen.", "", "For opportunities in team leadership, service delivery, customer success, and operations.", "", `${profile.location} \u00b7 India`, "", ...profile.links.map(l => `${l.label}: ${l.href}`)] },
];

const totalPages = pageDefs.length;
for (let i = 0; i < pageDefs.length; i++) {
  const buf = createPage(pageDefs[i].title, pageDefs[i].lines, i + 1, totalPages, pageDefs[i].isCover);
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
