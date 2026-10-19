import React from "react";
import { createRoot } from "react-dom/client";
import { profile, sections } from "./data/resume";
import flipbookStyles from "./styles/flipbook.css?inline";
import { openZinePaperGrain } from "./openzine/grain";

// Page components
function PageFrame({ children, page, total }: any) {
  return React.createElement("article", { className: "paper-sheet" },
    React.createElement("div", { className: "paper-grain", "aria-hidden": "true" }),
    React.createElement("div", { className: "paper-sheet__content" }, children),
    React.createElement("footer", { className: "paper-sheet__footer" },
      React.createElement("span", null, "VIJAYAKUMAR CHANDIRAN"),
      React.createElement("span", null, `${String(page + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`)
    )
  );
}

function SectionHeading({ eyebrow, title, date }: any) {
  return React.createElement("header", { className: "book-section-heading" },
    React.createElement("p", null, eyebrow),
    React.createElement("h2", null, title),
    date && React.createElement("span", null, date),
    React.createElement("div", null)
  );
}

// Get page index from URL
const params = new URLSearchParams(window.location.search);
const pageIndex = parseInt(params.get("page") || "0", 10);

// Resume data
const manager = sections.find((s: any) => s.id === "exp-team-manager");
const leader = sections.find((s: any) => s.id === "exp-team-leader");
const senior = sections.find((s: any) => s.id === "exp-senior-csa");
const associate = sections.find((s: any) => s.id === "exp-csa");
const about = sections.find((s: any) => s.id === "about");
const summary = sections.find((s: any) => s.id === "summary");
const competencies = sections.find((s: any) => s.id === "competencies");
const certifications = sections.find((s: any) => s.id === "certifications");
const education = sections.find((s: any) => s.id === "education");

// Page content definitions (simplified - just text)
const pageTexts = [
  { title: "Vijayakumar Chandiran", lines: [profile.role, "CURRICULUM VITAE", "2026 EDITION"] },
  { title: "About Me", lines: about.body },
  { title: "Professional Summary", lines: [summary.body[0], ...summary.body.slice(1)] },
];

// Render the page
const root = document.getElementById("root");
if (root) {
  const idx = Math.min(pageIndex, pageTexts.length - 1);
  const page = pageTexts[idx];
  root.innerHTML = `
    <div style="width:1440px;height:1986px;background:#f4f0e6;color:#292820;padding:80px;box-sizing:border-box;font-family:'DM Sans',sans-serif;">
      <h1 style="font-family:'Playfair Display',serif;font-size:64px;margin:0 0 40px">${page.title}</h1>
      ${page.lines.map(l => `<p style="font-size:24px;line-height:1.8;margin:0 0 20px;color:#59564c">${l}</p>`).join("")}
    </div>
  `;
}
