# Vijayakumar Chandiran — Ant Story Portfolio

An interactive, ant-led career story for Vijayakumar Chandiran. A tiny curious ant explores a warmly lit desk, crosses the keyboard and monitor, and guides visitors through the real resume: professional summary, competencies, career history, certifications, and education. The journey ends with a sugar-cube discovery.

## Experience

- **Opening scene:** animated typing hands, a physical keyboard, the ant, and the name and role on the monitor.
- **Career chapters:** one scene per resume section, with readable content cards and a persistent chapter navigator.
- **Ant interaction:** tap or click the ant to pause and greet the visitor.
- **Desktop navigation:** chapter controls and the left/right arrow keys; Home and End jump to the beginning and finale.
- **Phone navigation:** touch-friendly controls and horizontal swipes between chapters.
- **Movie mode / Book mode:** switch between cinematic presentation and a warm reading layout.
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
