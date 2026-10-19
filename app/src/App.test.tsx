import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import { profile, sections } from "./data/resume";

afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("interactive resume flipbook", () => {
  it("opens on a designed single-page cover with the profile identity", () => {
    const { container } = render(<App />);
    expect(screen.getByRole("heading", { name: /Vijayakumar Chandiran/i })).toBeTruthy();
    expect(screen.getByText(profile.role)).toBeTruthy();
    expect(screen.getByText(/CURRICULUM VITAE/i)).toBeTruthy();
    expect(container.querySelector(".book-page--current")).toBeTruthy();
    expect(container.querySelector(".resume-topnav")).toBeNull();
  });

  it("supports next and previous page controls and updates the page counter", () => {
    vi.useFakeTimers();
    render(<App />);
    expect(screen.getByText(/01 \/ 15/)).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "Next page" })[1]);
    act(() => { vi.advanceTimersByTime(650); });
    expect(screen.getByRole("heading", { name: /A little about me/i })).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "Previous page" })[1]);
    act(() => { vi.advanceTimersByTime(650); });
    expect(screen.getByRole("heading", { name: /Vijayakumar Chandiran/i })).toBeTruthy();
  });

  it("keeps the resume's key career and learning information in the page content", () => {
    expect(sections.filter((section) => section.kind === "experience")).toHaveLength(4);
    expect(sections.find((section) => section.id === "exp-team-manager")?.bullets).toContain(
      "Led a 25-member customer support team, ensuring SLA, AHT and CSAT targets are consistently met."
    );
    expect(sections.find((section) => section.id === "competencies")?.chips).toHaveLength(11);
    expect(sections.find((section) => section.id === "certifications")?.certs).toHaveLength(10);
    expect(sections.find((section) => section.id === "education")?.education).toHaveLength(2);
  });

  it("includes creator credits and keyboard-friendly page navigation", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Previous page" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /PRINT \/ SAVE PDF/i })).toBeTruthy();
    fireEvent.keyDown(window, { key: "End" });
    expect(screen.getByRole("heading", { name: /Made with respect/i })).toBeTruthy();
    expect(screen.getAllByRole("link", { name: /View project/i }).length).toBeGreaterThanOrEqual(2);
  });
});
