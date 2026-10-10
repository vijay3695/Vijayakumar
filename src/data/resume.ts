/* ============================================================================
   resume.ts - THE ONLY FILE YOU EDIT FOR CONTENT.

   NOTE: the content below is SAMPLE DATA, written to look like a real
   portfolio so the design can be judged properly. It is NOT real experience.
   Replace it with your own details and then set `site.sampleData = false`
   below to remove the warning banner.
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
  eyebrow: string;
  title: string;
  subtitle?: string;
  meta?: string;
  body: string[];
  bullets?: string[];
  chips?: string[];
  metrics?: Metric[];
  proof?: ProofItem[];
  /** reel backdrop gradient */
  art: string;
  /** short mark shown on the grid tile */
  glyph: string;
};

/** site-level switches */
export const site = {
  /** true while the content below is still sample data */
  sampleData: true
};

export const profile = {
  name: "Vijayakumar",
  handle: "vijayakumar.dev",
  role: "Software Engineer",
  location: "Bengaluru, India",
  email: "hello@vijayakumar.dev",
  available: "Open to senior backend roles",
  bio: [
    "I build backend systems that stay boring under load.",
    "Go, TypeScript and Postgres. Lately: observability and cloud cost.",
    "Previously fintech and logistics."
  ],
  stats: [
    { value: "3", label: "Roles" },
    { value: "6", label: "Years" },
    { value: "12", label: "Projects" }
  ],
  links: [
    { label: "GitHub", href: "https://github.com/vijay3695" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Email", href: "mailto:hello@vijayakumar.dev" }
  ]
};

export const sections: Section[] = [
  {
    id: "about",
    kind: "about",
    highlight: "About",
    eyebrow: "Reel 01 - About",
    title: "Who I am",
    subtitle: "Backend engineer, six years in.",
    body: [
      "I like the unglamorous parts of software: idempotency, retries, migrations that do not page anyone at 3am. Most of my work has been making systems that were fine at 10 requests a second survive 10,000.",
      "I care about systems that can be understood by the person on call, not just the person who wrote them. That usually means fewer moving parts, better logs, and saying no to a clever solution."
    ],
    chips: ["Go", "TypeScript", "Python", "PostgreSQL", "Redis", "Kafka", "Docker", "AWS"],
    art: "linear-gradient(160deg,#101a3a 0%,#1b2a5e 45%,#07080f 100%)",
    glyph: "01"
  },
  {
    id: "exp-razorline",
    kind: "experience",
    highlight: "Razorline",
    eyebrow: "Reel 02 - Experience",
    title: "Senior Software Engineer",
    subtitle: "Razorline Payments",
    meta: "2022 - 2025",
    body: [
      "Owned the ledger and settlement services behind card payments - the path that decides whether a merchant gets paid correctly, once, on time.",
      "The hard part was never the happy path. It was double-charges, partial failures, and reconciliations that had to agree to the paisa."
    ],
    bullets: [
      "Rebuilt settlement as an idempotent, replayable pipeline - cut reconciliation breaks by 94% over two quarters.",
      "Cut p95 ledger write latency from 480ms to 150ms by replacing per-request balance reads with an append-only event log plus a materialised view.",
      "Introduced contract tests between the payment API and three downstream consumers, which removed an entire class of release-day breakage.",
      "Ran the on-call rotation and rewrote the runbooks; median incident acknowledgement dropped from 11 to 3 minutes."
    ],
    metrics: [
      { value: "-69%", label: "p95 latency" },
      { value: "94%", label: "fewer breaks" },
      { value: "99.98%", label: "settlement uptime" }
    ],
    art: "linear-gradient(150deg,#0d2a3a 0%,#12405c 50%,#07080f 100%)",
    glyph: "RL"
  },
  {
    id: "exp-cargofleet",
    kind: "experience",
    highlight: "Cargofleet",
    eyebrow: "Reel 03 - Experience",
    title: "Software Engineer",
    subtitle: "Cargofleet Logistics",
    meta: "2020 - 2022",
    body: [
      "Second engineer on a fleet-tracking product: driver app, ingest pipeline, and the dispatch dashboard operations actually lived in.",
      "Learned here that the cheapest performance win is usually deleting a query, not adding a cache."
    ],
    bullets: [
      "Built the GPS ingest pipeline handling 40k events/minute at peak, with backpressure that degraded gracefully instead of dropping trips.",
      "Replaced a nightly full-table sync with change-data-capture, taking dispatch data staleness from 24 hours to under 5 seconds.",
      "Added route-level tracing, which turned 'dispatch feels slow' into a specific 800ms query in about a week."
    ],
    metrics: [
      { value: "40k", label: "events / min" },
      { value: "<5s", label: "data staleness" },
      { value: "-71%", label: "infra cost" }
    ],
    art: "linear-gradient(150deg,#3a2410 0%,#5c3812 50%,#07080f 100%)",
    glyph: "CF"
  },
  {
    id: "skills",
    kind: "skills",
    highlight: "Skills",
    eyebrow: "Reel 04 - Toolkit",
    title: "What I work with",
    subtitle: "Depth where it counts, honesty about the rest.",
    body: [
      "Strongest in Go and PostgreSQL for backend work, TypeScript when a service needs a face. Comfortable owning a service end to end: schema, API, deploy, dashboard, on-call."
    ],
    chips: [
      "Go", "TypeScript", "Python", "PostgreSQL", "Redis", "Kafka",
      "gRPC", "REST", "Docker", "Kubernetes", "Terraform", "AWS",
      "OpenTelemetry", "Grafana", "GitHub Actions"
    ],
    art: "linear-gradient(150deg,#0f2f1e 0%,#154a2c 50%,#07080f 100%)",
    glyph: "04"
  },
  {
    id: "education",
    kind: "education",
    highlight: "Education",
    eyebrow: "Reel 05 - Education",
    title: "B.E. Computer Science",
    subtitle: "Visvesvaraya Technological University",
    meta: "2016 - 2020",
    body: [
      "Graduated with a focus on distributed systems and databases. Final-year project was a sharded key-value store, which is where I first hit the fun problems around consistency and failure."
    ],
    bullets: [
      "Final-year project: sharded key-value store with a Raft-based replication layer.",
      "Two-time department-level winner, national hackathon finalist 2019."
    ],
    art: "linear-gradient(150deg,#2b1030 0%,#43164a 50%,#07080f 100%)",
    glyph: "ED"
  },
  {
    id: "proof",
    kind: "proof",
    highlight: "Proof",
    eyebrow: "Reel 06 - Proof of work",
    title: "Receipts",
    subtitle: "Claims are cheap. This is the evidence layer.",
    body: [
      "Every line pairs a claim with the artefact that backs it. Open them and check - that is the point."
    ],
    proof: [
      {
        claim: "Idempotent settlement pipeline that survived a 40-minute downstream outage with zero double-payments.",
        artefact: "Post-incident write-up with the replay timeline and reconciliation output.",
        href: "https://github.com/vijay3695"
      },
      {
        claim: "Ledger write path: p95 from 480ms to 150ms, holding at 3x the previous peak throughput.",
        artefact: "Before/after load-test report and the commit that replaced the balance read.",
        href: "https://github.com/vijay3695"
      },
      {
        claim: "GPS ingest at 40k events/min with graceful backpressure instead of dropped trips.",
        artefact: "Public repo with the pipeline and a reproducible load test.",
        href: "https://github.com/vijay3695"
      },
      {
        claim: "This portfolio: React, GSAP Flip and CSS scroll-snap, no UI framework, 87 kB gzipped.",
        artefact: "Source, tests and deploy workflow in this repository.",
        href: "https://github.com/vijay3695/Vijayakumar"
      }
    ],
    art: "linear-gradient(150deg,#2a2a0d 0%,#4a4412 50%,#07080f 100%)",
    glyph: "06"
  },
  {
    id: "contact",
    kind: "contact",
    highlight: "Contact",
    eyebrow: "Reel 07 - Contact",
    title: "Let's talk",
    subtitle: "Open to senior backend and platform roles.",
    body: [
      "Email is best - I usually reply within a day. Happy to talk through any of the work above, including the parts that did not go well."
    ],
    art: "linear-gradient(150deg,#0d2338 0%,#123a5a 50%,#07080f 100%)",
    glyph: "07"
  }
];

/** the shape of the profile block above, for component props */
export type Profile = typeof profile;
