/* ============================================================================
   resume.ts - THE ONLY FILE YOU EDIT FOR CONTENT.
   Every PLACEHOLDER below gets replaced with your real details once the PDF
   lands. Structure it as data and the whole UI (profile, grid, reels,
   highlights, skills, proof) rebuilds itself.
   ==========================================================================*/

export type Metric = { value: string; label: string };
export type ProofItem = { claim: string; artefact: string; href?: string };

export type SectionKind =
  | "about" | "experience" | "skills" | "education" | "proof" | "contact";

export type Section = {
  id: string;
  kind: SectionKind;
  /** label under the story-highlight bubble */
  highlight: string;
  /** small mono line above the title */
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** right-aligned meta in the reel header, e.g. a date range */
  meta?: string;
  body: string[];
  bullets?: string[];
  chips?: string[];
  metrics?: Metric[];
  proof?: ProofItem[];
  /** reel backdrop gradient */
  art: string;
  /** short glyph on the grid tile */
  glyph: string;
};

export const profile = {
  name: "Vijayakumar",
  handle: "vijayakumar",
  role: "Software Engineer",
  location: "India",
  email: "hello@example.com",
  available: "Open to new work",
  /** shown as the Instagram-style bio */
  bio: [
    "PLACEHOLDER - one line on what you build.",
    "PLACEHOLDER - a second line: stack, domain, or a number that matters.",
    "PLACEHOLDER - what you are looking for next."
  ],
  /** repurposed Instagram stat row */
  stats: [
    { value: "3", label: "Roles" },
    { value: "6+", label: "Years" },
    { value: "12", label: "Projects" }
  ],
  links: [
    { label: "GitHub", href: "https://github.com/vijay3695" },
    { label: "LinkedIn", href: "#" },
    { label: "Email", href: "mailto:hello@example.com" }
  ]
};

export const sections: Section[] = [
  {
    id: "about",
    kind: "about",
    highlight: "About",
    eyebrow: "Reel 01",
    title: "Who I am",
    subtitle: "PLACEHOLDER - a one-line summary of you as an engineer.",
    body: [
      "PLACEHOLDER - what you actually do, in your own words. Two or three sentences.",
      "PLACEHOLDER - the through-line between your work: what problem keeps pulling you back."
    ],
    chips: ["TypeScript", "Python", "Go", "PostgreSQL", "React", "AWS"],
    art: "linear-gradient(160deg,#1a1030 0%,#2b1245 45%,#0b0b12 100%)",
    glyph: "01"
  },
  {
    id: "exp-acme",
    kind: "experience",
    highlight: "Acme",
    eyebrow: "Reel 02 - Experience",
    title: "Senior Software Engineer",
    subtitle: "Acme Corp",
    meta: "2022 - 2025",
    body: [
      "PLACEHOLDER - what the team owned and what you were responsible for.",
      "PLACEHOLDER - the most interesting problem you solved there."
    ],
    bullets: [
      "PLACEHOLDER - a concrete thing you built and its measured effect.",
      "PLACEHOLDER - a trade-off you made and what it bought you.",
      "PLACEHOLDER - something you led or mentored."
    ],
    metrics: [
      { value: "-68%", label: "p95 latency" },
      { value: "3x", label: "deploy frequency" },
      { value: "99.98%", label: "uptime" }
    ],
    art: "linear-gradient(150deg,#0d2a3a 0%,#123a52 50%,#0b0b12 100%)",
    glyph: "AC"
  },
  {
    id: "exp-orbit",
    kind: "experience",
    highlight: "Orbit",
    eyebrow: "Reel 03 - Experience",
    title: "Software Engineer",
    subtitle: "Orbit Labs",
    meta: "2020 - 2022",
    body: [
      "PLACEHOLDER - the product, the users, and your part in it.",
      "PLACEHOLDER - how you grew or what you learned here."
    ],
    bullets: [
      "PLACEHOLDER - an outcome with a number attached.",
      "PLACEHOLDER - a system you designed or refactored."
    ],
    metrics: [
      { value: "40%", label: "fewer incidents" },
      { value: "2.5x", label: "throughput" }
    ],
    art: "linear-gradient(150deg,#3a1d0d 0%,#5a2a12 50%,#0b0b12 100%)",
    glyph: "OR"
  },
  {
    id: "skills",
    kind: "skills",
    highlight: "Skills",
    eyebrow: "Reel 04 - Toolkit",
    title: "What I work with",
    subtitle: "PLACEHOLDER - honest depth, not a wishlist.",
    body: [
      "PLACEHOLDER - how you choose tools, and where you are strongest."
    ],
    chips: [
      "TypeScript", "React", "Node", "Python", "Go", "PostgreSQL", "Redis",
      "Docker", "CI/CD", "AWS", "GraphQL", "Observability"
    ],
    art: "linear-gradient(150deg,#0f2f1e 0%,#154a2c 50%,#0b0b12 100%)",
    glyph: "04"
  },
  {
    id: "education",
    kind: "education",
    highlight: "Education",
    eyebrow: "Reel 05 - Education",
    title: "PLACEHOLDER - Degree",
    subtitle: "PLACEHOLDER - Institution",
    meta: "PLACEHOLDER - years",
    body: [
      "PLACEHOLDER - what you studied and anything worth highlighting."
    ],
    bullets: [
      "PLACEHOLDER - a relevant project, award, or result."
    ],
    art: "linear-gradient(150deg,#2b1030 0%,#43164a 50%,#0b0b12 100%)",
    glyph: "ED"
  },
  {
    id: "proof",
    kind: "proof",
    highlight: "Proof",
    eyebrow: "Reel 06 - Proof of work",
    title: "Receipts",
    subtitle: "Claims are cheap. Here is the evidence.",
    body: [
      "Each line is a claim paired with the artefact that backs it - open them and check."
    ],
    proof: [
      {
        claim: "PLACEHOLDER - a specific claim about your work.",
        artefact: "PLACEHOLDER - live URL, public repo, or commit.",
        href: "https://github.com/vijay3695"
      },
      {
        claim: "PLACEHOLDER - a second claim, ideally with a number.",
        artefact: "PLACEHOLDER - where it can be verified.",
        href: "https://github.com/vijay3695"
      },
      {
        claim: "PLACEHOLDER - a third claim.",
        artefact: "PLACEHOLDER - the artefact."
      }
    ],
    art: "linear-gradient(150deg,#2a2a0d 0%,#4a4412 50%,#0b0b12 100%)",
    glyph: "06"
  },
  {
    id: "contact",
    kind: "contact",
    highlight: "Contact",
    eyebrow: "Reel 07 - Contact",
    title: "Let's talk",
    subtitle: "PLACEHOLDER - what you are open to.",
    body: [
      "PLACEHOLDER - the best way to reach you and how fast you reply."
    ],
    art: "linear-gradient(150deg,#0d2338 0%,#123a5a 50%,#0b0b12 100%)",
    glyph: "07"
  }
];

/** the shape of the profile block above, for component props */
export type Profile = typeof profile;
