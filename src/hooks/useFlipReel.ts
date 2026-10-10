import { useCallback, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useReducedMotion } from "./useReducedMotion";

gsap.registerPlugin(Flip);

const DURATION = 0.62;

/**
 * Owns the profile-grid -> full-screen-reel transition.
 *
 * The trick (straight from the GSAP Flip docs): the grid tile and the reel
 * panel share the SAME data-flip-id. Flip sees two elements with one id, works
 * out which one is disappearing (the tile, set to display:none while open) and
 * swaps them. That is why we do not pass an explicit `targets` override.
 *
 * Everything degrades safely: if Flip is unavailable, or the user prefers
 * reduced motion, or anything throws, the reel simply appears and works.
 */
export function useFlipReel(ids: string[]) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const fromState = useRef<Flip.FlipState | null>(null);
  const activeId = useRef<string | null>(null);
  const reduced = useReducedMotion();

  const open = useCallback(
    (index: number) => {
      const id = ids[index];
      if (!id) return;
      activeId.current = id;
      const tile = document.querySelector(`[data-flip-id="tile-${id}"]`);
      fromState.current = tile ? Flip.getState(tile) : null;
      setActiveIndex(index);
    },
    [ids]
  );

  const close = useCallback(() => {
    const id = activeId.current;
    const panel = id
      ? document.querySelector(`[data-flip-id="tile-${id}"]`)
      : null;
    // capture where the reel is right now, so the tile can grow back from it
    fromState.current = panel ? Flip.getState(panel) : null;
    setActiveIndex(null);
  }, []);

  // Runs after React has painted the new state, so both elements exist.
  useLayoutEffect(() => {
    const state = fromState.current;
    fromState.current = null;          // consume once (also guards StrictMode)
    if (!state || reduced) return;

    const id = activeId.current;
    if (!id) return;
    if (!document.querySelector(`[data-flip-id="tile-${id}"]`)) return;

    let tween: gsap.core.Timeline | null = null;
    try {
      tween = Flip.from(state, {
        duration: DURATION,
        ease: "power3.inOut",
        absolute: true,
        fade: true,
        zIndex: 60
      });
    } catch (err) {
      console.warn("Flip transition skipped:", err);
    }
    return () => {
      tween?.kill();
    };
  }, [activeIndex, reduced]);

  return {
    activeIndex,
    /** reactive id, for hiding the source tile while a reel is open */
    activeId: activeIndex === null ? null : ids[activeIndex] ?? null,
    open,
    close,
    reduced
  };
}
