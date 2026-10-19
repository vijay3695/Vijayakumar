# Vijayakumar Chandiran — Ant Story Portfolio

An interactive 3D ant-led career story for Vijayakumar Chandiran. A fully articulated ant explores a physical WebGL desk with individual keyboard keys, typing hands, a monitor carrying the name and role, notebooks, operations dashboards, books, and a sugar cube. The 3D journey and readable resume chapters stay visible together.

## Experience

- **Opening scene:** animated typing hands, a physical keyboard, the ant, and the name and role on the monitor.
- **Career chapters:** one scene per resume section, with readable content cards and a persistent chapter navigator.
- **Ant interaction:** tap or click the ant to pause and greet the visitor.
- **Desktop navigation:** chapter controls and the left/right arrow keys; Home and End jump to the beginning and finale.
- **Phone navigation:** touch-friendly controls and horizontal swipes between chapters.
- **Both at once:** the cinematic 3D scene and the readable resume story are visible together; there is no mutually exclusive movie/book toggle.
- **Motion control:** pause and resume scene animations.
- **Finale:** sugar-cube discovery, “Always curious. Always growing.”, and LinkedIn/GitHub links.
- **Accessibility:** semantic controls, visible focus states, keyboard navigation, and reduced-motion support.

## Stack

- React 18
- TypeScript
- Vite
- Plain CSS with perspective/3D transforms
- Vitest and Testing Library
- GitHub Pages

## Run locally

```bash
npm ci
npm run dev        # http://localhost:5173
npm run typecheck
npm test
npm run build
```

## Content

Resume data is maintained in `app/src/data/resume.ts`. The source contains the career summary, four Sutherland role stages (2018–2025), core competencies, ten certifications, and education. Update the data there instead of duplicating it in the UI.

## Deployment

The workflow at `.github/workflows/deploy.yml` runs on pushes to `main` and can be started manually. It installs dependencies, runs TypeScript checking and tests, builds the production site, and deploys the `dist/` artifact to GitHub Pages.

- **Live site:** https://vijay3695.github.io/Vijayakumar/
- **Repository:** https://github.com/vijay3695/Vijayakumar
