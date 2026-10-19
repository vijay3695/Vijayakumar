import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import ThreeWorld from "./ThreeWorld";
import { profile, sections, type Section } from "./data/resume";
import "./styles/ant-story.css";

type Beat = { id: string; label: string; kind: string; location: string; section?: Section };

const sectionLocations: Record<string, string> = {
  about: "Notebook · about me",
  summary: "Open book · professional summary",
  competencies: "Operations dashboard",
  "exp-team-manager": "Monitor · service delivery",
  "exp-team-leader": "Performance report",
  "exp-senior-csa": "Case file · senior support",
  "exp-csa": "Keyboard · frontline support",
  certifications: "Book stack · certifications",
  education: "Diploma frame · education"
};

const chapterNarratives: Record<string, string> = {
  about: "The ant reaches a well-used notebook. Before the job titles, meet the person behind the journey and the values carried from one role to the next.",
  summary: "It opens a book. The pages connect the whole journey: customer experience, practical problem-solving, and the people who make service work.",
  competencies: "A dashboard lights up with the tools used to turn daily challenges into consistent service: clear analysis, coaching, quality, and communication.",
  "exp-team-manager": "The monitor becomes an operations command centre. At this stage, the focus expands to delivery across a 25-member team, client escalations, and measurable service performance.",
  "exp-team-leader": "A performance report sits open on the desk. Leadership here means turning root-cause findings into coaching, corrective action, and dependable results for a 30-member team.",
  "exp-senior-csa": "The case file holds the work behind a calm customer experience: resolving escalations, supporting key accounts, and helping new colleagues find their feet.",
  "exp-csa": "Back at the keyboard, the story returns to its starting point: careful email support, collaboration with technical teams, and solving the customer's problem.",
  certifications: "The ant climbs a stack of books. Each one represents a new tool learned along the way, from quality and root-cause analysis to account management and analytics.",
  education: "At the framed diploma, the journey pauses at its academic foundation: computer science, analytical thinking, and a habit of continuing to learn."
};

