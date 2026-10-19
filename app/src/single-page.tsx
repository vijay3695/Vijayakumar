import React from "react";
import { createRoot } from "react-dom/client";
import { profile, sections } from "./data/resume";
import flipbookStyles from "./styles/flipbook.css?inline";

// Copy page components from FlipbookResume
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

function BulletList({ items }: any) {
  return React.createElement("ul", { className: "book-bullets" },
    items.map((item: string) => React.createElement("li", { key: item }, item))
  );
}

const manager = sections.find((s: any) => s.id === "exp-team-manager");
const leader = sections.find((s: any) => s.id === "exp-team-leader");
const senior = sections.find((s: any) => s.id === "exp-senior-csa");
const associate = sections.find((s: any) => s.id === "exp-csa");
const about = sections.find((s: any) => s.id === "about");
const summary = sections.find((s: any) => s.id === "summary");
const competencies = sections.find((s: any) => s.id === "competencies");
const certifications = sections.find((s: any) => s.id === "certifications");
const education = sections.find((s: any) => s.id === "education");

const pageDefs = [
  { content: React.createElement("div", { className: "book-cover" },
    React.createElement("div", { className: "cover-overline" }, React.createElement("span", null, "CURRICULUM VITAE"), React.createElement("span", null, "2026 EDITION")),
    React.createElement("div", { className: "cover-orbit cover-orbit--one" }),
    React.createElement("div", { className: "cover-orbit cover-orbit--two" }),
    React.createElement("p", { className: "cover-index" }, "CAREER / PEOPLE / OPERATIONS"),
    React.createElement("h1", null, "Vijayakumar", React.createElement("br"), React.createElement("em", null, "Chandiran.")),
    React.createElement("p", { className: "cover-role" }, profile.role),
    React.createElement("div", { className: "cover-bottom" }, React.createElement("span", null, "CHENNAI, INDIA"), React.createElement("span", null, "TURN THE PAGE ", React.createElement("b", null, "\u2197"))),
    React.createElement("div", { className: "cover-spine-mark" }, "VC")
  )},
  { content: React.createElement(React.Fragment, null,
    SectionHeading({ eyebrow: "01 / THE PERSON", title: "A little about me" }),
    React.createElement("p", { className: "book-lead" }, "People, process, and the numbers behind both."),
    ...about.body.map((p: string) => React.createElement("p", { className: "book-copy", key: p }, p)),
    React.createElement("div", { className: "book-quote" }, "\u201cGood service is built by people who feel supported, processes that make sense, and decisions grounded in evidence.\u201d")
  )},
];

const params = new URLSearchParams(window.location.search);
const pageIndex = parseInt(params.get("page") || "0", 10);

const root = document.getElementById("root");
if (root) {
  const style = document.createElement("style");
  style.textContent = flipbookStyles;
  document.head.appendChild(style);
  const container = document.createElement("div");
  container.style.width = "1440px";
  container.style.height = "1986px";
  container.style.overflow = "hidden";
  container.style.background = "#f4f0e6";
  root.appendChild(container);
  const reactRoot = createRoot(container);
  const idx = Math.min(pageIndex, pageDefs.length - 1);
  reactRoot.render(React.createElement(PageFrame, { page: idx, total: pageDefs.length }, pageDefs[idx].content));
}
