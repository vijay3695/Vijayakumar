import { useState } from "react";
import { profile, sections, type Section } from "./data/resume";
import "./styles/resume-portfolio.css";

function ResumeSection({ section, number }: { section: Section; number: string }) {
  return (
    <section className={"resume-section resume-section--" + section.kind} id={section.id}>
      <div className="resume-section__index">{number}</div>
      <div className="resume-section__body">
        <div className="resume-section__heading">
          <h2>{section.title}</h2>
          {section.meta && <span className="resume-date">{section.meta}</span>}
        </div>
        {section.subtitle && <p className="resume-company">{section.subtitle}</p>}
        {section.body.map((paragraph) => <p className="resume-paragraph" key={paragraph}>{paragraph}</p>)}
        {section.bullets && <ul className="resume-bullets">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
        {section.chips && <ul className="resume-skills">{section.chips.map((skill) => <li key={skill}>{skill}</li>)}</ul>}
        {section.metrics && <div className="resume-metrics">{section.metrics.map((metric) => <p key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></p>)}</div>}
        {section.certs && <ol className="resume-record-list">{section.certs.map((cert) => <li key={cert.name}><span>{cert.name}</span><small>{cert.issuer}</small><time>{cert.year}</time></li>)}</ol>}
        {section.education && <ol className="resume-record-list resume-record-list--education">{section.education.map((item) => <li key={item.qualification}><span>{item.qualification}</span><small>{item.institution}</small><time>{item.years}</time></li>)}</ol>}
      </div>
    </section>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const experience = sections.filter((section) => section.kind === "experience");
  const about = sections.find((section) => section.id === "about");
  const summary = sections.find((section) => section.id === "summary");
  const competencies = sections.find((section) => section.id === "competencies");
  const certifications = sections.find((section) => section.id === "certifications");
  const education = sections.find((section) => section.id === "education");
  const navItems = [
    { id: "about", label: "About" },
    { id: "summary", label: "Summary" },
    { id: "experience", label: "Experience" },
    { id: "competencies", label: "Expertise" },
    { id: "certifications", label: "Certifications" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact" }
  ];
  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };
  const printResume = () => window.print();

  return (
    <main className="resume-site">
      <header className="resume-topbar">
        <a className="resume-mark" href="#top" aria-label="Back to top">VC<span>®</span></a>
        <span className="resume-topbar__label">CURRICULUM VITAE <i>·</i> 2026</span>
        <button className="resume-menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">{menuOpen ? "CLOSE −" : "MENU +"}</button>
        <nav className={"resume-topnav" + (menuOpen ? " is-open" : "")} aria-label="Resume sections">
          {navItems.map((item) => <button key={item.id} type="button" onClick={() => scrollTo(item.id)}>{item.label}</button>)}
        </nav>
      </header>

      <div className="resume-layout" id="top">
        <aside className="resume-sidebar">
          <p className="resume-kicker"><span className="resume-status-dot" /> OPEN TO LEADERSHIP OPPORTUNITIES</p>
          <h1>{profile.name}<span>.</span></h1>
          <p className="resume-role">{profile.role}</p>
          <p className="resume-location">{profile.location} <span>/</span> India</p>
          <div className="resume-sidebar__rule" />
          <p className="resume-sidebar__intro">People, process, and the numbers behind both.</p>
          <p className="resume-sidebar__copy">A service-delivery and customer-success leader with progressive experience from frontline support to managing teams, client escalations, performance, and operational improvement.</p>
          <div className="resume-statline"><strong>07<span>+</span></strong><small>YEARS IN SERVICE<br />& OPERATIONS</small></div>
          <div className="resume-sidebar__actions">
            <button type="button" className="resume-button resume-button--light" onClick={printResume}>PRINT / SAVE PDF <span>↗</span></button>
            {profile.links.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label} <span>↗</span></a>)}
          </div>
          <p className="resume-sidebar__foot">CHENNAI, INDIA<br />BUILT AROUND EXPERIENCE</p>
        </aside>

        <div className="resume-main">
          <section className="resume-hero" aria-labelledby="hero-title">
            <div className="resume-hero__meta"><span>PROFILE / 001</span><span>OPERATIONS · PEOPLE · CX</span></div>
            <h2 id="hero-title">Making service<br />work <em>better.</em></h2>
            <p>Customer experience. Service delivery. People leadership. Practical process improvement.</p>
            <button type="button" className="resume-text-link" onClick={() => scrollTo("experience")}>EXPLORE EXPERIENCE <span>↓</span></button>
            <div className="resume-hero__bottom"><span>SCROLL TO EXPLORE</span><span>01 — 07</span></div>
          </section>

          {about && <ResumeSection section={about} number="01" />}
          {summary && <ResumeSection section={summary} number="02" />}

          <section className="resume-section resume-section--experience" id="experience">
            <div className="resume-section__index">03</div>
            <div className="resume-section__body">
              <div className="resume-section__heading"><h2>Experience</h2><span className="resume-date">2018 — 2025</span></div>
              <p className="resume-section__lede">Progressive responsibility across frontline support, escalations, team leadership, and service delivery management.</p>
              <div className="resume-career-line">
                {experience.map((section) => (
                  <article className="resume-job" key={section.id}>
                    <div className="resume-job__top"><span>{section.meta}</span>{section.metrics?.map((metric) => <span className="resume-job__metric" key={metric.label}>{metric.value} {metric.label}</span>)}</div>
                    <h3>{section.title}</h3>
                    <p className="resume-company">{section.subtitle}</p>
                    {section.bullets && <ul className="resume-bullets">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                  </article>
                ))}
              </div>
            </div>
          </section>

          {competencies && <ResumeSection section={competencies} number="04" />}
          {certifications && <ResumeSection section={certifications} number="05" />}
          {education && <ResumeSection section={education} number="06" />}

          <section className="resume-contact" id="contact">
            <div className="resume-section__index">07</div>
            <div className="resume-contact__body">
              <p className="resume-mono-label">HAVE A ROLE IN MIND?</p>
              <h2>Let’s talk<br /><em>about what’s next.</em></h2>
              <p>For opportunities in team leadership, service delivery, customer success, and operations.</p>
              <div className="resume-contact__links">{profile.links.map((link) => <a href={link.href} key={link.label} target="_blank" rel="noreferrer">{link.label} <span>↗</span></a>)}</div>
            </div>
          </section>
          <footer className="resume-footer"><span>VIJAYAKUMAR CHANDIRAN</span><span>CURRICULUM VITAE · 2026</span><button type="button" onClick={printResume}>PRINT / SAVE PDF ↑</button></footer>
        </div>
      </div>
    </main>
  );
}
