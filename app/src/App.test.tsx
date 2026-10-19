import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import { profile, sections } from "./data/resume";

afterEach(() => cleanup());

describe("typography-led full resume portfolio", () => {
  it("opens with the profile identity, role and clear resume actions", () => {
    const { container } = render(<App />);
    expect(screen.getByRole("heading", { name: /Vijayakumar Chandiran/i })).toBeTruthy();
    expect(screen.getByText(profile.role)).toBeTruthy();
    expect(screen.getByRole("button", { name: /PRINT \/ SAVE PDF/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /LinkedIn/i })).toBeTruthy();
    expect(container.querySelector(".three-world")).toBeNull();
    expect(container.querySelector(".ant-story")).toBeNull();
  });

  it("provides navigation to the full resume sections", () => {
    const { container } = render(<App />);
    const nav = container.querySelector('[aria-label="Resume sections"]');
    expect(nav).toBeTruthy();
    for (const label of ["About", "Summary", "Experience", "Expertise", "Certifications", "Education", "Contact"]) {
      expect(screen.getByRole("button", { name: label })).toBeTruthy();
    }
    for (const id of ["about", "summary", "experience", "competencies", "certifications", "education", "contact"]) {
      expect(container.querySelector("#" + id)).toBeTruthy();
    }
  });

  it("shows every role and its full responsibilities in one readable page", () => {
    render(<App />);
    for (const section of sections.filter((item) => item.kind === "experience")) {
      expect(screen.getByRole("heading", { name: section.title })).toBeTruthy();
      expect(screen.getByText(section.subtitle!)).toBeTruthy();
      for (const bullet of section.bullets ?? []) expect(screen.getByText(bullet)).toBeTruthy();
    }
    expect(screen.getByText(/25-member customer support team/i)).toBeTruthy();
    expect(screen.getByText(/30-member support team/i)).toBeTruthy();
  });

  it("renders the complete competency, certification and education lists", () => {
    render(<App />);
    for (const section of sections) {
      expect(screen.getByRole("heading", { name: section.title })).toBeTruthy();
      for (const skill of section.chips ?? []) expect(screen.getByText(skill)).toBeTruthy();
      for (const cert of section.certs ?? []) expect(screen.getByText(cert.name)).toBeTruthy();
      for (const item of section.education ?? []) expect(screen.getByText(item.qualification)).toBeTruthy();
    }
  });

  it("offers a mobile navigation toggle and scroll navigation", () => {
    render(<App />);
    const toggle = screen.getByRole("button", { name: /toggle navigation/i });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Experience" }));
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("uses a print action that can save the resume as a PDF", () => {
    render(<App />);
    expect(screen.getAllByRole("button", { name: /PRINT \/ SAVE PDF/i }).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole("heading", { name: /Let’s talk/i })).toBeTruthy();
  });
});
