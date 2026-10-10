# Portfolio - Instagram-style, mobile-first

A portfolio that opens like an Instagram profile and reads like Reels: tap a tile
in the grid and it expands into a full-screen section you swipe through.

Every section of the resume becomes one "reel" - experience, skills, education,
proof of work - and the feed is native CSS scroll-snap, so it feels right on a
phone instead of fighting it.

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | React 18 + Vite + TypeScript | The reel feed is stateful; Vite builds static output for Pages |
| Reel scrolling | CSS `scroll-snap-type: y mandatory` | Runs on the compositor - no JS scroll hijacking |
| Transition | GSAP **Flip** | Animates the grid tile morphing into the full-screen reel |
| Styling | Plain CSS + tokens | Instagram's exact dark palette, no utility-class noise |
| 3D | none | This is UI choreography, not a 3D scene |

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 13 render tests (vitest + jsdom)
npm run typecheck
npm run build      # -> dist/
npm run preview
```

## Editing content

**Everything you read on the page lives in one file: `src/data/resume.ts`.**

- `profile` - name, handle, stats, bio, links
- `sections[]` - one entry per reel. Each becomes a grid tile, a highlight
  bubble, and a full-screen reel. Add an entry and the whole UI grows with it.

Fields per section: `highlight`, `eyebrow`, `title`, `subtitle`, `meta`,
`body[]`, `bullets[]`, `chips[]`, `metrics[]`, `proof[]`, `art` (reel gradient),
`glyph` (tile mark).

Current content is PLACEHOLDER text, marked as such.

## Adding your resume PDF

1. Drop the PDF at `public/resume.pdf` (the "Resume" button links to it).
2. Pull the text out to fill `resume.ts`:

```bash
npm run extract -- public/resume.pdf
```

`scripts/extract_resume.py` is dependency-free: it inflates the PDF's compressed
content streams and walks the text operators itself. It also reads `.docx` (unzips
and parses the document XML) and plain text. Scanned/image-only PDFs cannot be
read - send a screenshot instead.

## How the signature transition works

The grid tile and the reel panel share one `data-flip-id`. While a reel is open
the source tile is set to `display:none`, so Flip sees two elements with the same
id, works out which is disappearing, and swaps them. That is why the hook does
not pass an explicit `targets` override - see `src/hooks/useFlipReel.ts`.

It degrades safely: no Flip, a thrown error, or `prefers-reduced-motion` all
still give you a working reel.

## Accessibility and mobile details

- `Esc` closes, arrow keys / PageUp / PageDown / Home / End move between reels
- Reels are a labelled `role="dialog"` with focus moved in and restored on close
- `100dvh` (not `100vh`) so iOS Safari's toolbar cannot clip the feed
- Safe-area insets respected for notched devices
- Background scroll is locked while a reel is open, and restored on close
- `prefers-reduced-motion` disables the flip and all transitions

## Deploying

The workflow is committed at **`deploy/github-pages.yml`** (not in
`.github/workflows/`, because the automation that authored this repo is not
allowed to write workflow files). To turn it on, either:

1. **Locally:** `mkdir -p .github/workflows && git mv deploy/github-pages.yml .github/workflows/deploy.yml`
2. **On GitHub:** Actions -> New workflow -> paste the file's contents.

It runs typecheck, tests and build, then publishes `dist/` on every push to
`main`. Enable **Settings -> Pages -> Source: GitHub Actions** once.

`base: "./"` in `vite.config.ts` keeps asset URLs relative, so the same build
works on a project path or a custom domain with no changes.

## Repo layout

```
src/
  App.tsx                 profile <-> reel state
  components/
    ProfileScreen.tsx     the Instagram profile shell
    ReelView.tsx          the scroll-snapped reel feed
  hooks/
    useFlipReel.ts        the tile -> reel Flip transition
    useReducedMotion.ts
  data/resume.ts          ALL CONTENT LIVES HERE
  styles/
    tokens.css            palette, type, motion
    app.css               layout
scripts/extract_resume.py dependency-free PDF/DOCX text extraction
archive/                  an earlier design direction, kept for reference
```
