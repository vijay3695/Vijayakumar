import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { profile, sections, type Section } from "./data/resume";
import "./styles/ant-story.css";

type Beat = { id: string; label: string; kind: string; section?: Section };

function Ant({ reacting, walking, onClick }: { reacting: boolean; walking: boolean; onClick: () => void }) {
  return (
    <button className={"ant-button " + (reacting ? "is-reacting " : "") + (walking ? "is-walking" : "is-resting")} onClick={onClick} aria-label="Pause and greet the tiny ant" title="Tap to say hello">
      <svg className="ant" viewBox="0 0 220 150" role="img" aria-label="A cute animated ant">
        <ellipse cx="108" cy="137" rx="67" ry="7" fill="rgba(0,0,0,.22)" />
        <g className="ant-legs" stroke="#442019" strokeWidth="7" strokeLinecap="round" fill="none">
          <path className="leg leg-a" d="M94 91 L76 107 L66 126" /><path className="leg leg-b" d="M111 97 L108 115 L118 130" /><path className="leg leg-c" d="M127 91 L143 105 L151 124" />
          <path className="leg leg-d" d="M95 89 L74 95 L61 109" /><path className="leg leg-e" d="M111 94 L126 108 L128 125" /><path className="leg leg-f" d="M127 87 L149 91 L162 105" />
        </g>
        <g className="ant-body">
          <ellipse cx="145" cy="83" rx="34" ry="30" fill="#713426" />
          <ellipse cx="145" cy="76" rx="26" ry="20" fill="#9c4b36" opacity=".7" />
          <path d="M121 71 Q143 51 163 70" stroke="#c16c50" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".8" />
          <ellipse cx="102" cy="88" rx="25" ry="23" fill="#4b211c" />
          <ellipse cx="102" cy="80" rx="17" ry="12" fill="#6f3327" />
          <circle cx="70" cy="72" r="30" fill="#7c392b" />
          <ellipse cx="62" cy="61" rx="20" ry="13" fill="#a8523a" opacity=".65" />
          <ellipse cx="59" cy="75" rx="12" ry="14" fill="#fff7e9" />
          <ellipse cx="82" cy="75" rx="12" ry="14" fill="#fff7e9" />
          <ellipse className="eye-pupil" cx="63" cy="77" rx="5.5" ry="7" fill="#211513" />
          <ellipse className="eye-pupil" cx="80" cy="77" rx="5.5" ry="7" fill="#211513" />
          <circle cx="65" cy="74" r="2" fill="white" /><circle cx="82" cy="74" r="2" fill="white" />
          <ellipse cx="49" cy="88" rx="7" ry="4.5" fill="#e98678" opacity=".85" />
          <ellipse cx="91" cy="88" rx="7" ry="4.5" fill="#e98678" opacity=".85" />
          <path d="M65 91 Q72 97 80 91" stroke="#3b1715" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <g className="ant-antennae" stroke="#442019" strokeWidth="5" strokeLinecap="round" fill="none">
            <path d="M61 47 Q49 24 31 29" /><path d="M80 46 Q89 22 109 25" />
          </g>
          <circle cx="31" cy="29" r="5" fill="#442019" /><circle cx="109" cy="25" r="5" fill="#442019" />
        </g>
        <g className="scratch-hand" stroke="#442019" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M91 95 Q76 78 78 62" /></g>
      </svg>
      <span className="ant-whisper">{reacting ? "Oh! Hello there." : "tap to say hello"}</span>
    </button>
  );
}

