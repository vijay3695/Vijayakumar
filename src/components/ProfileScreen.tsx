import { useState } from "react";
import type { Profile, Section } from "../data/resume";

type Tab = "work" | "skills" | "proof";

type Props = {
  profile: Profile;
  sections: Section[];
  /** when a reel is open, its source tile is removed so Flip can swap them */
  activeId: string | null;
  onOpen: (index: number) => void;
};

export default function ProfileScreen({ profile, sections, activeId, onOpen }: Props) {
  const [tab, setTab] = useState<Tab>("work");

  const allChips = Array.from(
    new Set(sections.flatMap((s) => s.chips ?? []))
  );
  const proofItems = sections.flatMap((s) =>
    (s.proof ?? []).map((p) => ({ ...p, from: s.title }))
  );

  return (
    <div className="profile">
      <header className="ig-topbar">
        <span className="ig-topbar__handle">{profile.handle}</span>
        <span className="ig-topbar__icons" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </span>
      </header>

      <section className="ig-head">
        <div className="ig-avatar" aria-hidden="true">
          <span className="ig-avatar__ring" />
          <span className="ig-avatar__initial">
            {profile.name.trim().charAt(0).toUpperCase()}
          </span>
        </div>

        <ul className="ig-stats">
          {profile.stats.map((s) => (
            <li key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="ig-bio">
        <h1 className="ig-bio__name">{profile.name}</h1>
        <p className="ig-bio__role">
          {profile.role}
          {profile.location ? " \u00b7 " + profile.location : ""}
        </p>
        {profile.bio.map((line) => (
          <p className="ig-bio__line" key={line}>
            {line}
          </p>
        ))}
        <p className="ig-bio__status">
          <span className="ig-dot" />
          {profile.available}
        </p>
      </section>

      <section className="ig-actions">
        <a className="ig-btn ig-btn--primary" href={"mailto:" + profile.email}>
          Email
        </a>
        <a className="ig-btn" href="./resume.pdf" download>
          Resume
        </a>
        {profile.links.map((l) => (
          <a
            className="ig-btn ig-btn--ghost"
            key={l.label}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {l.label}
          </a>
        ))}
      </section>

      <nav className="ig-highlights" aria-label="Jump to a section">
        {sections.map((s, i) => (
          <button
            type="button"
            className="ig-highlight"
            key={s.id}
            onClick={() => onOpen(i)}
          >
            <span className="ig-highlight__bubble" style={{ backgroundImage: s.art }}>
              <span className="ig-highlight__glyph">{s.glyph}</span>
            </span>
            <span className="ig-highlight__label">{s.highlight}</span>
          </button>
        ))}
      </nav>

      <nav className="ig-tabs" aria-label="Profile sections">
        {(["work", "skills", "proof"] as Tab[]).map((t) => (
          <button
            type="button"
            key={t}
            className={"ig-tab" + (tab === t ? " is-active" : "")}
            aria-selected={tab === t}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === "work" && (
        <div className="ig-grid">
          {sections.map((s, i) => (
            <button
              type="button"
              className="ig-tile"
              key={s.id}
              style={{
                backgroundImage: s.art,
                display: activeId === s.id ? "none" : undefined
              }}
              data-flip-id={"tile-" + s.id}
              onClick={() => onOpen(i)}
              aria-label={"Open " + s.title}
            >
              <span className="ig-tile__glyph">{s.glyph}</span>
              <span className="ig-tile__caption">{s.highlight}</span>
            </button>
          ))}
        </div>
      )}

      {tab === "skills" && (
        <div className="ig-chips">
          {allChips.map((c) => (
            <span className="ig-chip" key={c}>
              {c}
            </span>
          ))}
        </div>
      )}

      {tab === "proof" && (
        <ul className="ig-proof">
          {proofItems.map((p, i) => (
            <li className="ig-proof__item" key={p.claim + i}>
              <p className="ig-proof__claim">{p.claim}</p>
              <p className="ig-proof__artefact">{p.artefact}</p>
              {p.href && (
                <a
                  className="ig-proof__link"
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open artefact
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

      <footer className="ig-foot">
        {profile.name} \u00b7 built by hand with React, GSAP and CSS scroll-snap
      </footer>
    </div>
  );
}
