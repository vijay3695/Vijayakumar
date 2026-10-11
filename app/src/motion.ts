/* ============================================================================
   motion.ts - the animations, in one place.

   Deliberately NO page-load animation. Instagram appears instantly; a staggered
   entrance makes a portfolio feel slow and cheap. Movement only happens in
   response to something the user does: opening a reel, tapping a like, switching
   a tab. All of it defers to prefers-reduced-motion.
   ==========================================================================*/

import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

const OUT = "power3.out";
const BACK = "back.out(1.6)";

/** Clear any inline transform left on the tiles, so Flip measures cleanly. */
export function releaseTiles() {
  gsap.set(".ig-tile", { clearProps: "transform,opacity,scale" });
}

/* -------------------------------------------------------- tab panel swap --*/

export function animatePanelIn(panel: HTMLElement | null, reduced: boolean) {
  if (!panel || reduced) return;
  const items = panel.querySelectorAll(".ig-chip, .ig-summary p");
  if (!items.length) return;
  gsap.fromTo(
    items,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.34, stagger: 0.03, ease: OUT, clearProps: "transform,opacity" }
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

  step(".reel__identity-name, .reel__title", { y: 26, opacity: 0, duration: 0.5 });
  step(".reel__identity-role, .reel__identity-loc, .reel__subtitle, .reel__meta", {
    y: 12, opacity: 0, duration: 0.36, stagger: 0.045
  }, "-=0.34");
  step(".reel__identity-links > *", { y: 18, opacity: 0, scale: 0.9, duration: 0.42, stagger: 0.07, ease: BACK }, "-=0.28");
  step(".reel__text", { y: 11, opacity: 0, duration: 0.34, stagger: 0.05 }, "-=0.32");
  step(".reel__bullets li", { x: -14, opacity: 0, duration: 0.34, stagger: 0.045 }, "-=0.3");
  step(".reel__metric", { y: 15, scale: 0.94, opacity: 0, duration: 0.38, stagger: 0.06, ease: BACK }, "-=0.3");
  step(".reel__chip", { scale: 0.82, opacity: 0, duration: 0.3, stagger: 0.018, ease: BACK }, "-=0.3");
  step(".reel__list li", { y: 13, opacity: 0, duration: 0.34, stagger: 0.05 }, "-=0.3");
  step(".reel__rail-btn", { x: 16, opacity: 0, duration: 0.34, stagger: 0.045 }, "-=0.5");

  tl.add(() => {
    Array.from(q(".reel__rail-btn, .reel__identity-links > *")).forEach((n) =>
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
    duration: 0.8,
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
  el.style.transform = `translate3d(0, ${(progress - 0.5) * 6}%, 0) scale(1.05)`;
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
  gsap.fromTo(el, { scale: 0.7 }, { scale: 1, duration: 0.4, ease: BACK, clearProps: "scale" });
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
    y: 8,
    duration: 0.28,
    onComplete: () => {
      el.style.display = "none";
    }
  });
}

export { gsap, Flip };
