# Vijayakumar Chandiran — Portfolio

A responsive React + TypeScript portfolio presenting Vijayakumar Chandiran's profile, career history, skills, certifications, education and contact links. The primary experience is the portfolio itself—not a standalone resume converted into OpenZine pages.

## Live site

- Live site: https://vijay3695.github.io/Vijayakumar/
- Repository: https://github.com/vijay3695/Vijayakumar

## Experience

- Responsive portfolio layout with sticky profile panel and section navigation.
- Career history, professional summary, competencies, certifications and education.
- LinkedIn and GitHub links.
- Print / Save PDF actions.
- Accessible navigation and reduced-motion-aware scrolling.

## Stack

- React 18 + TypeScript
- Vite
- Vitest and Testing Library
- GitHub Pages (intended source: **Deploy from a branch → main → /(root)**)

## Run locally

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
```

## Source of truth

- Portfolio layout: `app/src/ResumePortfolio.tsx`
- Resume content: `app/src/data/resume.ts`
- Global app entry: `app/src/App.tsx`
- Styles: `app/src/styles/resume-portfolio.css`

## Publish from the main branch root

The repository keeps the source under `app/` and the deployable Vite build at the repository root. After building, run:

```sh
npm run deploy
```

The script builds the project and publishes the generated `index.html` and `assets/` to `main` root (and mirrors the build into `docs/`). It does not use GitHub Actions.

**Important:** deleting the Actions workflow does not change the GitHub Pages source setting. In repository Settings → Pages, the source must be set to **Deploy from a branch**, branch **main**, folder **/(root)**. The GitHub connection available to this editing session cannot change that repository setting directly.

## OpenZine attribution and scope

The OpenZine runtime is vendored under `.codex/skills/openzine/` for reference, with upstream and licence notices retained there. It is an image-page booklet runtime that replaces the host document body; it is not wired into the live-DOM portfolio because that would convert the resume content into OpenZine pages, contrary to the portfolio requirement. The portfolio remains a React/TypeScript site.
