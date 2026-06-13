import { heroContent } from '../data/homeContent'
import { portraitUrl } from '../lib/heroPortrait'
import SocialLinkButtons from './SocialLinkButtons'

export default function HeroEraStage({ className = '', onViewResume }) {
  return (
    <div className={`hero-era__stage hero-era__stage--editorial ${className}`}>
      <div className="hero-layout hero-layout--editorial">
        <figure className="hero-portrait">
          <div className="hero-portrait__frame">
            <img
              className="hero-portrait__image"
              src={portraitUrl}
              alt={`Portrait of ${heroContent.name}`}
              width={260}
              height={347}
              decoding="async"
              fetchPriority="high"
            />
            <span className="hero-portrait__ring" aria-hidden="true" />
          </div>
        </figure>

        <div className="hero-content">
          <p className="hero-era__eyebrow mb-4 font-medium uppercase">
            {heroContent.eyebrow}
            <span className="hero-era__cursor" aria-hidden="true" />
          </p>
          <h1 className="hero-era__title font-semibold">{heroContent.name}</h1>
          <p className="hero-era__role">{heroContent.role}</p>
          <p className="hero-era__tagline mt-6">{heroContent.tagline}</p>

          <div className="hero-era__actions mt-8 sm:mt-10">
            <div className="hero-era__action-buttons">
              <button
                type="button"
                onClick={onViewResume}
                className="hero-era__btn-primary cursor-pointer rounded-full px-6 py-3 text-sm font-medium transition-colors sm:py-2.5"
              >
                {heroContent.primaryCta.label}
              </button>
              <a
                href="#contact"
                className="hero-era__btn-secondary cursor-pointer rounded-full px-6 py-3 text-sm font-medium transition-colors sm:py-2.5"
              >
                Get in touch
              </a>
            </div>
            <SocialLinkButtons />
          </div>
        </div>
      </div>
    </div>
  )
}
