/* ============================================================================
   content.js — THE ONLY FILE YOU NEED TO EDIT TO CHANGE WORDS.
   Everything on the page reads from this object. Replace the PLACEHOLDER
   values with your real details; keep the shape (keys) the same.
   ==========================================================================*/

window.PORTFOLIO_CONTENT = {

  /* ---------------------------------------------------------------- identity */
  identity: {
    name: "Vijayakumar",              // PLACEHOLDER — taken from your repo name
    role: "Software Engineer",
    location: "India",                // PLACEHOLDER
    email: "hello@example.com",       // PLACEHOLDER
    available: "Open to new work"
  },

  links: [
    { label: "GitHub",   href: "https://github.com/vijay3695" },
    { label: "LinkedIn", href: "#" },   // PLACEHOLDER
    { label: "Email",    href: "mailto:hello@example.com" }
  ],

  /* ------------------------------------------------------------------- about */
  about: [
    "PLACEHOLDER — two or three sentences on what you actually do, the kind of problem you like, and the domain you know best. Write it the way you'd say it out loud.",
    "PLACEHOLDER — a second short paragraph: how you work, what you care about in engineering, or the through-line between your projects.",
    "PLACEHOLDER — one line on what you're looking for next."
  ],

  /* ------------------------------------------------------------------- stack */
  stack: [
    { group: "Languages",  items: ["TypeScript", "Python", "Go", "SQL"] },
    { group: "Frontend",   items: ["React", "Next.js", "CSS architecture", "WebGL"] },
    { group: "Backend",    items: ["Node", "PostgreSQL", "Redis", "REST / gRPC"] },
    { group: "Platform",   items: ["Docker", "CI/CD", "AWS", "Observability"] }
  ],

  /* ==========================================================================
     PROJECTS — each one becomes a cinematic chapter.
     `proof` is the evidence list rendered in the Proof of Work section.
     Be specific: numbers, links, and your actual contribution.
     ======================================================================== */
  projects: [
    {
      id: "atlas",
      index: "01",
      title: "Atlas",
      kicker: "PLACEHOLDER — one line, what it is",
      year: "2025",
      role: "PLACEHOLDER — your exact role",
      context: "PLACEHOLDER — team size, timeline, who it was for",
      summary:
        "PLACEHOLDER — the problem in plain language, then what you built and why that approach. Two or three sentences maximum.",
      decisions: [
        "PLACEHOLDER — a real trade-off you made and what you gave up for it.",
        "PLACEHOLDER — something you'd do differently now, and why."
      ],
      metrics: [
        { value: "00%", label: "PLACEHOLDER metric" },
        { value: "0ms", label: "PLACEHOLDER metric" },
        { value: "0k",  label: "PLACEHOLDER metric" }
      ],
      proof: [
        {
          claim: "PLACEHOLDER — a specific claim you're making about this work.",
          artefact: "PLACEHOLDER — the verifiable thing: a live URL, a public commit, a repo, a doc.",
          href: "#",
          kind: "Live"
        },
        {
          claim: "PLACEHOLDER — a second claim, ideally one with a number in it.",
          artefact: "PLACEHOLDER — where I can check this myself.",
          href: "#",
          kind: "Commit"
        }
      ]
    },
    {
      id: "signal",
      index: "02",
      title: "Signal",
      kicker: "PLACEHOLDER — one line, what it is",
      year: "2024",
      role: "PLACEHOLDER — your exact role",
      context: "PLACEHOLDER — team size, timeline, who it was for",
      summary:
        "PLACEHOLDER — problem, approach, outcome. Keep it human, skip the buzzwords.",
      decisions: [
        "PLACEHOLDER — the interesting engineering decision here.",
        "PLACEHOLDER — the thing that was harder than it looked."
      ],
      metrics: [
        { value: "0x",  label: "PLACEHOLDER metric" },
        { value: "00%", label: "PLACEHOLDER metric" },
        { value: "0",   label: "PLACEHOLDER metric" }
      ],
      proof: [
        {
          claim: "PLACEHOLDER — claim with evidence behind it.",
          artefact: "PLACEHOLDER — link, screenshot, or benchmark you can open.",
          href: "#",
          kind: "Live"
        }
      ]
    },
    {
      id: "forge",
      index: "03",
      title: "Forge",
      kicker: "PLACEHOLDER — one line, what it is",
      year: "2024",
      role: "PLACEHOLDER — your exact role",
      context: "PLACEHOLDER — team size, timeline, who it was for",
      summary:
        "PLACEHOLDER — what it does, who it helps, what changed because it exists.",
      decisions: [
        "PLACEHOLDER — an architecture or product call you'd defend."
      ],
      metrics: [
        { value: "0",   label: "PLACEHOLDER metric" },
        { value: "00%", label: "PLACEHOLDER metric" }
      ],
      proof: [
        {
          claim: "PLACEHOLDER — the headline result.",
          artefact: "PLACEHOLDER — the artefact that proves it.",
          href: "#",
          kind: "Repo"
        }
      ]
    }
  ]
};
