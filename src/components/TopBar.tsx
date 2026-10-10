import { HeartIcon, PlusSquareIcon } from "./Icons";

type Props = { handle: string; onPrimary: () => void };

/**
 * The app bar. Deliberately mirrors the shape of a familiar mobile app shell
 * (wordmark left, actions right) without borrowing anyone's actual logo.
 */
export default function TopBar({ handle, onPrimary }: Props) {
  return (
    <header className="ig-topbar">
      <span className="ig-topbar__wordmark">
        {handle}
        <i>portfolio</i>
      </span>

      <span className="ig-topbar__icons">
        <button type="button" className="ig-iconbtn" onClick={onPrimary} aria-label="Open reels">
          <PlusSquareIcon />
        </button>
        <button type="button" className="ig-iconbtn" onClick={onPrimary} aria-label="Notifications">
          <HeartIcon />
          <span className="ig-iconbtn__badge">3</span>
        </button>
      </span>
    </header>
  );
}
