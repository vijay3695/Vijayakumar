import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Profile, Section } from "../data/resume";

type Props = {
  sections: Section[];
  startIndex: number;
  profile: Profile;
  reduced: boolean;
  onClose: () => void;
};

export default function ReelView({
  sections,
  startIndex,
  profile,
  reduced,
  onClose
}: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ index: startIndex, intra: 0 });
  const indexRef = useRef(startIndex);

  /** the section the reel was opened from - it owns the shared flip id */
  const origin = sections[startIndex];

  const goTo = useCallback(
    (i: number) => {
      const el = scroller.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(sections.length - 1, i));
      const child = el.children[clamped] as HTMLElement | undefined;
      if (!child) return;
      el.scrollTo({ top: child.offsetTop, behavior: reduced ? "auto" : "smooth" });
    },
    [sections.length, reduced]
  );

  // land on the requested reel before first paint
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const child = el.children[startIndex] as HTMLElement | undefined;
    if (child) el.scrollTop = child.offsetTop;
  }, [startIndex]);

  // track the active reel and how far through it we are (drives the progress bars)
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const top = el.scrollTop;
      const first = el.children[0] as HTMLElement | undefined;
      // Before layout has run every child measures 0, which would make the
      // midpoint test pick the LAST reel. Bail out and keep the current index.
      if (!first || first.offsetHeight === 0) return;
      let idx = 0;
      for (let i = 0; i < el.children.length; i++) {
        const c = el.children[i] as HTMLElement;
        if (c.offsetTop <= top + c.offsetHeight / 2) idx = i;
      }
      indexRef.current = idx;
      const cur = el.children[idx] as HTMLElement | undefined;
      const intra = cur
        ? Math.min(1, Math.max(0, (top - cur.offsetTop) / cur.offsetHeight))
        : 0;
      setPos((p) =>
        p.index === idx && Math.abs(p.intra - intra) < 0.01 ? p : { index: idx, intra }
      );
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    measure();
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sections.length]);

  // lock the page behind the reel, and put the scroll position back on close
  useEffect(() => {
    const body = document.body;
    const y = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow
    };
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, y);
    };
  }, []);

  // keyboard control, plus focus handling
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panel.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goTo(indexRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(indexRef.current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(sections.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [goTo, onClose, sections.length]);

  return (
    <div className="reel-root" role="dialog" aria-modal="true" aria-label={origin.title}>
      <div
        className="reel-panel"
        ref={panel}
        tabIndex={-1}
        data-flip-id={"tile-" + origin.id}
      >
        <div className="reel-progress" aria-hidden="true">
          {sections.map((s, i) => (
            <span className="reel-progress__seg" key={s.id}>
              <span
                className="reel-progress__fill"
                style={{
                  width:
                    (i < pos.index ? 100 : i > pos.index ? 0 : pos.intra * 100) + "%"
                }}
              />
            </span>
          ))}
        </div>

        <button className="reel-close" type="button" onClick={onClose} aria-label="Close reels">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="reel-nav" aria-hidden="false">
          <button
            type="button"
            className="reel-nav__btn"
            onClick={() => goTo(pos.index - 1)}
            disabled={pos.index === 0}
            aria-label="Previous reel"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
          <button
            type="button"
            className="reel-nav__btn"
            onClick={() => goTo(pos.index + 1)}
            disabled={pos.index === sections.length - 1}
            aria-label="Next reel"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        <div className="reel-scroller" ref={scroller}>
          {sections.map((s) => (
            <article className="reel" key={s.id} style={{ backgroundImage: s.art }}>
              <div className="reel__veil" aria-hidden="true" />
              <div className="reel__body">
                <p className="reel__eyebrow">{s.eyebrow}</p>
                <h2 className="reel__title">{s.title}</h2>
                {s.subtitle && <p className="reel__subtitle">{s.subtitle}</p>}
                {s.meta && <p className="reel__meta">{s.meta}</p>}

                {s.body.map((line) => (
                  <p className="reel__text" key={line}>
                    {line}
                  </p>
                ))}

                {s.bullets && (
                  <ul className="reel__bullets">
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}

                {s.metrics && (
                  <div className="reel__metrics">
                    {s.metrics.map((m) => (
                      <div className="reel__metric" key={m.label}>
                        <span className="reel__metric-value">{m.value}</span>
                        <span className="reel__metric-label">{m.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {s.chips && (
                  <div className="reel__chips">
                    {s.chips.map((c) => (
                      <span className="reel__chip" key={c}>
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {s.proof && (
                  <ul className="reel__proof">
                    {s.proof.map((p, i) => (
                      <li key={p.claim + i}>
                        <p className="reel__proof-claim">{p.claim}</p>
                        <p className="reel__proof-artefact">{p.artefact}</p>
                        {p.href && (
                          <a
                            className="reel__proof-link"
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

                {s.kind === "contact" && (
                  <div className="reel__cta">
                    <a className="ig-btn ig-btn--primary" href={"mailto:" + profile.email}>
                      {profile.email}
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
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
