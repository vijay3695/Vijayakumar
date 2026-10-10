import { useMemo } from "react";
import ProfileScreen from "./components/ProfileScreen";
import ReelView from "./components/ReelView";
import { profile, sections, site } from "./data/resume";
import { useFlipReel } from "./hooks/useFlipReel";

export default function App() {
  const ids = useMemo(() => sections.map((s) => s.id), []);
  const { activeIndex, activeId, open, close, reduced } = useFlipReel(ids);

  return (
    <div className="app">
      {site.sampleData && (
        <p className="sample-banner" role="note">
          Sample content - edit <code>src/data/resume.ts</code>, then set{" "}
          <code>site.sampleData = false</code> to hide this.
        </p>
      )}
      <ProfileScreen
        profile={profile}
        sections={sections}
        activeId={activeId}
        onOpen={open}
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
