import { useCallback, useRef } from "react";

/**
 * Harvest-resistant email control.
 *
 * The address is stored base64-encoded, and this is deliberate: the repository
 * is public and so is the built bundle, so a plain address in the source would
 * be picked up by scrapers that read GitHub or parse the JavaScript.
 *
 * The `mailto:` is only assembled once a real visitor interacts (hover, focus,
 * touch or click). So:
 *   served HTML       -> contains nothing
 *   JS bundle         -> contains only the encoded form
 *   DOM after load    -> contains nothing
 *   DOM after a human uses it -> contains the address, in that browser only
 *
 * That defeats the automated harvesters, which is the overwhelming majority of
 * the problem. It is not a guarantee against a determined human with a browser.
 */

/** Decode the stored address. Returns "" if the payload is malformed. */
export function decodeEmail(b64: string): string {
  try {
    const raw = typeof atob === "function" ? atob(b64) : "";
    // guard against a truncated payload producing nonsense
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw) ? raw : "";
  } catch {
    return "";
  }
}

type Props = {
  /** base64-encoded address, from src/data/resume.ts */
  b64: string;
  label?: string;
  className?: string;
};

export default function EmailButton({ b64, label = "Email", className }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const arm = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const addr = decodeEmail(b64);
    if (!addr) return;
    if (el.getAttribute("href") !== "mailto:" + addr) {
      el.setAttribute("href", "mailto:" + addr);
    }
  }, [b64]);

  return (
    <a
      ref={ref}
      className={className}
      // a harmless in-page target until a human actually engages with it
      href="#contact"
      onPointerEnter={arm}
      onFocus={arm}
      onTouchStart={arm}
      onClick={(e) => {
        if (!ref.current?.getAttribute("href")?.startsWith("mailto:")) {
          // keyboard activation can arrive before any hover/focus arming
          e.preventDefault();
          arm();
        }
      }}
    >
      {label}
    </a>
  );
}
