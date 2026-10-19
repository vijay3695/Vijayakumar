# Vijayakumar Chandiran — Portfolio

A responsive React + TypeScript portfolio with two connected ways to explore the same career information: the accessible, live portfolio and an optional interactive paper book.

## Live site

- Live site: https://vijay3695.github.io/Vijayakumar/
- Repository: https://github.com/vijay3695/Vijayakumar

## Experience

- Responsive portfolio layout with section navigation.
- Career history, professional summary, competencies, certifications, education and contact links.
- Print / Save PDF action.
- Optional interactive book launched from the portfolio; it uses the actual vendored OpenZine/Paper Mono page-turn renderer rather than a CSS rotate animation.
- The book's pages are rendered from the React JSX page components in the browser as SVG texture inputs. No pre-rendered resume page images are stored in the repository; the scrollable portfolio remains the primary, accessible HTML experience.
- The OpenZine runtime is isolated in an iframe because its viewer takes ownership of the document body. This keeps it from replacing or breaking the portfolio itself.

## Stack

- React 18 + TypeScript
- Vite
- Vitest and Testing Library
- GitHub Pages, intended source **Deploy from a branch → main → /(root)**

## Run locally

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
```

## Source map

- Portfolio: `app/src/ResumePortfolio.tsx`
- Interactive book integration: `app/src/FlipbookResume.tsx`
- Resume content: `app/src/data/resume.ts`
- App entry: `app/src/App.tsx`
- Styles: `app/src/styles/`
- Vendored OpenZine runtime and notices: `.codex/skills/openzine/`

## Publish without GitHub Actions

The repository keeps source under `app/` and the built site at the repository root. On a machine with the project checked out and npm dependencies installed, run:

```sh
npm run deploy
```

The script builds the Vite app and publishes only `index.html`, `assets/`, and `.nojekyll` to `main` root. It does not use GitHub Actions and does not publish to `docs/`.

GitHub Pages must be set in repository Settings → Pages to **Deploy from a branch**, branch **main**, folder **/(root)**. Removing the workflow does not change this setting. The GitHub repository connection used to edit source files does not expose a Pages-settings write operation, so the setting must be changed through GitHub's repository settings UI.

## Third-party credits and rights

- **OpenZine** — viewer/builder source and integration workflow: https://github.com/JosssphZhou/openzine. OpenZine-authored files retain the upstream MIT notice; see `.codex/skills/openzine/OPENZINE-LICENSE.txt`.
- **Paper Mono** — original page-turn renderer, paper shader and grain texture, from https://paper.design/mono. These parts are copyright Paper and are not covered by OpenZine's MIT licence. The interactive book uses this renderer; the credit is kept here rather than printed on the resume.
- **Three.js r162** — bundled runtime components under the MIT licence; notice retained in `.codex/skills/openzine/runtime/THREE-LICENSE.txt`.
- **Paper Mono typeface** — SIL Open Font License 1.1; notice retained in `.codex/skills/openzine/runtime/PAPERMONO-OFL.txt`.

Do not treat OpenZine's MIT licence as licensing the Paper renderer or assets. See the retained notices before redistributing the runtime.
