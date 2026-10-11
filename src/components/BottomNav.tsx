import { HomeIcon, ReelsIcon, SearchIcon, TagIcon } from "./Icons";

type Props = {
  initial: string;
  /** optional display picture - replaces the initial when present */
  avatar?: string;
  active: "home" | "reels" | "skills";
  onHome: () => void;
  onReels: () => void;
  onCompetencies: () => void;
  onSkills: () => void;
};

export default function BottomNav({
  initial,
  avatar,
  active,
  onHome,
  onReels,
  onCompetencies,
  onSkills
}: Props) {
  return (
    <nav className="ig-bottomnav" aria-label="App navigation">
      <button
        type="button"
        className={"ig-bottomnav__item" + (active === "home" ? " is-active" : "")}
        onClick={onHome}
        aria-label="Home"
      >
        <HomeIcon filled={active === "home"} />
        <span className="ig-bottomnav__dot" />
      </button>

      <button type="button" className="ig-bottomnav__item" onClick={onSkills} aria-label="Search skills">
        <SearchIcon />
        <span className="ig-bottomnav__dot" />
      </button>

      <button
        type="button"
        className={"ig-bottomnav__item" + (active === "reels" ? " is-active" : "")}
        onClick={onReels}
        aria-label="Reels"
      >
        <ReelsIcon />
        <span className="ig-bottomnav__dot" />
      </button>

      <button
        type="button"
        className={"ig-bottomnav__item" + (active === "skills" ? " is-active" : "")}
        onClick={onCompetencies}
        aria-label="Core competencies"
      >
        <TagIcon />
        <span className="ig-bottomnav__dot" />
      </button>

      <button type="button" className="ig-bottomnav__item" onClick={onHome} aria-label="Profile">
        <span className="ig-bottomnav__avatar">
          {avatar ? (
            <img
              className="ig-bottomnav__photo"
              src={avatar}
              alt=""
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            initial
          )}
        </span>
        <span className="ig-bottomnav__dot" />
      </button>
    </nav>
  );
}
