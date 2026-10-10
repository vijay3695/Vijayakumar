import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Profile, Section } from "../data/resume";
import {
  animateReelIn,
  countUp,
  dismissHint,
  heartBurst,
  popIcon,
  setBackdropParallax
} from "../motion";
import {
  BookmarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  CommentIcon,
  HeartIcon,
  ShareIcon
} from "./Icons";
import { motifFor } from "./ProfileScreen";

type Props = {
  sections: Section[];
  startIndex: number;
  profile: Profile;
  reduced: boolean;
  onClose: () => void;
};

/** Deterministic, honest engagement numbers: derived from the content, not faked. */
const weightOf = (s: Section) => (s.proof?.length ?? 0) * 37 + (s.metrics?.length ?? 0) * 19 + 24;

export default function ReelView({ sections, startIndex, profile, reduced, onClose }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const hintGone = useRef(false);
  const lastTap = useRef(0);

  const [pos, setPos] = useState({ index: startIndex, intra: 0 });
  const indexRef = useRef(startIndex);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState(true);

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

  /* land on the requested reel before first paint */
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const child = el.children[startIndex] as HTMLElement | undefined;
    if (child) el.scrollTop = child.offsetTop;
  }, [startIndex]);

  /* track active reel + intra progress, and drive the backdrop parallax */
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let raf = 0;

    const measure = () => {
      raf = 0;
      const top = el.scrollTop;
      const first = el.children[0] as HTMLElement | undefined;
      // Before layout every child measures 0, which would make the midpoint
      // test pick the LAST reel. Bail out and keep the current index.
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

      if (cur) setBackdropParallax(cur.querySelector<HTMLElement>(".reel__bg"), intra, reduced);

      setPos((p) =>
        p.index === idx && Math.abs(p.intra - intra) < 0.01 ? p : { index: idx, intra }
      );

      // first real scroll retires the swipe hint
      if (!hintGone.current && top > 12) {
        hintGone.current = true;
        setShowHint(false);
        dismissHint(hintRef.current, reduced);
      }
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
  }, [sections.length, reduced]);

  /* animate whichever reel just became active */
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const reel = el.children[pos.index] as HTMLElement | undefined;
    if (!reel) return;
    const stop = animateReelIn(reel, reduced);
    reel
      .querySelectorAll<HTMLElement>(".reel__metric-value")
      .forEach((v) => countUp(v, reduced));
    return stop;
  }, [pos.index, reduced]);

  /* lock the page behind the reel, restore the scroll position on close */
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

  /* keyboard control + focus handling */
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panel.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown" || e.key === "PageDown") {
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

  /* the hint should never outstay its welcome */
  useEffect(() => {
    if (!showHint) return;
    const t = window.setTimeout(() => {
      hintGone.current = true;
      setShowHint(false);
      dismissHint(hintRef.current, reduced);
    }, 4000);
    return () => window.clearTimeout(t);
  }, [showHint, reduced]);

  const toggleLike = (id: string, reel: HTMLElement | null, viaDoubleTap = false) => {
    setLiked((prev) => {
      const next = !prev[id];
      if (next && viaDoubleTap && reel) {
        heartBurst(reel.querySelector<HTMLElement>(".reel__burst"), reduced);
      }
      return { ...prev, [id]: next };
    });
  };

  const onReelClick = (e: React.MouseEvent<HTMLElement>, id: string) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      lastTap.current = 0;
      const reel = e.currentTarget as HTMLElement;
      setLiked((prev) => {
        if (!prev[id]) heartBurst(reel.querySelector<HTMLElement>(".reel__burst"), reduced);
        return { ...prev, [id]: true };
      });
      return;
    }
    lastTap.current = now;
  };

  return (
    <div className="reel-root" role="dialog" aria-modal="true" aria-label={origin.title}>
      <div className="reel-panel" ref={panel} tabIndex={-1} data-flip-id={"tile-" + origin.id}>
        <div className="reel-progress" aria-hidden="true">
          {sections.map((s, i) => (
            <span className="reel-progress__seg" key={s.id}>
              <span
                className="reel-progress__fill"
                style={{
                  width: (i < pos.index ? 100 : i > pos.index ? 0 : pos.intra * 100) + "%",
                  transition: reduced ? "none" : "width 120ms linear"
                }}
              />
            </span>
          ))}
        </div>

        <span className="reel__counter" aria-hidden="true">
          {pos.index + 1} / {sections.length}
        </span>

        <button className="reel-close" type="button" onClick={onClose} aria-label="Close reels">
          <CloseIcon />
        </button>

        <div className="reel-nav">
          <button
            type="button"
            className="reel-nav__btn"
            onClick={() => goTo(pos.index - 1)}
            disabled={pos.index === 0}
            aria-label="Previous reel"
          >
            <ChevronUpIcon />
          </button>
          <button
            type="button"
            className="reel-nav__btn"
            onClick={() => goTo(pos.index + 1)}
            disabled={pos.index === sections.length - 1}
            aria-label="Next reel"
          >
            <ChevronDownIcon />
          </button>
        </div>

        <div className="reel-scroller" ref={scroller}>
          {sections.map((s, i) => {
            const isLiked = !!liked[s.id];
            const isSaved = !!saved[s.id];
            const likes = weightOf(s) + (isLiked ? 1 : 0);
            return (
              <article
                className="reel"
                key={s.id}
                data-motif={motifFor(i)}
                style={{ ["--art" as string]: s.art }}
                onClick={(e) => onReelClick(e, s.id)}
              >
                <span className="reel__bg" />
                <span className="reel__veil" />

                <span className="reel__burst" aria-hidden="true">
                  <HeartIcon size={104} filled />
                </span>

                <div className="reel__rail">
                  <button
                    type="button"
                    className={"reel__rail-btn" + (isLiked ? " is-liked" : "")}
                    onClick={(e) => {
                      e.stopPropagation();
                      popIcon(e.currentTarget, reduced);
                      toggleLike(s.id, null);
                    }}
                    aria-pressed={isLiked}
                    aria-label={isLiked ? "Unlike" : "Like"}
                  >
                    <HeartIcon size={26} filled={isLiked} />
                    {likes}
                  </button>

                  <button type="button" className="reel__rail-btn" aria-label="Comments" onClick={(e) => e.stopPropagation()}>
                    <CommentIcon size={26} />
                    {Math.round(likes / 9)}
                  </button>

                  <button type="button" className="reel__rail-btn" aria-label="Share" onClick={(e) => e.stopPropagation()}>
                    <ShareIcon size={26} />
                    Share
                  </button>

                  <button
                    type="button"
                    className="reel__rail-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      popIcon(e.currentTarget, reduced);
                      setSaved((p) => ({ ...p, [s.id]: !p[s.id] }));
                    }}
                    aria-pressed={isSaved}
                    aria-label={isSaved ? "Remove bookmark" : "Bookmark"}
                  >
                    <BookmarkIcon size={26} filled={isSaved} />
                  </button>
                </div>

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
                      {s.proof.map((p, k) => (
                        <li key={p.claim + k}>
                          <p className="reel__proof-claim">{p.claim}</p>
                          <p className="reel__proof-artefact">{p.artefact}</p>
                          {p.href && (
                            <a
                              className="reel__proof-link"
                              href={p.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
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
            );
          })}
        </div>

        {showHint && (
          <div className="reel__hint" ref={hintRef} aria-hidden="true">
            <ChevronUpIcon size={16} />
            Swipe for the next section
          </div>
        )}
      </div>
    </div>
  );
}
