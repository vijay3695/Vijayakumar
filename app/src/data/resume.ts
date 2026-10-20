/* ============================================================================
   resume.ts - THE ONLY FILE YOU EDIT FOR CONTENT.

   Resume content is based on the supplied career history. Keep claims grounded in the supplied details.
   ==========================================================================*/

export type Metric = { value: string; label: string };
export type ProofItem = { claim: string; artefact: string; href?: string };
export type Certification = { name: string; issuer: string; year: string };
export type Education = { qualification: string; institution: string; years: string };

export type SectionKind =
  | "about" | "summary" | "experience" | "skills" | "certifications" | "education";

export type Section = {
  id: string;
  kind: SectionKind;
  /** label under the story-highlight bubble */
  highlight: string;
  title: string;
  subtitle?: string;
  meta?: string;
  body: string[];
  bullets?: string[];
  chips?: string[];
  metrics?: Metric[];
  proof?: ProofItem[];
  certs?: Certification[];
  education?: Education[];
  /** reel backdrop gradient */
  art: string;
  /** rgb triple, drives the animated backdrop tint */
  accent: string;
  /** short mark shown on the grid tile */
  glyph: string;
};

/** site-level switches */
export const site = {
  /** true while the content below is still sample data */
  sampleData: false
};

import { avatarImage } from "./avatar";

export const profile = {
  name: "Vijayakumar Chandiran",
  /** display picture - an inlined data URI, so no image file sits on the site */
  avatar: avatarImage,
  handle: "vijayakumar.dev",
  role: "Lead Account Management – Service Delivery Operations",
  location: "Chennai, India",
  available: "Open to leadership opportunities",
  bio: [
    "Operations & Customer Success Leader · 7 years.",
    "I build, mentor and scale high-performing service teams.",
    "Process, people, and the numbers behind both."
  ],
  stats: [
    { value: "4", label: "Career stages" },
    { value: "7", label: "Years of experience" },
    { value: "10", label: "Certifications" }
  ],
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/vijayakumar-chandiran" },
    { label: "GitHub", href: "https://github.com/vijay3695" }
  ]
};

