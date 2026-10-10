import { BatteryIcon, HeartIcon, PlusSquareIcon, SignalIcon, WifiIcon } from "./Icons";

type Props = { handle: string; onPrimary: () => void };

/**
 * App chrome: a desktop-only status bar above the app bar. On a real phone the
 * OS draws its own status bar, so this is hidden below 760px.
 */
export default function TopBar({ handle, onPrimary }: Props) {
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <header className="ig-chrome">
      <div className="ig-statusbar" aria-hidden="true">
        <span className="ig-statusbar__time">{time}</span>
        <span className="ig-statusbar__right">
          <SignalIcon />
          <WifiIcon />
          <BatteryIcon />
        </span>
      </div>

      <div className="ig-topbar">
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
      </div>
    </header>
  );
}