function DetailCard({ beat }: { beat: Beat }) {
  const s = beat.section;
  if (!s) return null;
  return (
    <article className="story-card" key={s.id}>
      <p className="story-eyebrow">{s.highlight} · {s.kind === "experience" ? "CAREER JOURNEY" : "CHAPTER"}</p>
      <h2>{s.title}</h2>
      {s.subtitle && <p className="story-subtitle">{s.subtitle}{s.meta ? " · " + s.meta : ""}</p>}
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
    { id: "opening", label: "The beginning", kind: "opening" },
    ...sections.map((section) => ({ id: section.id, label: section.highlight, kind: section.kind, section })),
    { id: "sugar", label: "The next goal", kind: "ending" }
  ], []);
  const [active, setActive] = useState(0);
  const [reacting, setReacting] = useState(false);
  const [walking, setWalking] = useState(true);
  const [mode, setMode] = useState<"movie" | "book">("movie");
  const [motionPaused, setMotionPaused] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const current = beats[active];
  const progress = Math.round((active / (beats.length - 1)) * 100);

  useEffect(() => {
    if (!reacting) return;
    setWalking(false);
    const timer = window.setTimeout(() => { setReacting(false); setWalking(true); }, 1900);
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
  const toggleMotion = () => { setWalking(motionPaused); setMotionPaused(!motionPaused); };
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
      <div className={"world world--" + current.kind + " world--" + current.id + (motionPaused ? " world--paused" : "") + (mode === "book" ? " world--book" : " world--movie")} aria-live="polite" onTouchStart={onWorldTouchStart} onTouchEnd={onWorldTouchEnd}>
        <div className="world-sky" /><div className="world-glow" />
        <div className="world-backdrop">
          <div className="monitor-scene prop"><div className="monitor-screen"><span>HELLO, I'M</span><strong>{profile.name}</strong><small>{profile.role}</small></div><div className="monitor-neck" /><div className="monitor-foot" /></div>
          <div className="keyboard-scene prop" aria-label="A physical keyboard, with keys being typed">{Array.from({ length: 28 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 7) * -0.08}s` }} />)}</div>
          <div className="typing-hands" aria-hidden="true"><span className="typing-hand typing-hand--left"><i /><i /><i /><i /></span><span className="typing-hand typing-hand--right"><i /><i /><i /><i /></span></div>
          <div className="notebook-scene prop"><span>ideas</span><i /><i /><i /><i /><i /></div>
          <div className="report-scene prop"><span>TEAM REPORT</span><i /><i /><i /><b>↗</b></div>
          <div className="dashboard-scene prop"><span>OPERATIONS</span><div className="chart-bars"><i /><i /><i /><i /><i /><i /></div><small>SERVICE · PEOPLE · RESULTS</small></div>
          <div className="skill-stones prop"><i>RCA</i><i>COACH</i><i>QUALITY</i><i>GROW</i></div>
          <div className="education-book prop"><span>LEARN</span><b>✦</b></div>
          <div className="sugar-cube prop"><i /><i /><i /><b>✦</b></div>
        </div>
        <div className="world-floor"><span className="floor-line floor-line-a" /><span className="floor-line floor-line-b" /><span className="floor-speck speck-a" /><span className="floor-speck speck-b" /><span className="floor-speck speck-c" /></div>
        <div className="world-track" style={{ transform: "translate3d(-" + (active * 100) + "vw,0,0)" }}>
          {beats.map((beat, index) => <div className={"world-chapter chapter--" + beat.kind} key={beat.id} aria-hidden="true"><span className="chapter-marker">{String(index + 1).padStart(2, "0")}</span><span className="chapter-dust" /></div>)}
        </div>
        <div className={"ant-stage" + (reacting ? " ant-stage--reacting" : "") + (walking && !motionPaused ? " ant-stage--walking" : " ant-stage--still")} style={{ transform: "translateX(calc(-50% + " + (active % 2 ? 10 : -8) + "px))" }}>
          <Ant reacting={reacting} walking={walking} onClick={() => setReacting((v) => !v)} />
        </div>
        <div className="world-caption" aria-hidden="true"><span>CHAPTER {String(active + 1).padStart(2, "0")}</span><i />{current.label}</div>
      </div>
      <section className={"story-content" + (mode === "book" ? " story-content--book" : " story-content--movie")} id="story-start">
        <div className="story-content__copy">
          <div className="story-modebar" aria-label="Story display controls"><div><button type="button" className={mode === "movie" ? "is-selected" : ""} aria-pressed={mode === "movie"} onClick={() => setMode("movie")}>◉ Movie mode</button><button type="button" className={mode === "book" ? "is-selected" : ""} aria-pressed={mode === "book"} onClick={() => setMode("book")}>▤ Book mode</button></div><button type="button" onClick={toggleMotion} aria-pressed={motionPaused}>{motionPaused ? "▶ Resume motion" : "Ⅱ Pause motion"}</button></div>
          {current.kind === "opening" ? (
            <article className="story-card story-card--intro">
              <p className="story-eyebrow">A PORTFOLIO, WITH A LITTLE LIFE</p>
              <h1>{profile.name}<span className="name-period">.</span></h1>
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
