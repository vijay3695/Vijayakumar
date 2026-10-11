import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BottomNav from "./components/BottomNav";
import ProfileScreen, { type Tab } from "./components/ProfileScreen";
import ReelView from "./components/ReelView";
import TopBar from "./components/TopBar";
import { profile, sections, site } from "./data/resume";
import { useFlipReel } from "./hooks/useFlipReel";
import { animatePanelIn } from "./motion";

export default function App() {
  const ids = useMemo(() => sections.map((s) => s.id), []);
  const { activeIndex, activeId, open, close, reduced } = useFlipReel(ids);
  const [tab, setTab] = useState<Tab>("work");
  const profileRef = useRef<HTMLDivElement>(null);

  const competenciesIndex = useMemo(
    () => Math.max(0, sections.findIndex((s) => s.kind === "skills")),
    []
  );

  /* the only content animation on the profile: switching a tab */
  useEffect(() => {
    const panel = profileRef.current?.querySelector<HTMLElement>(".ig-panel") ?? null;
    animatePanelIn(panel, reduced);
  }, [tab, reduced]);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  const goSkills = useCallback(() => {
    setTab("skills");
    const tabs = profileRef.current?.querySelector<HTMLElement>(".ig-tabs");
    if (tabs) {
      window.scrollTo({
        top: tabs.getBoundingClientRect().top + window.scrollY - 8,
        behavior: reduced ? "auto" : "smooth"
      });
    }
  }, [reduced]);

  const navActive =
    activeIndex === null
      ? "home"
      : sections[activeIndex]?.kind === "skills"
        ? "skills"
        : "reels";

  return (
    <div className="app">
      {site.sampleData && (
        <p className="sample-banner" role="note">
          Design preview \u00b7 placeholder content \u00b7 edit <code>app/src/data/resume.ts</code>
        </p>
      )}

      {reduced && (
        <p className="rm-pill" role="note">
          Your system has <strong>reduce motion</strong> enabled, so animations are off.
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
        avatar={profile.avatar}
        active={navActive}
        onHome={scrollTop}
        onSkills={goSkills}
        onReels={() => open(0)}
        onCompetencies={() => open(competenciesIndex)}
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
