/* ============================================================================
   motion.ts - every animation in the app lives here, so the components stay
   readable. All of it is opt-out via prefers-reduced-motion.
   ==========================================================================*/

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

const OUT = "power3.out";
const BACK = "back.out(1.6)";

/** Kill any inline transform left on the tiles, so Flip measures cleanly. */
export function releaseTiles() {
  gsap.set(".ig-tile", { clearProps: "transform,opacity,scale" });
}

/* ------------------------------------------------------- profile entrance --*/

/**
 * The staggered reveal you see on first paint. Runs top-down: chrome, then
 * identity, then the story bubbles, and finally hands the grid over to
 * ScrollTrigger (which is why tiles are deliberately not in this timeline).
 */
export function profileEntrance(root: HTMLElement, reduced: boolean) {
  if (reduced) return () => {};

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: OUT } });

    /**
     * Every step clears its inline styles on completion, so no element can be
     * left frozen mid-tween holding an inline opacity/transform.
     */
    tl.from(".ig-topbar__wordmark", { y: -16, opacity: 0, duration: 0.5, clearProps: "all" })
      .from(
        ".ig-topbar__icons > *",
        { y: -12, opacity: 0, duration: 0.4, stagger: 0.07, clearProps: "all" },
        "<0.05"
      )
      .from(
        ".ig-avatar__initial, .ig-avatar__ring",
        { scale: 0.5, opacity: 0, duration: 0.75, ease: BACK, stagger: 0.06, clearProps: "all" },
        "-=0.3"
      )
      .from(".ig-stats li", { y: 18, opacity: 0, duration: 0.5, stagger: 0.08, clearProps: "all" }, "-=0.5")
      .from(".ig-bio > *", { y: 15, opacity: 0, duration: 0.5, stagger: 0.055, clearProps: "all" }, "-=0.42")
      .from(".ig-actions .ig-btn", { y: 13, opacity: 0, duration: 0.45, stagger: 0.06, clearProps: "all" }, "-=0.38")
      .from(
        ".ig-highlight",
        { y: 20, opacity: 0, scale: 0.8, duration: 0.55, stagger: 0.05, ease: BACK, clearProps: "all" },
        "-=0.34"
      )
      .from(".ig-tab", { opacity: 0, y: 8, duration: 0.3, stagger: 0.05, clearProps: "all" }, "-=0.42")
      .from(
        ".ig-bottomnav__item",
        { y: 34, opacity: 0, duration: 0.5, stagger: 0.05, clearProps: "all" },
        "-=0.42"
      );
  }, root);

  return () => ctx.revert();
}

/* ------------------------------------------------------------- tile reveal --*/

/** Grid tiles pop in as they scroll into view, Instagram-timeline style. */
export function tileReveal(
  root: HTMLElement,
  reduced: boolean,
  /** on desktop the device frame scrolls internally, so ScrollTrigger needs it */
  scroller?: HTMLElement | null
) {
  if (reduced) return () => {};

  const tiles = Array.from(root.querySelectorAll<HTMLElement>(".ig-tile"));
  if (!tiles.length) return () => {};

  // Hidden by JS only - if the bundle never runs, the tiles stay visible.
  gsap.set(tiles, { opacity: 0, scale: 0.9, transformOrigin: "50% 50%" });

  const triggers = ScrollTrigger.batch(tiles, {
    start: "top 96%",
    batchMax: 3,
    interval: 0.08,
    once: true,
    scroller: scroller ?? undefined,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.07,
        ease: BACK,
        overwrite: true,
        onComplete: () => gsap.set(batch, { clearProps: "transform,opacity" })
      })
  });

  return () => {
    triggers.forEach((t) => t.kill());
    gsap.set(tiles, { clearProps: "transform,opacity" });
  };
}

/* -------------------------------------------------------- tab panel swap --*/

export function animatePanelIn(panel: HTMLElement | null, reduced: boolean) {
  if (!panel || reduced) return;
  const items = panel.querySelectorAll(".ig-chip, .ig-proof__item");
  if (!items.length) return;
  gsap.fromTo(
    items,
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.45, stagger: 0.035, ease: OUT, clearProps: "transform,opacity" }
  );
}

/* ------------------------------------------------------------ reel content --*/

