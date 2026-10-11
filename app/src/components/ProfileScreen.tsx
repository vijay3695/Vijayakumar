import { forwardRef } from "react";
import type { Profile, Section } from "../data/resume";
import { DocIcon, GridIcon, TagIcon, VerifiedIcon } from "./Icons";

export type Tab = "work" | "skills" | "summary";

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
  { id: "summary", label: "summary" }
];

/** Each tile gets its own procedural "photo" motif, derived from its index. */
export const motifFor = (i: number) => i % 4;

const ProfileScreen = forwardRef<HTMLDivElement, Props>(function ProfileScreen(
  { profile, sections, tab, onTab, activeId, onOpen },
  ref
) {
  const allChips = Array.from(new Set(sections.flatMap((s) => s.chips ?? [])));
  const summarySection = sections.find((s) => s.kind === "summary");

  return (
    <div className="profile" ref={ref}>
      <section className="ig-head">
        <div className="ig-avatar">
          <span className="ig-avatar__ring" />
          {profile.avatar ? (
            <img
              className="ig-avatar__photo"
              src={profile.avatar}
              alt={profile.name}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <span className="ig-avatar__initial">
              {profile.name.trim().charAt(0).toUpperCase()}
            </span>
          )}
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
        {profile.links.map((l, i) => (
          <a
            key={l.label}
            className={"ig-btn" + (i === 0 ? " ig-btn--primary" : " ig-btn--ghost")}
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
            {t.id === "work" && <GridIcon size={22} />}
            {t.id === "skills" && <TagIcon size={22} />}
            {t.id === "summary" && <DocIcon size={22} />}
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

        {tab === "summary" && (
          <div className="ig-summary">
            {(summarySection?.body ?? []).map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        )}
      </div>

      <footer className="ig-foot">{profile.name}</footer>
    </div>
  );
});

export default ProfileScreen;
