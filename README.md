# Vijayakumar Chandiran — Interactive Resume Flipbook

A rich, single-page-at-a-time digital resume rendered with OpenZine’s page-turning book engine. The React + TypeScript resume source is rendered into page images during CI, then the vendored OpenZine skill bundles those pages and its renderer into one standalone HTML book.

## Reading the book

- Turn pages with the on-page arrows, click either half of the page, swipe, or drag.
- Use the left/right arrow keys or Page Up/Page Down; Home and End jump to the first and last resume pages.
- One page is shown on desktop and mobile. The page and controls adapt to the available screen space automatically.
- Print / Save PDF is available from the top bar.

## Stack

- React 18 + TypeScript
- Vite
- OpenZine’s paper-bending WebGL renderer, paper shader, grain texture, and page shadows (single-page mode on desktop and mobile)
- Vitest and Testing Library
- GitHub Pages
- Vendored OpenZine skill at `.codex/skills/openzine/`

## Run locally

```bash
npm ci
npm run dev
npm run typecheck
npm test
npm run build
```

## Resume content

Source content lives in `app/src/data/resume.ts`: the professional summary, four Sutherland career stages, competencies, ten certifications, and education. The flipbook pages are arranged in `app/src/FlipbookResume.tsx`.

## OpenZine build workflow

The OpenZine skill is stored in `.codex/skills/openzine/` in this repository, so no global/local skill installation is required. The GitHub Actions build renders the React resume into numbered page images with Puppeteer, runs the vendored `scripts/make-book.mjs` builder, and deploys the resulting standalone `dist/index.html`. The vendored runtime is adapted to keep a single page visible on both desktop and mobile. The generated book retains OpenZine’s Paper Mono attribution link in its footer; the LinkedIn and GitHub links remain available in the book header.

## Credits and licences

OpenZine by Joseph Zhou (https://github.com/JosssphZhou/openzine) is vendored under `.codex/skills/openzine/`; its source skill and builder are included for reproducibility. OpenZine has mixed licensing: its own files have the file-specific terms in `OPENZINE-LICENSE.txt`, while the extracted Paper Mono page-turn renderer/shader/grain are copyright Paper and are not covered by OpenZine’s MIT licence. Three.js is MIT; the Paper Mono typeface is SIL OFL 1.1. The generated book preserves the Paper attribution link, and the applicable upstream notices are retained beside the vendored files. See `.codex/skills/openzine/UPSTREAM.md` and the bundled licence files.

- Live site: https://vijay3695.github.io/Vijayakumar/
- Repository: https://github.com/vijay3695/Vijayakumar
