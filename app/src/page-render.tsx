import React from "react";
import { createRoot } from "react-dom/client";
import { profile, sections } from "./data/resume";
import flipbookStyles from "./styles/flipbook.css?inline";

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
  { content: React.createElement(React.Fragment, null,
    SectionHeading({ eyebrow: "02 / PROFESSIONAL PROFILE", title: "Professional summary" }),
    React.createElement("p", { className: "book-lead" }, "Operations & customer success leader \u00b7 7 years"),
    ...summary.body.map((p: string) => React.createElement("p", { className: "book-copy", key: p }, p)),
    React.createElement("div", { className: "book-stat-row" },
      React.createElement("div", null, React.createElement("strong", null, "4"), React.createElement("span", null, "Career stages")),
      React.createElement("div", null, React.createElement("strong", null, "7+"), React.createElement("span", null, "Years of experience")),
      React.createElement("div", null, React.createElement("strong", null, "10"), React.createElement("span", null, "Certifications"))
    )
  )},
  { content: React.createElement(React.Fragment, null,
    SectionHeading({ eyebrow: "03 / EXPERIENCE", title: manager.title, date: manager.meta }),
    React.createElement("p", { className: "book-company" }, manager.subtitle),
    React.createElement("div", { className: "book-highlight-number" }, React.createElement("strong", null, "25"), React.createElement("span", null, "TEAM MEMBERS\nLED")),
    BulletList({ items: manager.bullets.slice(0, 4) })
  )},
  { content: React.createElement(React.Fragment, null,
    SectionHeading({ eyebrow: "03 / EXPERIENCE \u00b7 CONTINUED", title: "Delivery & improvement", date: "2023 \u2014 2025" }),
    React.createElement("p", { className: "book-lead" }, "Keeping service quality and people performance moving together."),
    BulletList({ items: manager.bullets.slice(4) }),
    React.createElement("div", { className: "book-margin-note" }, "FOCUS AREAS ", React.createElement("span", null, "SLA / AHT / CSAT / RCA"))
  )},
  { content: React.createElement(React.Fragment, null,
    SectionHeading({ eyebrow: "04 / EXPERIENCE", title: leader.title, date: leader.meta }),
    React.createElement("p", { className: "book-company" }, leader.subtitle),
    React.createElement("div", { className: "book-highlight-number" }, React.createElement("strong", null, "30"), React.createElement("span", null, "TEAM MEMBERS\nSUPPORTED")),
    BulletList({ items: leader.bullets })
  )},
  { content: React.createElement(React.Fragment, null,
    SectionHeading({ eyebrow: "05 / EXPERIENCE", title: senior.title, date: senior.meta }),
    React.createElement("p", { className: "book-company" }, senior.subtitle),
    React.createElement("p", { className: "book-lead" }, "From resolving difficult cases to helping others do their best work."),
    BulletList({ items: senior.bullets }),
    React.createElement("div", { className: "book-note-card" }, React.createElement("span", null, "THE THROUGH-LINE"), React.createElement("p", null, "Escalation ownership \u00b7 Account retention \u00b7 New-hire enablement"))
  )},
  { content: React.createElement(React.Fragment, null,
    SectionHeading({ eyebrow: "06 / EXPERIENCE", title: associate.title, date: associate.meta }),
    React.createElement("p", { className: "book-company" }, associate.subtitle),
    React.createElement("p", { className: "book-lead" }, "The foundation: customer empathy, clear communication, and systematic troubleshooting."),
    BulletList({ items: associate.bullets }),
    React.createElement("div", { className: "book-note-card" }, React.createElement("span", null, "CAREER FOUNDATION"), React.createElement("p", null, "Frontline email support for technical and business issues, collaborating across teams to help customers get answers."))
  )},
  { content: React.createElement(React.Fragment, null,
    SectionHeading({ eyebrow: "07 / CAPABILITIES", title: "Core competencies" }),
    React.createElement("p", { className: "book-lead" }, "The skills I bring to the team, the client, and the operation."),
    React.createElement("div", { className: "book-skill-list" }, competencies.chips.slice(0, 6).map((skill: string, index: number) => React.createElement("div", { key: skill }, React.createElement("span", null, `0${index + 1}`), React.createElement("p", null, skill), React.createElement("b", null, "\u2197"))))
  )},
  { content: React.createElement(React.Fragment, null,
    SectionHeading({ eyebrow: "07 / CAPABILITIES \u00b7 CONTINUED", title: "How I work" }),
    React.createElement("div", { className: "book-skill-list" }, competencies.chips.slice(6).map((skill: string, index: number) => React.createElement("div", { key: skill }, React.createElement("span", null, `0${index + 7}`), React.createElement("p", null, skill), React.createElement("b", null, "\u2197")))),
    React.createElement("div", { className: "book-quote book-quote--small" }, "Listen carefully. Find the root cause. Coach consistently. Measure what changes.")
  )},
  { content: React.createElement(React.Fragment, null,
    SectionHeading({ eyebrow: "08 / CONTINUOUS LEARNING", title: "Certifications" }),
    React.createElement("p", { className: "book-lead" }, "A practical learning toolkit across quality, analytics, leadership, and problem-solving."),
    React.createElement("div", { className: "book-records" }, certifications.certs.slice(0, 5).map((cert: any) => React.createElement("div", { key: cert.name }, React.createElement("p", null, cert.name), React.createElement("span", null, cert.issuer), React.createElement("time", null, cert.year))))
  )},
  { content: React.createElement(React.Fragment, null,
    SectionHeading({ eyebrow: "08 / CONTINUOUS LEARNING \u00b7 CONTINUED", title: "Learning record" }),
    React.createElement("div", { className: "book-records" }, certifications.certs.slice(5).map((cert: any) => React.createElement("div", { key: cert.name }, React.createElement("p", null, cert.name), React.createElement("span", null, cert.issuer), React.createElement("time", null, cert.year)))),
    React.createElement("div", { className: "book-note-card" }, React.createElement("span", null, "LEARNING BY DESIGN"), React.createElement("p", null, "Continually strengthening service quality, data literacy, decision-making, and people leadership."))
  )},
  { content: React.createElement(React.Fragment, null,
    SectionHeading({ eyebrow: "09 / EDUCATION", title: "The foundations" }),
    React.createElement("div", { className: "book-education-list" }, education.education.map((item: any, index: number) => React.createElement("div", { key: item.qualification }, React.createElement("span", null, `0${index + 1}`), React.createElement("h3", null, item.qualification), React.createElement("p", null, item.institution), React.createElement("time", null, item.years)))),
    React.createElement("div", { className: "book-closing-mark" }, "VC", React.createElement("span", null, "\u00ae"))
  )},
  { content: React.createElement("div", { className: "book-last-page" },
    React.createElement("p", { className: "book-eyebrow" }, "10 / THE NEXT CHAPTER"),
    React.createElement("h2", null, "Let\u2019s make", React.createElement("br"), React.createElement("em", null, "good work"), React.createElement("br"), "happen."),
    React.createElement("p", { className: "book-copy" }, "For opportunities in team leadership, service delivery, customer success, and operations."),
    React.createElement("div", { className: "book-contact-links" }, profile.links.map((link: any) => React.createElement("a", { href: link.href, target: "_blank", rel: "noreferrer", key: link.label }, link.label, React.createElement("span", null, "\u2197")))),
    React.createElement("p", { className: "book-location" }, `${profile.location} \u00b7 India`)
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
