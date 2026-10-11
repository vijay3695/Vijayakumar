/* ============================================================================
   resume.ts - THE ONLY FILE YOU EDIT FOR CONTENT.

   NOTE: the content below is SAMPLE DATA, written to look like a real
   portfolio so the design can be judged properly. It is NOT real experience.
   Replace it with your own details and then set `site.sampleData = false`
   below to remove the warning banner.
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
  eyebrow: string;
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
  /** short mark shown on the grid tile */
  glyph: string;
};

/** site-level switches */
export const site = {
  /** true while the content below is still sample data */
  sampleData: true
};

import { avatarImage } from "./avatar";

export const profile = {
  name: "Vijayakumar Chandiran",
  /** display picture - an inlined data URI, so no image file sits on the site */
  avatar: avatarImage,
  handle: "vijayakumar.dev",
  role: "Lead – Service Delivery Operations",
  location: "Chennai, India",
  available: "Open to senior backend roles",
  bio: [
    "Operations & Customer Success Leader · 7 years.",
    "I build, mentor and scale high-performing service teams.",
    "Process, people, and the numbers behind both."
  ],
  stats: [
    { value: "3", label: "Roles" },
    { value: "7", label: "Years" },
    { value: "12", label: "Projects" }
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
    eyebrow: "Reel 01 - About",
    title: "About me",
    body: [],
    art: "linear-gradient(160deg,#101a3a 0%,#1b2a5e 45%,#07080f 100%)",
    glyph: "01"
  },
  {
    id: "summary",
    kind: "summary",
    highlight: "Summary",
    eyebrow: "Reel 02 - Professional Summary",
    title: "Professional Summary",
    body: [
      "Results-driven Operations & Customer Success Leader with 7 years of progressive experience in customer service management, process optimization, and people leadership.",
      "Proven ability to build, mentor, and scale high-performing teams, resolve complex client escalations, and implement data-driven strategies that improve efficiency, reduce attrition, and elevate customer satisfaction.",
      "Adept at stakeholder management, workforce planning, and quality assurance. Recognized for driving operational excellence, client retention, and sustainable business growth."
    ],
    art: "linear-gradient(160deg,#1a1030 0%,#2b1245 45%,#07080f 100%)",
    glyph: "02"
  },
  {
    id: "competencies",
    kind: "skills",
    highlight: "Competencies",
    eyebrow: "Reel 03 - Core Competencies",
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
    art: "linear-gradient(150deg,#0f2f1e 0%,#154a2c 50%,#07080f 100%)",
    glyph: "03"
  },
  {
    id: "exp-team-manager",
    kind: "experience",
    highlight: "Team Manager",
    eyebrow: "Reel 04 - Professional Experience",
    title: "Team Manager",
    subtitle: "Sutherland Global Services",
    meta: "2023 - Dec 2025",
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
    art: "linear-gradient(150deg,#0d2a3a 0%,#12405c 50%,#07080f 100%)",
    glyph: "TM"
  },
  {
    id: "exp-team-leader",
    kind: "experience",
    highlight: "Team Leader",
    eyebrow: "Reel 05 - Professional Experience",
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
    art: "linear-gradient(150deg,#3a2410 0%,#5c3812 50%,#07080f 100%)",
    glyph: "TL"
  },
  {
    id: "exp-senior-csa",
    kind: "experience",
    highlight: "Senior CSA",
    eyebrow: "Reel 06 - Professional Experience",
    title: "Senior Customer Support Associate",
    subtitle: "Sutherland Global Services",
    meta: "2019 - 2021",
    body: [],
    bullets: [
      "Managed client escalations, ensuring satisfaction and retention of key accounts.",
      "Trained and onboarded new hires, accelerating ramp-up time.",
      "Provided daily performance insights to supervisors for better decision-making."
    ],
    art: "linear-gradient(150deg,#2b1030 0%,#43164a 50%,#07080f 100%)",
    glyph: "SC"
  },
  {
    id: "exp-csa",
    kind: "experience",
    highlight: "CSA",
    eyebrow: "Reel 07 - Professional Experience",
    title: "Customer Support Associate",
    subtitle: "Sutherland Global Services",
    meta: "2018 - 2019",
    body: [],
    bullets: [
      "Delivered frontline customer support via email for technical and business issues.",
      "Collaborated with technical teams to resolve bugs and errors, ensuring first-contact resolution.",
      "Handled multiple front-end and back-end systems to support client operations."
    ],
    art: "linear-gradient(150deg,#2a2a0d 0%,#4a4412 50%,#07080f 100%)",
    glyph: "CS"
  },
  {
    id: "certifications",
    kind: "certifications",
    highlight: "Certifications",
    eyebrow: "Reel 08 - Certifications",
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
    art: "linear-gradient(150deg,#0d2338 0%,#123a5a 50%,#07080f 100%)",
    glyph: "08"
  },
  {
    id: "education",
    kind: "education",
    highlight: "Education",
    eyebrow: "Reel 09 - Education",
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
    art: "linear-gradient(150deg,#0c2b2b 0%,#12504a 50%,#07080f 100%)",
    glyph: "ED"
  }
];

/** the shape of the profile block above, for component props */
export type Profile = typeof profile;
