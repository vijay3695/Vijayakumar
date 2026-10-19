# Vijayakumar Chandiran — Interactive Resume Flipbook

A rich, single-page-at-a-time digital resume inspired by the tactile feel of printed paper and the OpenZine page-turning experience. Built with React, TypeScript, and CSS 3D transforms.

## Reading the book

- Turn pages with the on-page arrows, click either half of the page, swipe, or drag.
- Use the left/right arrow keys or Page Up/Page Down; Home and End jump to the beginning and credits.
- One page is shown on desktop and mobile. The page and controls adapt to the available screen space automatically.
- Print / Save PDF is available from the top bar.
- Includes a credits page acknowledging inspiration and third-party projects.

## Stack

- React 18 + TypeScript
- Vite
- CSS 3D perspective, page-turn animation, paper grain, and page shadows
- Vitest and Testing Library
- GitHub Pages

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

## Design and credits

The page-turning interaction is inspired by [OpenZine by Joseph Zhou](https://github.com/JosssphZhou/openzine). The implementation here uses original React and CSS rather than copying OpenZine's Paper renderer, shader, or grain assets. The visual direction is inspired by [Paper Mono](https://app.paper.design/playground/paper-mono). The credits page is part of the book.

- Live site: https://vijay3695.github.io/Vijayakumar/
- Repository: https://github.com/vijay3695/Vijayakumar