function DetailCard({ beat }: { beat: Beat }) {
  const s = beat.section;
  if (!s) return null;
  return (
    <article className="story-card" key={s.id}>
      <p className="story-eyebrow">{s.highlight} · {s.kind === "experience" ? "CAREER JOURNEY" : "CHAPTER"}</p>
      <h2>{s.title}</h2>
      {s.subtitle && <p className="story-subtitle">{s.subtitle}{s.meta ? " · " + s.meta : ""}</p>}
      {chapterNarratives[s.id] && <p className="story-narrative">{chapterNarratives[s.id]}</p>}
      {s.body.map((line) => <p className="story-copy" key={line}>{line}</p>)}
      {s.bullets && <ul className="story-list">{s.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
      {s.chips && <div className="story-chips">{s.chips.map((item) => <span key={item}>{item}</span>)}</div>}
      {s.metrics && <div className="story-metrics">{s.metrics.map((m) => <div key={m.label}><strong>{m.value}</strong><span>{m.label}</span></div>)}</div>}
      {s.certs && <div className="story-records">{s.certs.map((c) => <div key={c.name}><strong>{c.name}</strong><span>{c.issuer} · {c.year}</span></div>)}</div>}
      {s.education && <div className="story-records">{s.education.map((e) => <div key={e.qualification}><strong>{e.qualification}</strong><span>{e.institution} · {e.years}</span></div>)}</div>}
    </article>
  );
}

export default function AntStory() {
  const beats = useMemo<Beat[]>(() => [
    { id: "opening", label: "The beginning", kind: "opening", location: "Keyboard → monitor" },
    ...sections.map((section) => ({
      id: section.id, label: section.highlight, kind: section.kind, section,
      location: sectionLocations[section.id] ?? "Desk landmark"
    })),
    { id: "sugar", label: "The next goal", kind: "ending", location: "Sugar cube · next goal" }
  ], []);
  const [active, setActive] = useState(0);
  const [reacting, setReacting] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const current = beats[active];
  const progress = Math.round((active / (beats.length - 1)) * 100);

  useEffect(() => {
    if (!reacting) return;
    const timer = window.setTimeout(() => { setReacting(false); }, 1900);
    return () => window.clearTimeout(timer);
  }, [reacting]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown") setActive((v) => Math.min(beats.length - 1, v + 1));
      if (event.key === "ArrowLeft" || event.key === "PageUp") setActive((v) => Math.max(0, v - 1));
      if (event.key === "Home") setActive(0);
      if (event.key === "End") setActive(beats.length - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [beats.length]);

  const jumpTo = (index: number) => setActive(Math.max(0, Math.min(beats.length - 1, index)));
  const toggleMotion = () => setMotionPaused((paused) => !paused);
  const onWorldTouchStart = (event: TouchEvent<HTMLDivElement>) => { touchStart.current = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }; };
  const onWorldTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const dx = event.changedTouches[0].clientX - touchStart.current.x;
    const dy = event.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.2) jumpTo(active + (dx < 0 ? 1 : -1));
  };

  return (
    <main className="ant-story">
      <div className="story-topline">
        <a className="story-wordmark" href="#story-start" onClick={(e) => { e.preventDefault(); jumpTo(0); }}>V<span>.</span>C</a>
        <span className="story-location">A tiny journey through a career</span>
        <a className="story-contact" href={profile.links[0]?.href} target="_blank" rel="noreferrer">Say hello ↗</a>
      </div>
      <div className={"world world--" + current.kind + " world--" + current.id + (motionPaused ? " world--paused" : "")} aria-live="polite" onTouchStart={onWorldTouchStart} onTouchEnd={onWorldTouchEnd}>
        <ThreeWorld active={active} kind={current.kind} reacting={reacting} paused={motionPaused} onAntClick={() => setReacting(true)} />
        <div className="world-caption" aria-hidden="true">
          <span>CHAPTER {String(active + 1).padStart(2, "0")}</span><i />
          <strong>{current.label}</strong><em>{current.location}</em>
        </div>
      </div>
      <section className="story-content" id="story-start">
        <div className="story-content__copy">
          <div className="story-motion-control"><button type="button" onClick={toggleMotion} aria-pressed={motionPaused}>{motionPaused ? "▶ Resume motion" : "Ⅱ Pause scene"}</button></div>
          {current.kind === "opening" ? (
            <article className="story-card story-card--intro">
              <p className="story-eyebrow">A PORTFOLIO, WITH A LITTLE LIFE</p>
              <h1>{profile.name}<span className="name-period" aria-hidden="true">.</span></h1>
              <p className="story-subtitle">{profile.role} · {profile.location}</p>
              <p className="story-copy">Someone is typing in a quiet, warmly lit room. A tiny ant steps between the moving keys, pauses to study the strange landscape, then begins climbing toward the glowing screen. Your name is already waiting there. Follow the ant as it crosses the monitor and leads you through the work, lessons, and people that shaped my career.</p>
              {profile.bio.map((line) => <p className="story-copy" key={line}>{line}</p>)}
              <p className="story-status"><span />{profile.available}</p>
              <div className="story-metrics">{profile.stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>
              <button className="story-primary" onClick={() => jumpTo(1)}>Start the journey <span>→</span></button>
            </article>
          ) : current.kind === "ending" ? (
            <article className="story-card story-card--ending">
              <p className="story-eyebrow">ONE LAST LITTLE DISCOVERY</p>
              <h2>Always curious. Always growing.</h2>
              <p className="story-copy">The ant finds a sugar cube, gives it a determined little tug, and looks back at you. There is always another problem to solve, another person to help, and another hill worth climbing.</p>
              <p className="story-copy">Thanks for walking this little world with me.</p>
              <div className="story-end-links">{profile.links.map((link) => <a href={link.href} key={link.label} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div>
              <button className="story-primary" onClick={() => jumpTo(0)}>Take the journey again <span>↺</span></button>
            </article>
          ) : <DetailCard beat={current} />}
        </div>
        <aside className="story-rail">
          <div className="story-progress"><span style={{ height: progress + "%" }} /></div>
          <span className="story-progress-label">{String(active + 1).padStart(2, "0")} / {String(beats.length).padStart(2, "0")}</span>
          <button onClick={() => jumpTo(active - 1)} disabled={active === 0} aria-label="Previous chapter">↑</button>
          <button onClick={() => jumpTo(active + 1)} disabled={active === beats.length - 1} aria-label="Next chapter">↓</button>
        </aside>
      </section>
      <nav className="story-chapters" aria-label="Jump to a resume chapter">
        {beats.map((beat, index) => <button key={beat.id} className={index === active ? "is-active" : ""} onClick={() => jumpTo(index)} aria-current={index === active ? "step" : undefined}><span>{String(index + 1).padStart(2, "0")}</span>{beat.label}</button>)}
      </nav>
      <footer className="story-footer"><span>MADE OF SMALL STEPS</span><span>{profile.name} · {profile.location}</span><span>Use ← → to explore</span></footer>
    </main>
  );
}
