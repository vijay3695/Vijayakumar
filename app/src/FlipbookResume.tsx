import { useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { profile, sections } from "./data/resume";
import flipbookStyles from "./styles/flipbook.css?inline";
import openZineRuntime from "../../.codex/skills/openzine/runtime/openzine.js?raw";
import { openZinePaperGrain } from "./openzine/grain";

type BookPage = { label: string; content: ReactNode; kind?: string };

function PageFrame({ children, page, total }: { children: ReactNode; page: number; total: number }) {
  return <article className="paper-sheet">
    <div className="paper-grain" aria-hidden="true" />
    <div className="paper-sheet__content">{children}</div>
    <footer className="paper-sheet__footer"><span>VIJAYAKUMAR CHANDIRAN</span><span>{String(page + 1).padStart(2, "0")} <i>/</i> {String(total).padStart(2, "0")}</span></footer>
  </article>;
}

function SectionHeading({ eyebrow, title, date }: { eyebrow: string; title: string; date?: string }) {
  return <header className="book-section-heading"><p>{eyebrow}</p><h2>{title}</h2>{date && <span>{date}</span>}<div /></header>;
}

function BulletList({ items }: { items: string[] }) {
  return <ul className="book-bullets">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

const manager = sections.find((section) => section.id === "exp-team-manager")!;
const leader = sections.find((section) => section.id === "exp-team-leader")!;
const senior = sections.find((section) => section.id === "exp-senior-csa")!;
const associate = sections.find((section) => section.id === "exp-csa")!;
const about = sections.find((section) => section.id === "about")!;
const summary = sections.find((section) => section.id === "summary")!;
const competencies = sections.find((section) => section.id === "competencies")!;
const certifications = sections.find((section) => section.id === "certifications")!;
const education = sections.find((section) => section.id === "education")!;

const pages: BookPage[] = [
  { label: "Cover", kind: "cover", content: <div className="book-cover">
    <div className="cover-overline"><span>CURRICULUM VITAE</span><span>2026 EDITION</span></div>
    <div className="cover-orbit cover-orbit--one" /><div className="cover-orbit cover-orbit--two" />
    <p className="cover-index">CAREER / PEOPLE / OPERATIONS</p>
    <h1>Vijayakumar<br /><em>Chandiran.</em></h1>
    <p className="cover-role">{profile.role}</p>
    <div className="cover-bottom"><span>CHENNAI, INDIA</span><span>TURN THE PAGE <b>↗</b></span></div>
    <div className="cover-spine-mark">VC</div>
  </div> },
  { label: "About", content: <><SectionHeading eyebrow="01 / THE PERSON" title="A little about me" /><p className="book-lead">People, process, and the numbers behind both.</p>{about.body.map((paragraph) => <p className="book-copy" key={paragraph}>{paragraph}</p>)}<div className="book-quote">“Good service is built by people who feel supported, processes that make sense, and decisions grounded in evidence.”</div></> },
  { label: "Summary", content: <><SectionHeading eyebrow="02 / PROFESSIONAL PROFILE" title="Professional summary" /><p className="book-lead">Operations & customer success leader · 7 years</p>{summary.body.map((paragraph) => <p className="book-copy" key={paragraph}>{paragraph}</p>)}<div className="book-stat-row"><div><strong>4</strong><span>Career stages</span></div><div><strong>7+</strong><span>Years of experience</span></div><div><strong>10</strong><span>Certifications</span></div></div></> },
  { label: "Team Manager", content: <><SectionHeading eyebrow="03 / EXPERIENCE" title={manager.title} date={manager.meta} /><p className="book-company">{manager.subtitle}</p><div className="book-highlight-number"><strong>25</strong><span>TEAM MEMBERS<br />LED</span></div><BulletList items={manager.bullets!.slice(0, 4)} /></> },
  { label: "Team Manager", content: <><SectionHeading eyebrow="03 / EXPERIENCE · CONTINUED" title="Delivery & improvement" date="2023 — 2025" /><p className="book-lead">Keeping service quality and people performance moving together.</p><BulletList items={manager.bullets!.slice(4)} /><div className="book-margin-note">FOCUS AREAS <span>SLA / AHT / CSAT / RCA</span></div></> },
  { label: "Team Leader", content: <><SectionHeading eyebrow="04 / EXPERIENCE" title={leader.title} date={leader.meta} /><p className="book-company">{leader.subtitle}</p><div className="book-highlight-number"><strong>30</strong><span>TEAM MEMBERS<br />SUPPORTED</span></div><BulletList items={leader.bullets!} /></> },
  { label: "Senior Support", content: <><SectionHeading eyebrow="05 / EXPERIENCE" title={senior.title} date={senior.meta} /><p className="book-company">{senior.subtitle}</p><p className="book-lead">From resolving difficult cases to helping others do their best work.</p><BulletList items={senior.bullets!} /><div className="book-note-card"><span>THE THROUGH-LINE</span><p>Escalation ownership · Account retention · New-hire enablement</p></div></> },
  { label: "Customer Support", content: <><SectionHeading eyebrow="06 / EXPERIENCE" title={associate.title} date={associate.meta} /><p className="book-company">{associate.subtitle}</p><p className="book-lead">The foundation: customer empathy, clear communication, and systematic troubleshooting.</p><BulletList items={associate.bullets!} /><div className="book-note-card"><span>CAREER FOUNDATION</span><p>Frontline email support for technical and business issues, collaborating across teams to help customers get answers.</p></div></> },
  { label: "Expertise", content: <><SectionHeading eyebrow="07 / CAPABILITIES" title="Core competencies" /><p className="book-lead">The skills I bring to the team, the client, and the operation.</p><div className="book-skill-list">{competencies.chips!.slice(0, 6).map((skill, index) => <div key={skill}><span>0{index + 1}</span><p>{skill}</p><b>↗</b></div>)}</div></> },
  { label: "Expertise", content: <><SectionHeading eyebrow="07 / CAPABILITIES · CONTINUED" title="How I work" /><div className="book-skill-list">{competencies.chips!.slice(6).map((skill, index) => <div key={skill}><span>0{index + 7}</span><p>{skill}</p><b>↗</b></div>)}</div><div className="book-quote book-quote--small">Listen carefully. Find the root cause. Coach consistently. Measure what changes.</div></> },
  { label: "Certifications", content: <><SectionHeading eyebrow="08 / CONTINUOUS LEARNING" title="Certifications" /><p className="book-lead">A practical learning toolkit across quality, analytics, leadership, and problem-solving.</p><div className="book-records">{certifications.certs!.slice(0, 5).map((cert) => <div key={cert.name}><p>{cert.name}</p><span>{cert.issuer}</span><time>{cert.year}</time></div>)}</div></> },
  { label: "Certifications", content: <><SectionHeading eyebrow="08 / CONTINUOUS LEARNING · CONTINUED" title="Learning record" /><div className="book-records">{certifications.certs!.slice(5).map((cert) => <div key={cert.name}><p>{cert.name}</p><span>{cert.issuer}</span><time>{cert.year}</time></div>)}</div><div className="book-note-card"><span>LEARNING BY DESIGN</span><p>Continually strengthening service quality, data literacy, decision-making, and people leadership.</p></div></> },
  { label: "Education", content: <><SectionHeading eyebrow="09 / EDUCATION" title="The foundations" /><div className="book-education-list">{education.education!.map((item, index) => <div key={item.qualification}><span>0{index + 1}</span><h3>{item.qualification}</h3><p>{item.institution}</p><time>{item.years}</time></div>)}</div><div className="book-closing-mark">VC<span>®</span></div></> },
  { label: "Contact", content: <div className="book-last-page"><p className="book-eyebrow">10 / THE NEXT CHAPTER</p><h2>Let’s make<br /><em>good work</em><br />happen.</h2><p className="book-copy">For opportunities in team leadership, service delivery, customer success, and operations.</p><div className="book-contact-links">{profile.links.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>{link.label}<span>↗</span></a>)}</div><p className="book-location">{profile.location} · India</p></div> },
];


function makeOpenZinePage(content: ReactNode, index: number): string {
  const pageMarkup = renderToStaticMarkup(
    <PageFrame page={index} total={pages.length}>{content}</PageFrame>
  );
  const css = flipbookStyles.replace(/^@import[^;]+;\s*/m, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="720" height="993" viewBox="0 0 720 993">
    <foreignObject x="0" y="0" width="720" height="993">
      <div xmlns="http://www.w3.org/1999/xhtml" style="width:720px;height:993px;overflow:hidden;background:#f4f0e6;color:#292820">
        <style>${css}\n:root{--openzine-paper-grain:${openZinePaperGrain};--paper:#f4f0e6;--ink:#292820;--rule:#d7d0c2;--accent:#9b7846;--mono:'DM Mono',monospace}</style>
        ${pageMarkup}
      </div>
    </foreignObject>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

export default function FlipbookResume() {
  const viewerDocument = useMemo(() => {
    // OpenZine requires page textures. Create them in-browser from the live JSX
    // page components; no pre-rendered resume images are committed to the repo.
    const pageUrls = pages.map((page, index) => makeOpenZinePage(page.content, index));
    const config = {
      title: "Vijayakumar Chandiran — Interactive Resume",
      lang: "en",
      pages: pageUrls,
      pageCount: pageUrls.length,
      initialSpread: 0,
      portrait: "single"
    };
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#f6f6f3}body{height:100svh}</style></head><body><script>window.OPENZINE=${JSON.stringify(config)};</script><script>${openZineRuntime.split("</script").join("<\\/script")}</script></body></html>`;
  }, []);

  return (
    <main className="flipbook-app flipbook-app--openzine">
      <header className="flipbook-topline">
        <a className="flipbook-monogram" href="#book" aria-label="Go to resume cover">VC<span>®</span></a>
        <div><span>AN INTERACTIVE RESUME</span><i>·</i><span>2026</span></div>
        <a className="flipbook-print" href="#print" onClick={(event) => { event.preventDefault(); window.print(); }}>PRINT / SAVE PDF <span>↗</span></a>
      </header>
      <iframe
        className="openzine-viewer"
        title="Interactive resume book with OpenZine paper-turn renderer"
        srcDoc={viewerDocument}
        sandbox="allow-scripts"
        allow="fullscreen"
      />
    </main>
  );
}
