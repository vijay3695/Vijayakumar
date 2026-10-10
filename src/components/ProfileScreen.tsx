import { forwardRef } from "react";
import type { Profile, Section } from "../data/resume";
import { ProofIcon, ReelsIcon, VerifiedIcon } from "./Icons";

export type Tab = "work" | "skills" | "proof";

type Props = {
  profile: Profile;
  sections: Section[];
  tab: Tab;
  onTab: (t: Tab) => void;
  /** while a reel is open, its source tile is removed so Flip can swap them */
  activeId: string | null;
  onOpen: (index: number) => void;
};

const TABS: { id: Tab; label: string }[] = [
  { id: "work", label: "work" },
  { id: "skills", label: "skills" },
  { id: "proof", label: "proof" }
];

/** Each tile gets its own procedural "photo" motif, derived from its index. */
export const motifFor = (i: number) => i % 4;

const ProfileScreen = forwardRef<HTMLDivElement, Props>(function ProfileScreen(
  { profile, sections, tab, onTab, activeId, onOpen },
  ref
) {
  const allChips = Array.from(new Set(sections.flatMap((s) => s.chips ?? [])));
  const proofItems = sections.flatMap((s) => s.proof ?? []);

  return (
    <div className="profile" ref={ref}>
      <section className="ig-head">
        <div className="ig-avatar">
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
        <h1 className="ig-bio__name">
          {profile.name} <VerifiedIcon />
        </h1>
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
        <a className="ig-btn ig-btn--ghost" href="https://github.com/vijay3695" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </section>

      <nav className="ig-highlights" aria-label="Jump to a section">
        {sections.map((s, i) => (
          <button
            type="button"
            className="ig-highlight"
            key={s.id}
            onClick={() => onOpen(i)}
            aria-label={"Open " + s.highlight + " reel"}
          >
            <span
              className="ig-highlight__bubble"
              data-motif={motifFor(i)}
              style={{ backgroundImage: s.art }}
            >
              <span className="ig-highlight__glyph">{s.glyph}</span>
            </span>
            <span className="ig-highlight__label">{s.highlight}</span>
          </button>
        ))}
      </nav>

      <nav className="ig-tabs" aria-label="Profile sections">
        {TABS.map((t) => (
          <button
            type="button"
            key={t.id}
            className={"ig-tab" + (tab === t.id ? " is-active" : "")}
            aria-selected={tab === t.id}
            onClick={() => onTab(t.id)}
          >
            <span className="ig-tab__bar" />
            {t.id === "work" && <ProofIcon size={22} />}
            {t.id === "skills" && <ReelsIcon size={22} />}
            {t.id === "proof" && <ProofIcon size={22} />}
            <span className="sr-only">{t.label}</span>
          </button>
        ))}
      </nav>

      <div key={tab} className="ig-panel">
        {tab === "work" && (
          <div className="ig-grid">
            {sections.map((s, i) => {
              const stat = s.metrics?.[0];
              return (
                <button
                  type="button"
                  className="ig-tile"
                  key={s.id}
                  data-motif={motifFor(i)}
                  style={{
                    display: activeId === s.id ? "none" : undefined,
                    ["--art" as string]: s.art
                  }}
                  data-flip-id={"tile-" + s.id}
                  onClick={() => onOpen(i)}
                  aria-label={"Open " + s.title}
                >
                  <span className="ig-tile__art" />
                  <span className="ig-tile__glyph">{s.glyph}</span>
                  <span className="ig-tile__caption">{s.highlight}</span>
                  <span className="ig-tile__overlay">
                    {stat ? (
                      <span className="ig-tile__stat">
                        {stat.value} {stat.label}
                      </span>
                    ) : (
                      <span className="ig-tile__stat">View reel</span>
                    )}
                  </span>
                </button>
              );
            })}
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
      </div>

      <footer className="ig-foot">
        {profile.name} \u00b7 React, GSAP Flip and CSS scroll-snap \u00b7 no UI framework
      </footer>
    </div>
  );
});

export default ProfileScreen;