export const sections: Section[] = [
  {
    id: "about",
    kind: "about",
    highlight: "About",
    title: "About me",
    body: [
      "I grew from frontline email support into senior service delivery and people-leadership roles at Sutherland Global Services, building experience across customer support, escalations, coaching, and operations.",
      "My work connects customer experience, client relationships, team development, quality, and operational performance. I use practical root-cause analysis, clear communication, and consistent coaching to help teams deliver reliably.",
      "I studied Computer Science and Engineering and continue to build my toolkit through training in service quality, key account management, analytics, and problem solving."
    ],
    art: "radial-gradient(125% 85% at 18% 2%, rgba(96,124,232,0.32), transparent 62%), radial-gradient(95% 70% at 88% 100%, rgba(120,80,190,0.18), transparent 64%), linear-gradient(180deg,#0B0B13 0%,#06060A 100%)",
    glyph: "01",
    accent: "96,124,232"
  },
  {
    id: "summary",
    kind: "summary",
    highlight: "Summary",
    title: "Professional Summary",
    body: [
      "Results-driven Operations & Customer Success Leader with 7 years of progressive experience in customer service management, process optimization, and people leadership.",
      "Proven ability to build, mentor, and scale high-performing teams, resolve complex client escalations, and implement data-driven strategies that improve efficiency, reduce attrition, and elevate customer satisfaction.",
      "Adept at stakeholder management, workforce planning, and quality assurance. Recognized for driving operational excellence, client retention, and sustainable business growth."
    ],
    art: "radial-gradient(125% 85% at 18% 2%, rgba(110,96,220,0.30), transparent 62%), radial-gradient(95% 70% at 88% 100%, rgba(70,110,200,0.16), transparent 64%), linear-gradient(180deg,#0B0B13 0%,#06060A 100%)",
    glyph: "02",
    accent: "120,104,224"
  },
  {
    id: "competencies",
    kind: "skills",
    highlight: "Competencies",
    title: "Core Competencies",
    body: [],
    chips: [
      "Customer Experience Management",
      "Service Delivery & Operations",
      "Client Engagement",
      "Process Improvement & Root Cause Analysis",
      "Team Leadership",
      "Coaching & Mentoring",
      "Workforce Planning & Scheduling",
      "Escalation & Conflict Resolution",
      "Performance Analytics & Reporting",
      "Quality Assurance & Compliance",
      "Attrition & Retention Strategies"
    ],
    art: "radial-gradient(125% 85% at 18% 2%, rgba(58,168,150,0.26), transparent 62%), radial-gradient(95% 70% at 88% 100%, rgba(70,120,190,0.14), transparent 64%), linear-gradient(180deg,#0B0B13 0%,#06060A 100%)",
    glyph: "03",
    accent: "58,168,150"
  },
  {
    id: "exp-team-manager",
    kind: "experience",
    highlight: "Team Manager",
    title: "Team Manager",
    subtitle: "Sutherland Global Services",
    meta: "2023 – 2025 - December",
    body: [],
    bullets: [
      "Led a 25-member customer support team, ensuring SLA, AHT and CSAT targets are consistently met.",
      "Implemented retention strategies that reduced team attrition.",
      "Conducted weekly RCA and performance reviews, driving improvements in customer satisfaction.",
      "Handled escalated client issues with a high resolution rate within SLA.",
      "Designed and delivered refresher training programs, improving agent accuracy and compliance.",
      "Prepared and presented monthly operational dashboards to leadership with insights on attrition, quality and customer feedback.",
      "Directed daily remote operations and virtual team engagement, using collaboration tools to sustain high productivity and team cohesion."
    ],
    metrics: [{ value: "25", label: "Team members" }],
    art: "radial-gradient(125% 85% at 18% 2%, rgba(72,132,220,0.30), transparent 62%), radial-gradient(95% 70% at 88% 100%, rgba(60,90,180,0.16), transparent 64%), linear-gradient(180deg,#0B0B13 0%,#06060A 100%)",
    glyph: "TM",
    accent: "72,132,220"
  },
  {
    id: "exp-team-leader",
    kind: "experience",
    highlight: "Team Leader",
    title: "Team Leader",
    subtitle: "Sutherland Global Services",
    meta: "2021 - 2023",
    body: [],
    bullets: [
      "Supervised a 30-member support team, driving adherence to SLA and KPI benchmarks.",
      "Conducted root cause analysis and implemented corrective measures, reducing process errors.",
      "Mentored and coached team members, improving employee engagement and performance.",
      "Partnered with cross-functional teams to align service delivery with client requirements.",
      "Supported a remote team through continuous virtual engagement, fostering a collaborative work environment that drove daily productivity."
    ],
    metrics: [{ value: "30", label: "Team members" }],
    art: "radial-gradient(125% 85% at 18% 2%, rgba(206,142,72,0.26), transparent 62%), radial-gradient(95% 70% at 88% 100%, rgba(150,90,60,0.14), transparent 64%), linear-gradient(180deg,#0B0B13 0%,#06060A 100%)",
    glyph: "TL",
    accent: "206,142,72"
  },
  {
    id: "exp-senior-csa",
    kind: "experience",
    highlight: "Senior CSA",
    title: "Senior Customer Support Associate",
    subtitle: "Sutherland Global Services",
    meta: "2019 - 2021",
    body: [],
    bullets: [
      "Managed client escalations, ensuring satisfaction and retention of key accounts.",
      "Trained and onboarded new hires, accelerating ramp-up time.",
      "Provided daily performance insights to supervisors for better decision-making."
    ],
    art: "radial-gradient(125% 85% at 18% 2%, rgba(150,96,210,0.28), transparent 62%), radial-gradient(95% 70% at 88% 100%, rgba(100,70,170,0.15), transparent 64%), linear-gradient(180deg,#0B0B13 0%,#06060A 100%)",
    glyph: "SC",
    accent: "150,96,210"
  },
  {
    id: "exp-csa",
    kind: "experience",
    highlight: "CSA",
    title: "Customer Support Associate",
    subtitle: "Sutherland Global Services",
    meta: "December 2018 – 2019",
    body: [],
    bullets: [
      "Delivered frontline customer support via email for technical and business issues.",
      "Collaborated with technical teams to resolve bugs and errors, ensuring first-contact resolution.",
      "Handled multiple front-end and back-end systems to support client operations."
    ],
    art: "radial-gradient(125% 85% at 18% 2%, rgba(180,150,90,0.22), transparent 62%), radial-gradient(95% 70% at 88% 100%, rgba(120,110,70,0.13), transparent 64%), linear-gradient(180deg,#0B0B13 0%,#06060A 100%)",
    glyph: "CS",
    accent: "180,150,90"
  },
  {
    id: "certifications",
    kind: "certifications",
    highlight: "Certifications",
    title: "Certifications",
    body: [],
    certs: [
      { name: "Six Sigma Black Belt", issuer: "LinkedIn", year: "2025" },
      { name: "Key Account Management", issuer: "LinkedIn", year: "2025" },
      { name: "Root Cause Analysis", issuer: "Skillsoft", year: "2024" },
      { name: "Talent Acquisition Journey", issuer: "Skillsoft", year: "2024" },
      { name: "Problem Solving & Decision Making", issuer: "Skillsoft", year: "2024" },
      { name: "Machine Learning & Data Analytics", issuer: "Skillsoft", year: "2024" },
      { name: "Data Analytics for Managers", issuer: "Skillsoft", year: "2024" },
      { name: "Quality Management", issuer: "Sutherland Learning", year: "2025" },
      { name: "Diversity & Inclusion", issuer: "Skillsoft", year: "2024" },
      { name: "Microsoft Excel", issuer: "Skillsoft", year: "2025" }
    ],
    art: "radial-gradient(125% 85% at 18% 2%, rgba(70,140,190,0.28), transparent 62%), radial-gradient(95% 70% at 88% 100%, rgba(60,110,170,0.15), transparent 64%), linear-gradient(180deg,#0B0B13 0%,#06060A 100%)",
    glyph: "08",
    accent: "70,140,190"
  },
  {
    id: "education",
    kind: "education",
    highlight: "Education",
    title: "Education",
    body: [],
    education: [
      {
        qualification: "B.E. Computer Science and Engineering",
        institution: "Madha Engineering College",
        years: "2014 - 2018"
      },
      {
        qualification: "HSC, Biology",
        institution: "St. Vincent's MHSS",
        years: "2012 - 2014"
      }
    ],
    art: "radial-gradient(125% 85% at 18% 2%, rgba(60,150,160,0.26), transparent 62%), radial-gradient(95% 70% at 88% 100%, rgba(50,110,150,0.14), transparent 64%), linear-gradient(180deg,#0B0B13 0%,#06060A 100%)",
    glyph: "ED",
    accent: "60,150,160"
  }
];

/** the shape of the profile block above, for component props */
export type Profile = typeof profile;
