import { Link } from 'react-router-dom'
import { projectsContent } from '../data/homeContent'
import HomeSection from './home/HomeSection'
import CardImage from './ui/CardImage'
import { killTeamImageUrl, projectCardArtUrl } from '../lib/cardImages'
import { portfolioImageUrl } from '../lib/assetImages'

const projectCards = [
  {
    slug: 'schema-bridge',
    title: 'Schema Bridge - Agentic Development',
    description:
      'This was made in less than a day. It is a show case of how agentic development can rapidly produce new workflows or features. A simple python pipeline takes three different file export types and standardizes their schema for data migration.',
    tags: ['Human-in-the-loop', 'Python', 'Pydantic', 'Hybrid ETL', 'AI mapping'],
    cta: 'View migration',
    imageSrc: portfolioImageUrl('project-schema-bridge-new.png'),
    imageFallback: projectCardArtUrl({
      title: 'Schema Bridge',
      subtitle: 'Human-in-the-loop migration',
      accent: '#14b8a6',
    }),
  },
  {
    slug: 'ux',
    title: 'UI/UX Improvements - Real Examples',
    description:
      'Since the vast majority of my projects are proprietary projects, I have included interface and experience wins from product work — before/after case studies across checkout, onboarding, data density, errors, and accessibility.',
    tags: [
      'WCAG',
      'Accessibility',
      'Mobile-first',
      'Responsive design',
      'User journey',
      'Flow',
      'Usability',
    ],
    cta: 'View improvements',
    imageSrc: portfolioImageUrl('project-delta-ux-new.png'),
    imageFallback: projectCardArtUrl({
      title: 'UI/UX Improvements',
      subtitle: 'Product experience',
      accent: '#8b5cf6',
    }),
  },
  {
    slug: 'blackfang-campaign',
    title: 'Blackfang Campaign',
    description:
      "This is a hobby project that allows me to stretch my UI/UX skills along with agentic coding and AI. It was created in a weekend using cursor. It's a webapp I'm workshopping for my own use, but I'm happy to share it with you. It is essentially a data repository for a table top game that will eventually allow the creation of custom units, tokens, characters, etc.",
    tags: ['Kill Team', 'React', 'Homebrew'],
    cta: 'Open campaign',
    featured: true,
    imageSrc: killTeamImageUrl('IMP-DW'),
    imageFallback: projectCardArtUrl({
      title: 'Blackfang Campaign',
      subtitle: 'KT24 dataslate repository',
    }),
  },
]

export default function Projects() {
  return (
    <HomeSection
      id="projects"
      eyebrow={projectsContent.eyebrow}
      title={projectsContent.title}
      lead={projectsContent.lead}
    >
      <ul className="projects-grid">
        {projectCards.map((project) => {
          const body = (
            <>
              <CardImage
                src={project.imageSrc}
                fallbackSrc={project.imageFallback}
                alt=""
                aspect="video"
                badge={project.featured ? 'Featured' : undefined}
                className={project.featured ? 'project-card__media' : undefined}
              />
              <div className="project-card__body">
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__description">{project.description}</p>
                <ul className="project-card__tags" aria-label="Technologies">
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <span className="home-tag">{tag}</span>
                    </li>
                  ))}
                </ul>
                {project.slug ? (
                  <span className="home-link-cta project-card__cta">
                    {project.cta ?? 'Open project'}
                    <span aria-hidden="true">→</span>
                  </span>
                ) : (
                  <span className="project-card__cta text-sm text-zinc-500">Coming soon</span>
                )}
              </div>
            </>
          )

          return (
            <li
              key={project.title}
              className={`projects-grid__item${project.featured ? ' projects-grid__item--featured' : ''}`}
            >
              {project.slug ? (
                <Link
                  to={`/projects/${project.slug}`}
                  className={`home-panel home-panel--interactive project-card${project.featured ? ' project-card--featured' : ''}`}
                  aria-label={`${project.title} — ${project.cta ?? 'Open project'}`}
                >
                  {body}
                </Link>
              ) : (
                <div
                  className={`home-panel project-card${project.featured ? ' project-card--featured' : ''}`}
                  aria-disabled="true"
                >
                  {body}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </HomeSection>
  )
}
