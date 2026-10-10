import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import { profile, sections } from "./data/resume";

beforeEach(() => cleanup());
afterEach(() => cleanup());

describe("profile screen", () => {
  it("renders identity, stats and bio", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: profile.name })).toBeTruthy();
    for (const s of profile.stats) {
      expect(screen.getByText(s.label)).toBeTruthy();
      expect(screen.getByText(s.value)).toBeTruthy();
    }
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

  it("switches to the proof tab and links out safely", () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /^proof$/i }));
    const items = container.querySelectorAll(".ig-proof__item");
    const expected = sections.flatMap((s) => s.proof ?? []).length;
    expect(items.length).toBe(expected);

    const ext = container.querySelector(".ig-proof__link[target='_blank']");
    if (ext) expect(ext.getAttribute("rel")).toBe("noopener noreferrer");
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
