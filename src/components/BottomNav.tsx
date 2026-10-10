import { HomeIcon, ProofIcon, ReelsIcon, SearchIcon } from "./Icons";

type Props = {
  initial: string;
  active: "home" | "reels" | "proof";
  onHome: () => void;
  onReels: () => void;
  onProof: () => void;
  onSkills: () => void;
};

export default function BottomNav({
  initial,
  active,
  onHome,
  onReels,
  onProof,
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
        className={"ig-bottomnav__item" + (active === "proof" ? " is-active" : "")}
        onClick={onProof}
        aria-label="Proof of work"
      >
        <ProofIcon />
        <span className="ig-bottomnav__dot" />
      </button>

      <button type="button" className="ig-bottomnav__item" onClick={onHome} aria-label="Profile">
        <span className="ig-bottomnav__avatar">{initial}</span>
        <span className="ig-bottomnav__dot" />
      </button>
    </nav>
  );
}
