import { resumeContent } from '../data/resumeContent'
import { portraitUrl } from '../lib/heroPortrait'

export default function ResumeDocument({ variant = 'page', id, onBack }) {
  const { name, title, contact, summary, experience, education, skills } = resumeContent
  const embedded = variant === 'embed'

  function downloadPdf() {
    window.print()
  }

  return (
    <article
      id={id}
      className={`page-resume scroll-mt-20 pb-16 sm:pb-20 ${
        embedded
          ? 'page-resume--embed pt-[calc(var(--site-navbar-height)+env(safe-area-inset-top,0px)+1.25rem)]'
          : 'pt-24 sm:pt-28'
      }`}
    >
      <div className="page-resume__inner">
        <div className="page-resume__toolbar">
          {embedded && onBack ? (
            <button type="button" className="page-resume__back-btn" onClick={onBack}>
              Back to intro
            </button>
          ) : (
            <nav className="page-resume__breadcrumb text-sm text-zinc-400" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <a href="/" className="transition-colors hover:text-violet-300">
                    Home
                  </a>
                </li>
                <li aria-hidden="true" className="text-zinc-600">
                  /
                </li>
                <li className="text-zinc-200">Resume</li>
              </ol>
            </nav>
          )}

          <button type="button" className="page-resume__export-btn" onClick={downloadPdf}>
            Download PDF
          </button>
        </div>

        <div className="page-resume__document">
          <header className="page-resume__header">
            <div className="page-resume__portrait-wrap">
              <img
                src={portraitUrl}
                alt={`Portrait of ${name}`}
                className="page-resume__portrait"
                width={320}
                height={320}
                decoding="async"
              />
            </div>

            <div className="page-resume__identity">
              <p className="page-resume__eyebrow">Resume</p>
              <h1 className="page-resume__name">{name}</h1>
              <p className="page-resume__title">{title}</p>

              <ul className="page-resume__contact">
                <li>
                  <a href={`https://${contact.website}`} rel="noopener noreferrer">
                    {contact.website}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </li>
                <li>
                  <a href={`tel:${contact.phone.replace(/\D/g, '')}`}>{contact.phone}</a>
                </li>
                <li>
                  <span>{contact.location}</span>
                </li>
              </ul>
            </div>
          </header>

          <section className="page-resume__section" aria-labelledby="resume-skills">
            <h2 id="resume-skills" className="page-resume__section-title">
              Skills
            </h2>
            <ul className="page-resume__skills" aria-label="Technical skills">
              {skills.map((skill) => (
                <li key={skill} className="page-resume__skill">
                  {skill}
                </li>
              ))}
            </ul>
          </section>

          <section className="page-resume__section" aria-labelledby="resume-summary">
            <h2 id="resume-summary" className="page-resume__section-title">
              Summary
            </h2>
            <p className="page-resume__summary">{summary}</p>
          </section>

          <section className="page-resume__section" aria-labelledby="resume-experience">
            <h2 id="resume-experience" className="page-resume__section-title">
              Work Experience
            </h2>
            <ol className="page-resume__jobs">
              {experience.map((job) => (
                <li key={job.id} className="page-resume__job">
                  <div className="page-resume__job-head">
                    <div className="page-resume__job-title-block">
                      <h3 className="page-resume__job-role">{job.role}</h3>
                      <p className="page-resume__job-company">
                        {job.company}
                        <span className="page-resume__job-location"> · {job.location}</span>
                      </p>
                    </div>
                    <time className="page-resume__job-dates" dateTime={job.dates}>
                      {job.dates}
                    </time>
                  </div>
                  {job.intro ? <p className="page-resume__job-intro">{job.intro}</p> : null}
                  <ul className="page-resume__job-highlights">
                    {job.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          <section className="page-resume__section" aria-labelledby="resume-education">
            <h2 id="resume-education" className="page-resume__section-title">
              Education
            </h2>
            <ul className="page-resume__education">
              {education.map((entry) => (
                <li key={`${entry.degree}-${entry.dates}`} className="page-resume__education-item">
                  <div className="page-resume__education-head">
                    <h3 className="page-resume__education-degree">{entry.degree}</h3>
                    <time className="page-resume__education-dates" dateTime={entry.dates}>
                      {entry.dates}
                    </time>
                  </div>
                  <p className="page-resume__education-school">
                    {entry.school}
                    <span className="page-resume__education-location"> · {entry.location}</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  )
}
