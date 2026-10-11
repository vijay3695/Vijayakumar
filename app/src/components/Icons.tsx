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

export function GitHubIcon({ size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}

export function LinkedInIcon({ size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export function PinIcon({ size = 15 }: IconProps) {
  return (
    <svg {...svgProps(size)} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-6.5-5.4-6.5-10.2A6.5 6.5 0 0 1 12 4.3a6.5 6.5 0 0 1 6.5 6.5C18.5 15.6 12 21 12 21z" />
      <circle cx="12" cy="10.6" r="2.4" />
    </svg>
  );
}

export function DocIcon({ size = 24 }: IconProps) {
  return (
    <svg {...svgProps(size)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  );
}
