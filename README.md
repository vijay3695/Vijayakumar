# Portfolio

A mobile-first portfolio built as an Instagram-style profile. Nine sections of a
resume are presented as a scroll-snapped reel feed: tap a tile in the grid and it
expands into a full-screen reel; swipe to move through the sections.

## Stack

| | |
| --- | --- |
| Framework | React 18 + Vite + TypeScript |
| Reel scrolling | CSS `scroll-snap-type: y mandatory` |
| Transitions | GSAP **Flip** (grid tile → full-screen reel) |
| Styling | Plain CSS with design tokens |
| Deploy | GitHub Pages, serving the built site |

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 35 render tests (vitest + jsdom)
npm run typecheck
npm run build
npm run deploy     # build, publish, push
```

## Editing content

Everything on the page lives in **`app/src/data/resume.ts`**.

- `profile` — name, designation, location, links, display picture
- `sections[]` — one entry per reel; each becomes a grid tile, a highlight
  bubble, and a full-screen reel. Adding one grows the whole UI automatically.

Fields: `title`, `subtitle`, `meta`, `body[]`, `bullets[]`, `chips[]`,
`metrics[]`, `certs[]`, `education[]`, `art` (backdrop), `glyph` (tile mark).

## Layout

```
app/                        the app (Vite root)
  src/data/resume.ts        ALL CONTENT
  src/components/           ProfileScreen, ReelView, TopBar, BottomNav, Icons
  src/hooks/useFlipReel.ts  the grid-tile → reel transition
  src/motion.ts             animations (no page-load animation, by design)
  src/styles/               tokens.css, app.css
index.html, assets/         the built site, served by Pages
app/src/data/avatar.ts      display picture, inlined as a data URI
docs/                       identical build, if Pages is set to main / docs
scripts/                    deploy + tooling
private/                    gitignored; never committed
```

Source lives in `app/` so the repo root can hold a servable build. Pages works
with the folder set to either `/` (root) or `/docs`.

## Notes

- **No page-load animation.** Instagram appears instantly; movement happens only
  in response to an action. `prefers-reduced-motion` disables the rest.
- **No resume PDF is published** and no downloadable image file exists — the
  display picture ships inlined, with no `/avatar.png` on the site.
- **No email address is published.** LinkedIn is the contact channel.
- `npm run deploy` never force-pushes.
