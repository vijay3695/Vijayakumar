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

## Sharing a resume safely

This repo is **public** and the site is **public**, so treat anything committed
here as world-readable and permanent.

- A file at `public/resume.pdf` is downloadable by anyone at
  `https://vijay3695.github.io/Vijayakumar/resume.pdf`. There is no "hidden" URL.
- Deleting a committed file later does **not** remove it: it stays in git history,
  and in any clone, fork or cache already taken.
- PDF text is fully machine-readable, and search engines plus scrapers harvest
  email addresses and phone numbers from indexed pages and PDFs.
- Nothing client-side can hide data. View-source, DevTools and the network tab
  will always show what the browser received. Any in-page "gate" is bypassable.

**The only real control is what you choose to publish.** The site renders exactly
what is in `src/data/resume.ts` - if a phone number is not there, it is not on the
site.

Recommended flow:

1. Put the raw resume in `private/` (already gitignored - verified with
   `git check-ignore`). It is never committed.
2. Only the fields you approve are copied into `src/data/resume.ts`.
3. A phone number is never needed on a portfolio. Email is enough.
4. If you want a downloadable resume, keep the raw one out of the repo and commit
   a **redacted** copy to `public/resume.pdf` instead - with the phone, home
   address and any ID numbers actually removed (drawing a black box over text
   leaves it extractable).
5. Consider a dedicated address for the public email: scrapers will find and spam
   whatever appears on the page.

If a sensitive file is ever committed by accident, tell me and I will purge it
from history - but never rely on that; forks and third-party caches may persist.

## Deploying (live on GitHub Pages)

The built site is published to the **`gh-pages` branch**, which needs no workflow
file and no extra permissions:

```bash
npm run deploy      # builds, then force-pushes dist/ to gh-pages
```

**One-time step (manual):** GitHub does not let the automation that wrote this
repo enable Pages, so do it once by hand:

> Repo -> **Settings** -> **Pages** -> *Build and deployment* ->
> **Source: Deploy from a branch** -> **Branch: `gh-pages`** -> **/ (root)** -> Save

Your site then lives at:

**https://vijay3695.github.io/Vijayakumar/**

It takes about a minute to go live the first time. Every later `npm run deploy`
updates it within a minute or so (hard-refresh if you see a cached version).

`base: "./"` in `vite.config.ts` keeps asset URLs relative, so the same build
works on the project path above or on a custom domain with no changes.

An equivalent GitHub Actions workflow is kept at `deploy/github-pages.yml` if you
prefer CI-based deploys - move it to `.github/workflows/deploy.yml` to use it.

## Visual checks (how this was actually verified)

`scripts/shoot.mjs` renders the **built** site in headless Chrome, writes nine
screenshots to `.screenshots/`, and prints a DOM audit - font actually loaded,
tiles visible, chrome counts, console errors, failed requests:

```bash
npm run build
npm i -D puppeteer
node scripts/shoot.mjs
```

It serves `dist/` over a local HTTP port because ES modules cannot load from
`file://` (CORS). On a normal machine `npx puppeteer browsers install chrome`
is the only setup needed.

This is not decoration - it caught three bugs that no unit test could see:

- `\u00b7` written inside JSX *text* nodes rendered as the literal characters
  `·` instead of a middot (JSX text does not process escapes)
- the top bar's notification icon froze at `opacity: 0.053` - GSAP left inline
  `opacity`/`transform` behind on completion, pinning the element at its start
  values. Every entrance step now sets `clearProps: "all"`
- on reels taller than the viewport the fixed controls sat directly on body text,
  so the chrome now gets its own gradient scrim, like a video player UI

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
