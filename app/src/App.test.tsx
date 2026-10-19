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
    expect(screen.getByRole("button", { name: /pause and greet the tiny ant/i })).toBeTruthy();
    expect(container.querySelector(".three-world")).toBeTruthy();
    expect(container.querySelector(".world--opening")).toBeTruthy();
  });

  it("provides a jump control for every resume section", () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll(".story-chapters button")).toHaveLength(sections.length + 2);
    const chapterButtons = Array.from(container.querySelectorAll<HTMLButtonElement>(".story-chapters button"));
    for (const section of sections) {
      expect(chapterButtons.find((button) => button.textContent?.replace(/^\s*\d+\s*/, "").trim() === section.highlight)).toBeTruthy();
    }
  });

  it("moves through the story and renders existing resume content", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /start the journey/i }));
    expect(screen.getByRole("heading", { name: sections[0].title })).toBeTruthy();
    const experience = sections.find((section) => section.id === "exp-team-manager");
    const managerChapter = Array.from(document.querySelectorAll<HTMLButtonElement>(".story-chapters button")).find((button) => button.textContent?.replace(/^\s*\d+\s*/, "").trim() === experience!.highlight);
    expect(managerChapter).toBeTruthy();
    fireEvent.click(managerChapter!);
    expect(screen.getByRole("heading", { name: experience!.title })).toBeTruthy();
    expect(screen.getByText(/25-member customer support team/i)).toBeTruthy();
  });

  it("shows the sugar-cube ending and offers a restart", () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /the next goal/i }));
    expect(screen.getByRole("heading", { name: /always curious. always growing./i })).toBeTruthy();
    expect(container.querySelector(".world--sugar")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /take the journey again/i }));
    expect(screen.getByRole("heading", { name: profile.name })).toBeTruthy();
  });

  it("lets the visitor interact with the ant", () => {
    render(<App />);
    const ant = screen.getByRole("button", { name: /pause and greet the tiny ant/i });
    fireEvent.click(ant);
    expect(ant.className).toContain("is-reacting");
  });

  it("keeps the resume heading and story location synchronized with the ant's landmark", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /about/i }));
    expect(screen.getByRole("heading", { name: "About me" })).toBeTruthy();
    expect(screen.getByText("Notebook · about me")).toBeTruthy();
    expect(screen.getByText(/The ant reaches a well-used notebook/i)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /summary/i }));
    expect(screen.getByRole("heading", { name: "Professional Summary" })).toBeTruthy();
    expect(screen.getByText("Open book · professional summary")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /education/i }));
    expect(screen.getByRole("heading", { name: "Education" })).toBeTruthy();
    expect(screen.getByText("Diploma frame · education")).toBeTruthy();
  });

  it("shows the 3D world and readable resume together, with no competing mode switch", () => {
    const { container } = render(<App />);
    expect(container.querySelector(".three-world")).toBeTruthy();
    expect(container.querySelector(".story-card")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /movie mode/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /book mode/i })).toBeNull();
    const pause = screen.getByRole("button", { name: /pause scene/i });
    fireEvent.click(pause);
    expect(container.querySelector(".world--paused")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /resume motion/i }));
    expect(container.querySelector(".world--paused")).toBeFalsy();
  });

  it("renders the career, competency, certification and education data", () => {
    render(<App />);
    const chapterButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".story-chapters button"));
    for (const section of sections) {
      const chapter = chapterButtons.find((button) => button.textContent?.replace(/^\s*\d+\s*/, "").trim() === section.highlight);
      expect(chapter).toBeTruthy();
      fireEvent.click(chapter!);
      expect(screen.getByRole("heading", { name: section.title })).toBeTruthy();
    }
  });
});
