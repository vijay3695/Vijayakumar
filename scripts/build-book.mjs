import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { createCanvas } from "@napi-rs/canvas";

const PROJECT_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PAGES_DIR = path.join(PROJECT_ROOT, "dist", "openzine-pages");
const BOOK_OUT = path.join(PROJECT_ROOT, "openzine-book.html");
const MAKE_BOOK = path.join(PROJECT_ROOT, ".codex", "skills", "openzine", "scripts", "make-book.mjs");

const PAGE_WIDTH = 1440;
const PAGE_HEIGHT = 1986;

// Read resume data
const resumeModule = await import("/tmp/resume.js");
const { profile, sections } = resumeModule;

// Create pages directory
await fs.mkdir(PAGES_DIR, { recursive: true });

const manager = sections.find((s) => s.id === "exp-team-manager");
const leader = sections.find((s) => s.id === "exp-team-leader");
const senior = sections.find((s) => s.id === "exp-senior-csa");
const associate = sections.find((s) => s.id === "exp-csa");
const about = sections.find((s) => s.id === "about");
const summary = sections.find((s) => s.id === "summary");
const competencies = sections.find((s) => s.id === "competencies");
const certifications = sections.find((s) => s.id === "certifications");
const education = sections.find((s) => s.id === "education");

function createPage(title, lines) {
  const canvas = createCanvas(PAGE_WIDTH, PAGE_HEIGHT);
  const ctx = canvas.getContext("2d");
  // Background
  ctx.fillStyle = "#f4f0e6";
  ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  // Title
  ctx.fillStyle = "#292820";
  ctx.font = "bold 64px serif";
  ctx.fillText(title, 80, 120);
  // Underline
  ctx.strokeStyle = "#d7d0c2";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 140);
  ctx.lineTo(PAGE_WIDTH - 80, 140);
  ctx.stroke();
  // Content
  ctx.font = "28px serif";
  ctx.fillStyle = "#59564c";
  let y = 200;
  for (const line of lines) {
    if (y > PAGE_HEIGHT - 100) break;
    ctx.fillText(line, 80, y);
    y += 40;
  }
  // Footer
  ctx.font = "16px monospace";
  ctx.fillStyle = "#8a8477";
  ctx.fillText("VIJAYAKUMAR CHANDIRAN", 80, PAGE_HEIGHT - 40);
  return canvas.toBuffer("image/jpeg");
}

const pageDefs = [
  { title: "Vijayakumar Chandiran", lines: [profile.role, "", "CURRICULUM VITAE", "2026 EDITION", "", "CAREER / PEOPLE / OPERATIONS"] },
  { title: "About Me", lines: about.body },
  { title: "Professional Summary", lines: ["Operations & customer success leader \u00b7 7 years", ...summary.body] },
  { title: manager.title, lines: [manager.subtitle, "", ...manager.bullets.slice(0, 4)] },
  { title: "Delivery & Improvement", lines: ["2023 \u2014 2025", ...manager.bullets.slice(4)] },
  { title: leader.title, lines: [leader.subtitle, "", ...leader.bullets] },
  { title: senior.title, lines: [senior.subtitle, "", ...senior.bullets] },
  { title: associate.title, lines: [associate.subtitle, "", ...associate.bullets] },
  { title: "Core Competencies", lines: competencies.chips },
  { title: "How I Work", lines: ["Listen carefully. Find the root cause. Coach consistently. Measure what changes.", ...competencies.chips.slice(6)] },
  { title: "Certifications", lines: certifications.certs.map(c => `${c.name} - ${c.issuer} (${c.year})`) },
  { title: "Learning Record", lines: certifications.certs.slice(5).map(c => `${c.name} - ${c.issuer} (${c.year})`) },
  { title: "Education", lines: education.education.map(e => `${e.qualification} - ${e.institution} (${e.years})`) },
  { title: "Contact", lines: ["Let's make good work happen.", "For opportunities in team leadership, service delivery, customer success, and operations.", profile.location + " \u00b7 India", ...profile.links.map(l => l.label + ": " + l.href)] },
];

for (let i = 0; i < pageDefs.length; i++) {
  const buf = createPage(pageDefs[i].title, pageDefs[i].lines);
  await fs.writeFile(path.join(PAGES_DIR, `page-${String(i + 1).padStart(2, "0")}.jpg`), buf);
  console.log(`Created page ${i + 1}: ${pageDefs[i].title}`);
}

// Run make-book.mjs
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
