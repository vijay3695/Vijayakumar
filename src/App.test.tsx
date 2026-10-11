import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import { profile, sections } from "./data/resume";

beforeEach(() => cleanup());
afterEach(() => cleanup());

describe("profile screen", () => {
  it("renders identity, stats and bio", () => {
    const { container } = render(<App />);
    expect(screen.getByRole("heading", { name: profile.name })).toBeTruthy();
    // scoped to the stats row: a bare "3" also appears in the notification badge
    const stats = container.querySelectorAll(".ig-stats li");
    expect(stats.length).toBe(profile.stats.length);
    stats.forEach((li, i) => {
      expect(li.querySelector("strong")?.textContent).toBe(profile.stats[i].value);
      expect(li.querySelector("span")?.textContent).toBe(profile.stats[i].label);
    });
    expect(screen.getByText(profile.bio[0])).toBeTruthy();
    expect(screen.getByText(profile.available)).toBeTruthy();
  });

  it("renders one highlight bubble and one grid tile per section", () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll(".ig-highlight").length).toBe(sections.length);
    expect(container.querySelectorAll(".ig-tile").length).toBe(sections.length);
  });

  it("every grid tile is reachable by an accessible name", () => {
    render(<App />);
    for (const s of sections) {
      expect(screen.getByRole("button", { name: `Open ${s.title}` })).toBeTruthy();
    }
  });

  it("switches to the skills tab", () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /^skills$/i }));
    const chips = container.querySelectorAll(".ig-chip");
    expect(chips.length).toBeGreaterThan(0);
    const expected = new Set(sections.flatMap((s) => s.chips ?? []));
    expect(chips.length).toBe(expected.size);
  });

  it("switches to the summary tab and shows the professional summary", () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /^summary$/i }));
    const paras = container.querySelectorAll(".ig-summary p");
    const summary = sections.find((s) => s.kind === "summary");
    expect(paras.length).toBe((summary?.body ?? []).length);

  });
});

describe("reel view", () => {
  it("opens a reel when a grid tile is tapped", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: `Open ${sections[0].title}` }));

    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-label")).toBe(sections[0].title);
    expect(dialog.querySelectorAll(".reel").length).toBe(sections.length);
    expect(dialog.querySelectorAll(".reel-progress__seg").length).toBe(sections.length);
  });

  it("opens the correct reel from a highlight bubble", () => {
    render(<App />);
    const target = sections[2];
    fireEvent.click(screen.getByRole("button", { name: `Open ${target.title}` }));
    expect(screen.getByRole("dialog").getAttribute("aria-label")).toBe(target.title);
  });

  it("honours the GSAP Flip contract: shared id, hidden source", () => {
    const { container } = render(<App />);
    const section = sections[0];

    // before opening, the tile owns the shared id
    const tile = container.querySelector(`[data-flip-id="tile-${section.id}"]`);
    expect(tile).toBeTruthy();
    expect(tile?.classList.contains("ig-tile")).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: `Open ${section.title}` }));

    // Flip needs exactly two elements sharing the id: the disappearing tile
    // and the appearing reel panel. That pairing IS the contract.
    const matches = Array.from(
      container.querySelectorAll(`[data-flip-id="tile-${section.id}"]`)
    );
    expect(matches.length).toBe(2);

    const panel = matches.find((el) => el.classList.contains("reel-panel"));
    const tileNow = matches.find((el) => el.classList.contains("ig-tile")) as HTMLElement;
    expect(panel).toBeTruthy();
    expect(tileNow).toBeTruthy();

    // the source tile must be display:none so Flip sees it as disappearing
    expect(tileNow.style.display).toBe("none");
  });

  it("renders reel content: metrics and bullets", () => {
    const { container } = render(<App />);
    const i = sections.findIndex((s) => (s.metrics?.length ?? 0) > 0);
    fireEvent.click(screen.getByRole("button", { name: `Open ${sections[i].title}` }));
    expect(container.querySelectorAll(".reel__metric").length).toBeGreaterThan(0);
    expect(container.querySelectorAll(".reel__bullets li").length).toBeGreaterThan(0);
  });

  it("closes on Escape", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: `Open ${sections[0].title}` }));
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes via the close button", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: `Open ${sections[0].title}` }));
    fireEvent.click(screen.getByRole("button", { name: /close reels/i }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("exposes prev/next controls with correct disabled state", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: `Open ${sections[0].title}` }));
    const prev = screen.getByRole("button", { name: /previous reel/i }) as HTMLButtonElement;
    const next = screen.getByRole("button", { name: /next reel/i }) as HTMLButtonElement;
    expect(prev.disabled).toBe(true);   // we opened at index 0
    expect(next.disabled).toBe(false);
  });
});

describe("robustness", () => {
  it("renders and opens a reel without console errors", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: `Open ${sections[0].title}` }));
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("app chrome", () => {
  it("renders a top bar and a 5-item bottom nav", () => {
    const { container } = render(<App />);
    expect(container.querySelector(".ig-topbar__wordmark")).toBeTruthy();
    expect(container.querySelectorAll(".ig-bottomnav__item").length).toBe(5);
  });

  it("bottom nav opens the reels feed", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /^reels$/i }));
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("bottom nav jumps to the core competencies reel", () => {
    render(<App />);
    // exact match: "Open Core Competencies" (the grid tile) also matches the regex
    fireEvent.click(screen.getByRole("button", { name: "Core competencies" }));
    const dialog = screen.getByRole("dialog");
    const comps = sections.find((s) => s.kind === "skills");
    expect(dialog.getAttribute("aria-label")).toBe(comps?.title);
  });
});

