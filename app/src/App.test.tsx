import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import App from "./App";
import { profile, sections } from "./data/resume";

afterEach(() => cleanup());

describe("portfolio experience", () => {
  it("opens on the portfolio with the profile identity and hero", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /Vijayakumar\s*Chandiran/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /Making service work better/i })).toBeTruthy();
    expect(screen.getByText(profile.role)).toBeTruthy();
    expect(screen.getByRole("navigation", { name: /Resume sections/i })).toBeTruthy();
    expect(document.querySelector(".resume-site")).toBeTruthy();
    expect(document.querySelector(".book-page--current")).toBeNull();
  });

  it("keeps career history, skills, certifications, education and contact in the portfolio", () => {
    render(<App />);
    expect(sections.filter((section) => section.kind === "experience")).toHaveLength(4);
    expect(screen.getByRole("heading", { name: /Experience/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /Core Competencies/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /Certifications/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /Education/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /about what's next/i })).toBeTruthy();
    expect(sections.find((section) => section.id === "competencies")?.chips).toHaveLength(11);
    expect(sections.find((section) => section.id === "certifications")?.certs).toHaveLength(10);
  });

  it("supports portfolio navigation and print/save PDF", () => {
    render(<App />);
    const experienceNav = screen.getByRole("button", { name: "Experience" });
    fireEvent.click(experienceNav);
    expect(document.getElementById("experience")).toBeTruthy();
    expect(screen.getByRole("button", { name: /PRINT \/ SAVE PDF/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /LinkedIn/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /GitHub/i })).toBeTruthy();
  });

  it("opens the actual OpenZine viewer from the portfolio and closes it cleanly", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /OPEN INTERACTIVE BOOK/i }));
    const viewer = screen.getByTitle(/OpenZine paper-turn renderer/i);
    expect(viewer.getAttribute("srcdoc")).toContain("window.OPENZINE=");
    expect(viewer.getAttribute("srcdoc")).toContain("Paper Mono");
    fireEvent.click(screen.getByRole("button", { name: /CLOSE BOOK/i }));
    expect(screen.queryByTitle(/OpenZine paper-turn renderer/i)).toBeNull();
  });
});