/** Staggered entrance for whichever reel just became active. */
export function animateReelIn(reelEl: HTMLElement | null, reduced: boolean) {
  if (!reelEl || reduced) return () => {};

  const q = gsap.utils.selector(reelEl);
  const tl = gsap.timeline({ defaults: { ease: OUT } });

  /** Only queue a tween when the reel actually has those elements. */
  const step = (sel: string, vars: gsap.TweenVars, position?: gsap.Position) => {
    const list = Array.from(q(sel)) as Element[];
    if (list.length) tl.from(list, vars, position);
  };

  step(".reel__eyebrow", { y: 16, opacity: 0, duration: 0.4 });
  step(".reel__title", { y: 34, opacity: 0, duration: 0.6 }, "-=0.28");
  step(".reel__subtitle", { y: 14, opacity: 0, duration: 0.42 }, "-=0.4");
  step(".reel__meta", { y: 14, opacity: 0, duration: 0.42 }, "-=0.38");
  step(".reel__text", { y: 13, opacity: 0, duration: 0.4, stagger: 0.06 }, "-=0.34");
  step(".reel__bullets li", { x: -16, opacity: 0, duration: 0.4, stagger: 0.055 }, "-=0.3");
  step(
    ".reel__metric",
    { y: 18, scale: 0.93, opacity: 0, duration: 0.45, stagger: 0.07, ease: BACK },
    "-=0.3"
  );
  step(
    ".reel__chip",
    { scale: 0.78, opacity: 0, duration: 0.35, stagger: 0.022, ease: BACK },
    "-=0.32"
  );
  step(".reel__proof li", { y: 16, opacity: 0, duration: 0.4, stagger: 0.06 }, "-=0.3");
  step(".reel__rail-btn", { x: 20, opacity: 0, duration: 0.4, stagger: 0.05 }, "-=0.55");

  tl.add(() => {
    Array.from(q(".reel__rail-btn")).forEach((n) =>
      gsap.set(n, { clearProps: "transform,opacity" })
    );
  });

  return () => tl.kill();
}

/* --------------------------------------------------------------- count-up --*/

/**
 * Counts a metric up from zero, preserving any prefix/suffix, so "-69%",
 * "99.98%" and "<5s" all animate correctly and land on the exact original text.
 */
export function countUp(el: HTMLElement, reduced: boolean) {
  if (reduced) return;
  const raw = el.textContent ?? "";
  const m = raw.match(/-?\d+(?:\.\d+)?/);
  if (!m || m.index === undefined) return;

  const target = parseFloat(m[0]);
  const decimals = (m[0].split(".")[1] ?? "").length;
  const pre = raw.slice(0, m.index);
  const post = raw.slice(m.index + m[0].length);
  const box = { v: 0 };

  gsap.to(box, {
    v: target,
    duration: 0.95,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = pre + box.v.toFixed(decimals) + post;
    },
    onComplete: () => {
      el.textContent = raw;
    }
  });
}

/* ------------------------------------------------------- reel backdrop FX --*/

/** Cheap parallax: shifts the backdrop as you scroll through a reel. */
export function setBackdropParallax(el: HTMLElement | null, progress: number, reduced: boolean) {
  if (!el || reduced) return;
  el.style.transform = `translate3d(0, ${(progress - 0.5) * 7}%, 0) scale(1.06)`;
}

/* ----------------------------------------------------------- double-tap like */

export function heartBurst(el: HTMLElement | null, reduced: boolean) {
  if (!el || reduced) return;
  gsap.killTweensOf(el);
  gsap.fromTo(
    el,
    { opacity: 1, scale: 0.3, rotate: -12 },
    {
      opacity: 1,
      scale: 1.12,
      rotate: 0,
      duration: 0.3,
      ease: BACK,
      onComplete: () =>
        gsap.to(el, { opacity: 0, scale: 1.4, duration: 0.4, delay: 0.22, ease: "power2.in" })
    }
  );
}

/** Small squash used when the like button itself is tapped. */
export function popIcon(el: HTMLElement | null, reduced: boolean) {
  if (!el || reduced) return;
  gsap.fromTo(el, { scale: 0.7 }, { scale: 1, duration: 0.42, ease: BACK, clearProps: "scale" });
}

/* --------------------------------------------------------------- swipe hint */

export function dismissHint(el: HTMLElement | null, reduced: boolean) {
  if (!el) return;
  if (reduced) {
    el.style.display = "none";
    return;
  }
  gsap.to(el, {
    opacity: 0,
    y: 10,
    duration: 0.3,
    onComplete: () => {
      el.style.display = "none";
    }
  });
}

export { gsap, ScrollTrigger, Flip };
