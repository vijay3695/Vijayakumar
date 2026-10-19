import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { profile, sections } from "./data/resume";
import "./styles/flipbook.css";

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
  { label: "About", content: <><SectionHeading eyebrow="01 / THE PERSON" title="A little about me" /><p className="book-lead">People, process, and the numbers behind both.</p>{about.body.map((paragraph) => <p className="book-copy" key={paragraph}>{paragraph}</p>}<div className="book-quote">“Good service is built by people who feel supported, processes that make sense, and decisions grounded in evidence.”</div></> },
  { label: "Summary", content: <><SectionHeading eyebrow="02 / PROFESSIONAL PROFILE" title="Professional summary" /><p className="book-lead">Operations & customer success leader · 7 years</p>{summary.body.map((paragraph) => <p className="book-copy" key={paragraph}>{paragraph}</p>}<div className="book-stat-row"><div><strong>4</strong><span>Career stages</span></div><div><strong>7+</strong><span>Years of experience</span></div><div><strong>10</strong><span>Certifications</span></div></div></> },
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
  { label: "Credits", content: <><SectionHeading eyebrow="COLOPHON / CREDITS" title="Made with respect" /><p className="book-copy">This resume book is an original implementation inspired by the craft of digital publishing and the page-turning experience of OpenZine.</p><div className="book-credit-list"><p><strong>OpenZine</strong><span>Page-turning interaction inspiration by Joseph Zhou.</span><a href="https://github.com/JosssphZhou/openzine" target="_blank" rel="noreferrer">View project ↗</a></p><p><strong>PageFlip / StPageFlip</strong><span>Open-source page-turning library project and documentation.</span><a href="https://github.com/Nodlik/StPageFlip" target="_blank" rel="noreferrer">View project ↗</a></p><p><strong>Paper Mono</strong><span>Visual inspiration for refined digital paper and typography. Proprietary renderer and textures are not copied.</span><a href="https://app.paper.design/playground/paper-mono" target="_blank" rel="noreferrer">View inspiration ↗</a></p></div><p className="book-small-print">Resume content and personal career history belong to Vijayakumar Chandiran. Type and other third-party resources remain with their respective creators.</p></> }
];

export default function FlipbookResume() {
  const [current, setCurrent] = useState(0);
  const [turn, setTurn] = useState<"next" | "prev" | null>(null);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const turnTimer = useRef<number | undefined>(undefined);
  const go = useCallback((direction: "next" | "prev") => {
    if (turn) return;
    if ((direction === "next" && current >= pages.length - 1) || (direction === "prev" && current <= 0)) return;
    setShowHelp(false);
    setTurn(direction);
    window.clearTimeout(turnTimer.current);
    turnTimer.current = window.setTimeout(() => {
      setCurrent((page) => Math.max(0, Math.min(pages.length - 1, page + (direction === "next" ? 1 : -1))));
      setTurn(null);
      setDrag({ x: 0, y: 0 });
    }, 620);
  }, [current, turn]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown") { event.preventDefault(); go("next"); }
      else if (event.key === "ArrowLeft" || event.key === "PageUp") { event.preventDefault(); go("prev"); }
      else if (event.key === "Home") { event.preventDefault(); setCurrent(0); setTurn(null); }
      else if (event.key === "End") { event.preventDefault(); setCurrent(pages.length - 1); setTurn(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); window.clearTimeout(turnTimer.current); };
  }, [go]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (turn) return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
    setDragging(true);
    setDrag({ x: 0, y: 0 });
    setShowHelp(false);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging || !pointerStart.current || turn) return;
    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;
    setDrag({ x: dx, y: dy });
  };
  const onPointerUp = () => {
    if (!pointerStart.current) return;
    const dx = drag.x;
    setDragging(false);
    pointerStart.current = null;
    if (Math.abs(dx) > 65) go(dx < 0 ? "next" : "prev");
    else setDrag({ x: 0, y: 0 });
  };

  const activePage = pages[current];
  const basePage = turn ? pages[Math.max(0, Math.min(pages.length - 1, current + (turn === "next" ? 1 : -1)))] : activePage;
  const turningPage = activePage;
  return <main className="flipbook-app">
    <header className="flipbook-topline"><a className="flipbook-monogram" href="#book" aria-label="Go to resume cover">VC<span>®</span></a><div><span>AN INTERACTIVE RESUME</span><i>·</i><span>2026</span></div><a className="flipbook-print" href="javascript:window.print()" onClick={(event) => { event.preventDefault(); window.print(); }}>PRINT / SAVE PDF <span>↗</span></a></header>
    <section className="flipbook-stage" id="book" aria-label="Interactive resume book">
      <div className="book-top-caption"><span>PERSONAL EDITION</span><span>{String(current + 1).padStart(2, "0")} — {String(pages.length).padStart(2, "0")}</span></div>
      <div className="book-shadow" />
      <div className={"book-viewport" + (turn ? " is-turning" : "")} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onClick={(event) => { if ((event.target as HTMLElement).closest("button, a")) return; const bounds = event.currentTarget.getBoundingClientRect(); go(event.clientX < bounds.left + bounds.width / 2 ? "prev" : "next"); }} onContextMenu={(event) => event.preventDefault()}>
        <div className="book-page-stack" aria-live="polite">
          <div className="book-page book-page--current" key={turn ? current + (turn === "next" ? 1 : -1) : current}><PageFrame page={turn ? current + (turn === "next" ? 1 : -1) : current} total={pages.length}>{basePage.content}</PageFrame></div>
          {turn && <div className={"book-page book-page--turn book-page--" + turn} key={current + turn} style={{ transform: dragging ? "translateX(" + drag.x * .12 + "px) rotateY(" + (turn === "next" ? -Math.min(165, Math.abs(drag.x) * .8) : Math.min(165, Math.abs(drag.x) * .8)) + "deg) rotateZ(" + drag.y * .025 + "deg)" : undefined }}><PageFrame page={turn === "next" ? current : Math.max(0, current - 1)} total={pages.length}>{turningPage.content}</PageFrame></div>}
        </div>
        {showHelp && <div className="book-gesture-hint"><span>↙</span> DRAG A PAGE CORNER TO TURN <span>↗</span></div>}
        <button className="book-edge book-edge--prev" aria-label="Previous page" onPointerDown={(event) => event.stopPropagation()} onClick={() => go("prev")} disabled={current === 0 || Boolean(turn)}><span>‹</span></button>
        <button className="book-edge book-edge--next" aria-label="Next page" onPointerDown={(event) => event.stopPropagation()} onClick={() => go("next")} disabled={current === pages.length - 1 || Boolean(turn)}><span>›</span></button>
      </div>
      <div className="book-controls"><button type="button" onClick={() => go("prev")} disabled={current === 0 || Boolean(turn)} aria-label="Previous page">← <span>PREVIOUS</span></button><div className="book-progress" aria-label={"Page " + (current + 1) + " of " + pages.length}><div><span style={{ width: ((current + 1) / pages.length * 100) + "%" }} /></div><small>{String(current + 1).padStart(2, "0")} <i>/</i> {String(pages.length).padStart(2, "0")}</small></div><button type="button" onClick={() => go("next")} disabled={current === pages.length - 1 || Boolean(turn)} aria-label="Next page"><span>NEXT</span> →</button></div>
      <div className="book-bottom-note"><span>DESIGNED TO BE READ, ONE PAGE AT A TIME</span><span>← → KEYBOARD / SWIPE / DRAG</span></div>
    </section>
  </main>;
}
