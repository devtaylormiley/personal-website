import { Link } from 'react-router-dom'
import { aboutContent } from '../data/homeContent'
import HomeSection from './home/HomeSection'

export default function About() {
  return (
    <HomeSection
      id="about"
      eyebrow={aboutContent.eyebrow}
      title={aboutContent.title}
      lead={aboutContent.lead}
    >
      <div className="about-grid">
        <div className="about-story">
          {aboutContent.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <ul className="about-pillars">
          {aboutContent.pillars.map((pillar) => (
            <li key={pillar.title}>
              <Link to={pillar.href} className="home-panel home-panel--interactive about-pillar">
                <p className="about-pillar__title">{pillar.title}</p>
                <p className="about-pillar__description">{pillar.description}</p>
                <span className="home-link-cta mt-3">
                  View project
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <ul className="about-highlights">
        {aboutContent.highlights.map(({ label, value }) => (
          <li key={label} className="home-panel about-highlight">
            <p className="about-highlight__label">{label}</p>
            <p className="about-highlight__value">{value}</p>
          </li>
        ))}
      </ul>
    </HomeSection>
  )
}
