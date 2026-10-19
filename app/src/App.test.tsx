import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import { profile, sections } from "./data/resume";

afterEach(() => cleanup());

describe("ant-led resume story", () => {
  it("opens with the profile identity and a clear start action", () => {
    const { container } = render(<App />);
    expect(screen.getByRole("heading", { name: profile.name })).toBeTruthy();
    expect(screen.getByText(profile.role + " · " + profile.location)).toBeTruthy();
    expect(screen.getByRole("button", { name: /start the journey/i })).toBeTruthy();
    expect(container.querySelector(".ant")).toBeTruthy();
    expect(container.querySelector(".world--opening")).toBeTruthy();
  });

  it("provides a jump control for every resume section", () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll(".story-chapters button")).toHaveLength(sections.length + 2);
    const chapterButtons = Array.from(container.querySelectorAll<HTMLButtonElement>(".story-chapters button"));
    for (const section of sections) {
      expect(chapterButtons.find((button) => button.textContent?.trim().endsWith(section.highlight))).toBeTruthy();
    }
  });

  it("moves through the story and renders existing resume content", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /start the journey/i }));
    expect(screen.getByRole("heading", { name: sections[0].title })).toBeTruthy();
    const experience = sections.find((section) => section.id === "exp-team-manager");
    const managerChapter = Array.from(document.querySelectorAll<HTMLButtonElement>(".story-chapters button")).find((button) => button.textContent?.trim().endsWith(experience!.highlight));
    expect(managerChapter).toBeTruthy();
    fireEvent.click(managerChapter!);
    expect(screen.getByRole("heading", { name: experience!.title })).toBeTruthy();
    expect(screen.getByText(/25-member customer support team/i)).toBeTruthy();
  });

  it("shows the sugar-cube ending and offers a restart", () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /the next goal/i }));
    expect(screen.getByRole("heading", { name: /always curious. always growing./i })).toBeTruthy();
    expect(container.querySelector(".world--sugar .sugar-cube")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /take the journey again/i }));
    expect(screen.getByRole("heading", { name: profile.name })).toBeTruthy();
  });

  it("lets the visitor interact with the ant", () => {
    render(<App />);
    const ant = screen.getByRole("button", { name: /pause and greet the tiny ant/i });
    fireEvent.click(ant);
    expect(ant.className).toContain("is-reacting");
  });

  it("switches between movie and book modes and pauses motion", () => {
    const { container } = render(<App />);
    const bookMode = screen.getByRole("button", { name: /book mode/i });
    fireEvent.click(bookMode);
    expect(container.querySelector(".story-content--book")).toBeTruthy();
    expect(bookMode.getAttribute("aria-pressed")).toBe("true");
    const pause = screen.getByRole("button", { name: /pause motion/i });
    fireEvent.click(pause);
    expect(container.querySelector(".world--paused")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /resume motion/i }));
    expect(container.querySelector(".world--paused")).toBeFalsy();
  });

  it("renders the career, competency, certification and education data", () => {
    render(<App />);
    const chapterButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".story-chapters button"));
    for (const section of sections) {
      const chapter = chapterButtons.find((button) => button.textContent?.trim().endsWith(section.highlight));
      expect(chapter).toBeTruthy();
      fireEvent.click(chapter!);
      expect(screen.getByRole("heading", { name: section.title })).toBeTruthy();
    }
  });
});