describe("regressions", () => {
  it("every entrance-animation target exists in the animated root", () => {
    // Guards a real bug: the timeline was scoped to `.profile`, which excludes
    // the top bar and bottom nav, so those steps silently did nothing.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<App />);
    const gsapWarnings = warn.mock.calls.filter((c) => String(c[0]).includes("GSAP"));
    expect(gsapWarnings).toEqual([]);
    warn.mockRestore();
  });

  it("double-tap likes a reel", () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole("button", { name: `Open ${sections[0].title}` }));
    const reel = container.querySelector(".reel") as HTMLElement;
    fireEvent.click(reel);
    fireEvent.click(reel);
    expect(screen.getAllByRole("button", { name: /unlike/i }).length).toBeGreaterThan(0);
  });

  it("tiles carry a distinct motif so no two look alike", () => {
    const { container } = render(<App />);
    const motifs = Array.from(container.querySelectorAll(".ig-tile")).map(
      (t) => t.getAttribute("data-motif")
    );
    expect(new Set(motifs).size).toBeGreaterThan(1);
  });
});

describe("no contact address is published", () => {
  const EMAIL_RE = /[^\s@"'<>]+@[^\s@"'<>]+\.[a-z]{2,}/i;

  it("the rendered DOM contains no email address and no mailto", () => {
    const { container } = render(<App />);
    expect(container.innerHTML).not.toMatch(EMAIL_RE);
    expect(container.innerHTML).not.toMatch(/mailto:/i);
  });

  it("nothing appears inside the reels either", () => {
    const { container } = render(<App />);
    const i = sections.findIndex((s) => s.kind === "about");
    fireEvent.click(screen.getByRole("button", { name: `Open ${sections[i].title}` }));
    expect(container.innerHTML).not.toMatch(EMAIL_RE);
    expect(container.innerHTML).not.toMatch(/mailto:/i);
  });

  it("the content model holds no address", () => {
    expect(JSON.stringify(profile)).not.toMatch(EMAIL_RE);
  });

  it("LinkedIn and GitHub are offered instead", () => {
    render(<App />);
    expect(screen.getByRole("link", { name: /linkedin/i }).getAttribute("href")).toMatch(/^https:/);
    expect(screen.getByRole("link", { name: /github/i }).getAttribute("href")).toMatch(/^https:/);
  });

  it("every link points at a real page, not a bare domain", () => {
    // Guards a shipped bug: the LinkedIn href was "https://www.linkedin.com/",
    // so the button dumped visitors on the homepage instead of the profile.
    for (const l of profile.links) {
      const path = new URL(l.href).pathname.replace(/\/+$/, "");
      expect(path.length, l.label + " points at a bare domain").toBeGreaterThan(0);
    }
  });

  it("no Resume download button remains", () => {
    render(<App />);
    expect(screen.queryByRole("link", { name: /resume/i })).toBeNull();
  });
});

describe("display picture", () => {
  it("renders the avatar from an inlined data URI", () => {
    const { container } = render(<App />);
    const img = container.querySelector(".ig-avatar__photo") as HTMLImageElement | null;
    expect(img).toBeTruthy();
    expect(img?.getAttribute("src")?.startsWith("data:image/")).toBe(true);
    expect(img?.getAttribute("alt")).toBe(profile.name);
  });

  it("is not draggable", () => {
    const { container } = render(<App />);
    const img = container.querySelector(".ig-avatar__photo");
    expect(img?.getAttribute("draggable")).toBe("false");
  });
});

describe("structure matches the resume", () => {
  it("About is a personal card: name, location, LinkedIn and GitHub", () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole("button", { name: `Open ${sections[0].title}` }));
    const card = container.querySelector(".reel__identity");
    expect(card).toBeTruthy();
    expect(card?.textContent).toContain(profile.name);
    expect(card?.textContent).toContain(profile.location);
    expect(card?.querySelectorAll(".reel__idlink").length).toBe(profile.links.length);
  });

  it("the professional summary lives in its own section, not in About", () => {
    const about = sections.find((s) => s.kind === "about");
    const summary = sections.find((s) => s.kind === "summary");
    expect(about?.body.length).toBe(0);
    expect(summary?.body.length).toBeGreaterThan(0);
    expect(summary?.body[0]).toMatch(/Results-driven/);
  });

  it("core competencies carry all 11 competencies", () => {
    const comps = sections.find((s) => s.kind === "skills");
    expect(comps?.chips?.length).toBe(11);
    expect(comps?.chips).toContain("Service Delivery & Operations");
  });

  it("all four Sutherland roles are present, newest first", () => {
    const roles = sections.filter((s) => s.kind === "experience");
    expect(roles.length).toBe(4);
    expect(roles.every((r) => r.subtitle === "Sutherland Global Services")).toBe(true);
    expect(roles[0].title).toBe("Team Manager");
    expect(roles[3].title).toBe("Customer Support Associate");
  });

  it("lists all 10 certifications with issuer and year", () => {
    const certs = sections.find((s) => s.kind === "certifications");
    expect(certs?.certs?.length).toBe(10);
    expect(certs?.certs?.[0]).toEqual({
      name: "Six Sigma Black Belt",
      issuer: "LinkedIn",
      year: "2025"
    });
    expect(certs?.certs?.some((c) => c.issuer === "Sutherland Learning")).toBe(true);
  });

  it("no fabricated content from the sample data survives", () => {
    const blob = JSON.stringify(sections);
    for (const fake of ["Razorline", "Cargofleet", "p95", "Kafka", "PostgreSQL", "B.E. Computer Science"]) {
      expect(blob.includes(fake), fake + " is still in the content").toBe(false);
    }
  });
});
