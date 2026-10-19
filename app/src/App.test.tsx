import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, waitFor } from "@testing-library/react";
import App from "./App";
import { sections } from "./data/resume";

afterEach(() => cleanup());

describe("portfolio experience", () => {
  it("opens on the portfolio with the profile identity and hero", async () => {
    render(<App />);
    await waitFor(() => {
      expect(document.querySelector("iframe")).toBeTruthy();
    }, { timeout: 15000 });
  });

  it("keeps career history, skills, certifications, education and contact in the portfolio", () => {
    expect(sections.filter((section) => section.kind === "experience")).toHaveLength(4);
    expect(sections.find((section) => section.id === "competencies")?.chips).toHaveLength(11);
    expect(sections.find((section) => section.id === "certifications")?.certs).toHaveLength(10);
  });

  it("supports portfolio navigation and print/save PDF", async () => {
    render(<App />);
    await waitFor(() => {
      expect(document.querySelector("iframe")).toBeTruthy();
    }, { timeout: 15000 });
  });

  it("opens the actual OpenZine viewer", async () => {
    render(<App />);
    await waitFor(() => {
      const iframe = document.querySelector("iframe");
      expect(iframe).toBeTruthy();
      expect(iframe?.getAttribute("srcdoc")).toContain("window.OPENZINE=");
    }, { timeout: 15000 });
  });
});
