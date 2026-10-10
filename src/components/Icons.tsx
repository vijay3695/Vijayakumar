/* Inline SVG icon set - no icon-font dependency, no network request. */

type IconProps = { size?: number; filled?: boolean };

function svgProps(size: number) {
  return {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    "aria-hidden": true as const,
    focusable: "false" as const
  };
}

export function HomeIcon({ size = 24, filled }: IconProps) {
  return (
    <svg {...svgProps(size)} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.2 12 3l9 7.2V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
  );
}

export function SearchIcon({ size = 24 }: IconProps) {
  return (
    <svg {...svgProps(size)} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </svg>
  );
}

export function ReelsIcon({ size = 24 }: IconProps) {
  return (
    <svg {...svgProps(size)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M3.5 8.5h17M8.5 3.5 12 8.5M15 3.5 18.5 8.5" />
      <path d="m11 12.2 3.4 2.3-3.4 2.3z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ProofIcon({ size = 24 }: IconProps) {
  return (
    <svg {...svgProps(size)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7.5 3.4v5.3c0 4.4-3 7.6-7.5 9.3-4.5-1.7-7.5-4.9-7.5-9.3V6.4z" />
      <path d="m9 12 2.2 2.2L15.4 10" />
    </svg>
  );
}

export function HeartIcon({ size = 24, filled }: IconProps) {
  return (
    <svg {...svgProps(size)} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.4s-7.6-4.7-7.6-10A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.6 2.8c0 5.3-7.6 10-7.6 10z" />
    </svg>
  );
}

export function CommentIcon({ size = 24 }: IconProps) {
  return (
    <svg {...svgProps(size)} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.6c0 4.2-4 7.6-9 7.6a10 10 0 0 1-2.5-.3L4 21l1.3-3.6A7.3 7.3 0 0 1 3 11.6C3 7.4 7 4 12 4s9 3.4 9 7.6z" />
    </svg>
  );
}

export function ShareIcon({ size = 24 }: IconProps) {
  return (
    <svg {...svgProps(size)} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 3 2.8 10.4l6.7 2.4 2.4 6.7z" />
      <path d="M21.5 3 9.5 12.8" />
    </svg>
  );
}

export function BookmarkIcon({ size = 24, filled }: IconProps) {
  return (
    <svg {...svgProps(size)} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.9} strokeLinejoin="round">
      <path d="M6 3.5h12a1 1 0 0 1 1 1v16l-7-4.2-7 4.2v-16a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function CloseIcon({ size = 20 }: IconProps) {
  return (
    <svg {...svgProps(size)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ChevronUpIcon({ size = 18 }: IconProps) {
  return (
    <svg {...svgProps(size)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 15l-6-6-6 6" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 18 }: IconProps) {
  return (
    <svg {...svgProps(size)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function VerifiedIcon({ size = 13 }: IconProps) {
  return (
    <svg {...svgProps(size)} viewBox="0 0 24 24" fill="#0095f6">
      <path d="M12 1.8l2.6 2.4 3.5-.4.9 3.4 3 1.9-1.6 3.1 1.6 3.1-3 1.9-.9 3.4-3.5-.4L12 22.2l-2.6-2.4-3.5.4-.9-3.4-3-1.9 1.6-3.1L2 8.7l3-1.9.9-3.4 3.5.4z" />
      <path d="m8.2 12.1 2.6 2.6 5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusSquareIcon({ size = 24 }: IconProps) {
  return (
    <svg {...svgProps(size)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M12 8.4v7.2M8.4 12h7.2" />
    </svg>
  );
}

export function GridIcon({ size = 24 }: IconProps) {
  return (
    <svg {...svgProps(size)} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </svg>
  );
}

export function TagIcon({ size = 24 }: IconProps) {
  return (
    <svg {...svgProps(size)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 11.4V4.5a1 1 0 0 1 1-1h6.9a1 1 0 0 1 .7.3l8.1 8.1a1 1 0 0 1 0 1.4l-6.9 6.9a1 1 0 0 1-1.4 0L3.8 12.1a1 1 0 0 1-.3-.7z" />
      <circle cx="7.6" cy="7.6" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SignalIcon({ size = 16 }: IconProps) {
  return (
    <svg viewBox="0 0 18 12" width={size} height={size * 0.67} aria-hidden="true" fill="currentColor">
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="10" y="3" width="3" height="9" rx="1" />
      <rect x="15" y="0" width="3" height="12" rx="1" />
    </svg>
  );
}

export function WifiIcon({ size = 16 }: IconProps) {
  return (
    <svg viewBox="0 0 16 12" width={size} height={size * 0.75} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <path d="M1 4.2a10 10 0 0 1 14 0" />
      <path d="M3.6 6.9a6.4 6.4 0 0 1 8.8 0" />
      <circle cx="8" cy="10" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BatteryIcon({ size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 26 12" width={size} height={size * 0.46} aria-hidden="true" fill="none">
      <rect x="0.5" y="0.5" width="22" height="11" rx="3.2" stroke="currentColor" opacity="0.5" />
      <rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor" />
      <path d="M24.5 4.2v3.6a2 2 0 0 0 0-3.6z" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
