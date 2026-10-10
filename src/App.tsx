import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BottomNav from "./components/BottomNav";
import ProfileScreen, { type Tab } from "./components/ProfileScreen";
import ReelView from "./components/ReelView";
import TopBar from "./components/TopBar";
import { profile, sections, site } from "./data/resume";
import { useFlipReel } from "./hooks/useFlipReel";
import { animatePanelIn, profileEntrance, tileReveal } from "./motion";

export default function App() {
  const ids = useMemo(() => sections.map((s) => s.id), []);
  const { activeIndex, activeId, open, close, reduced } = useFlipReel(ids);
  const [tab, setTab] = useState<Tab>("work");
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 760px)").matches
  );
  const appRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const proofIndex = useMemo(
    () => Math.max(0, sections.findIndex((s) => s.kind === "proof")),
    []
  );

  /* the desktop frame is a real device that scrolls internally */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 760px)");
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* staggered first paint, then hand the grid to ScrollTrigger */
  useEffect(() => {
    const root = appRef.current;
    if (!root) return;
    const scroller = isDesktop ? root : null;
    const stopEntrance = profileEntrance(root, reduced);
    const stopTiles = tileReveal(root, reduced, scroller);
    return () => {
      stopEntrance();
      stopTiles();
    };
  }, [reduced, isDesktop]);

  /* animate whichever tab panel just mounted */
  useEffect(() => {
    const panel = profileRef.current?.querySelector<HTMLElement>(".ig-panel") ?? null;
    animatePanelIn(panel, reduced);
  }, [tab, reduced]);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  const goSkills = useCallback(() => {
    setTab("skills");
    const panel = profileRef.current?.querySelector<HTMLElement>(".ig-tabs");
    if (panel) {
      const top = panel.getBoundingClientRect().top + window.scrollY - 8;
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    }
  }, [reduced]);

  const navActive =
    activeIndex === null ? "home" : sections[activeIndex]?.kind === "proof" ? "proof" : "reels";

  return (
    <div className="app" ref={appRef}>
      {site.sampleData && (
        <p className="sample-banner" role="note">
          Design preview · placeholder content · edit <code>src/data/resume.ts</code>
        </p>
      )}

      {reduced && (
        <p className="rm-pill" role="note">
          Your system has <strong>reduce motion</strong> enabled, so the animations
          are switched off. Turn it off to see the full experience.
        </p>
      )}

      <TopBar handle={profile.handle} onPrimary={() => open(0)} />

      <ProfileScreen
        ref={profileRef}
        profile={profile}
        sections={sections}
        tab={tab}
        onTab={setTab}
        activeId={activeId}
        onOpen={open}
      />

      <BottomNav
        initial={profile.name.trim().charAt(0).toUpperCase()}
        active={navActive}
        onHome={scrollTop}
        onSkills={goSkills}
        onReels={() => open(0)}
        onProof={() => open(proofIndex)}
      />

      {activeIndex !== null && (
        <ReelView
          sections={sections}
          startIndex={activeIndex}
          profile={profile}
          reduced={reduced}
          onClose={close}
        />
      )}
    </div>
  );
}
