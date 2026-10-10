# Portfolio — Design Directions

Status: **awaiting your pick.** Visual direction is independent of your resume's
content, so we can lock the style now and pour your details in after.

## What "unique" must not cost you
Non-negotiables I'll hold in every direction:

- Loads fast on a phone on 4G — no 5MB hero video, no scroll-jacking
- Body text stays readable and keyboard-navigable; core content works without JS
- Unique in **composition and interaction**, not just in colour
- You can edit words without touching markup (one `content.json`)

## 1. KINETIC EDITORIAL (Swiss-brutalist)
Vibe: a design magazine caught mid-layout.
- **Type** one grotesque at 12–18vw, tracking -0.04em, headlines bleeding past the
  grid edge on purpose
- **Grid** 12-col, then deliberately broken: section numerals, hairline rules, marginalia
- **Colour** paper `#F4F1EA` + true black + ONE acid accent (`#D6FF3F`)
- **Motion** horizontal project rail, masked line-by-line reveals, marquee ticker
- **Proof of work** a "Receipts" spread — projects annotated in the margin with
  metric, stack, and my exact role, like an editor's marks
- **Risk** low. Confident, not gimmicky. Ages well.
- **Best for** any discipline

## 2. TERMINAL / PERSONAL ARCHIVE
Vibe: developer-native. The site *is* an archive you browse.
- **Type** monospace throughout; no colour except terminal accents
- **Interface** project index rendered like `ls -la`, a ⌘K command palette to jump
  anywhere, blinking caret, real keyboard shortcuts
- **Structure** ASCII dividers, records with IDs
- **Proof of work** each record opens a diff-style view: problem → what I changed →
  measured result, with a link to the live repo/commit
- **Risk** medium — must resist cosplay; content has to be genuinely technical
- **Best for** engineers, infra, security

## 3. CINEMATIC SCROLL CHAPTERS
Vibe: agency-grade, filmic.
- **Structure** dark full-viewport chapters, sticky imagery, scroll-driven transitions
- **Texture** film grain overlay + subtle canvas/WebGL gradient light (no heavy 3D)
- **Type** wide display for titles, small mono for metadata
- **Proof of work** an end-of-chapter "evidence strip": screenshot, metric, quote, link
- **Risk** medium-high (perf + motion sickness) — ships with a
  `prefers-reduced-motion` fallback
- **Best for** product/frontend, design engineers

## 4. BLUEPRINT SCHEMATIC
Vibe: technical drawing / engineering dossier.
- **Canvas** grid-paper background, drafting blue + white inks
- **Treatment** every project annotated — callout lines, measurement ticks, part labels
- **Type** mono labels, orthographic/isometric diagrams
- **Proof of work** this *is* the aesthetic: architecture decisions, before/after
  diagrams, test output shown as "inspection stamps"
- **Risk** low-medium; needs real diagrams to shine
- **Best for** backend/systems, hardware, data

## 5. VARIABLE-TYPE PLAYGROUND
Vibe: playful, tactile, motion-first.
- **Type** one variable font; weight/width axes morph on hover and scroll
- **Interaction** cursor-reactive type, marquee, magnetic links
- **Proof of work** interactive case cards that expand into full detail
- **Risk** high gimmick risk — best "wow", weakest for reading long case studies
- **Best for** creative dev, front-end, motion

## Cross-cutting: the Proof of Work section
You asked for this explicitly, so it's a first-class page in **every** direction.
Per project: the problem, my specific contribution, the stack, a **verifiable**
artefact (live link, public repo or commit, screenshot), the measurable outcome,
and what I'd do differently. No vague "responsible for" bullets.

## Resume formats that work here (verified)
I confirmed the sandbox has no PDF/DOCX library and `pip` is network-blocked, so I
wrote my own extractors:

- ✅ `.pdf` — inflate the compressed text streams, pull text operators
- ✅ `.docx` — unzip and strip the document XML
- ✅ `.txt` / `.md` — direct
- ✅ `.png` / `.jpg` — a screenshot works, I can read images
- ⚠️ Scanned/image-only PDFs won't extract — send a screenshot instead
