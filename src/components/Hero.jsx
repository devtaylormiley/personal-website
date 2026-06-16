import HeroEraStage from './HeroEraStage'
import { heroContent } from '../data/homeContent'

export default function Hero({ resumeOpen = false, onToggleResume }) {
  const { scrollCue } = heroContent

  return (
    <section
      id="hero"
      className="home-hero relative flex min-h-[100svh] flex-col px-4 sm:px-6"
    >
      <HeroEraStage resumeOpen={resumeOpen} onToggleResume={onToggleResume} />

      {!resumeOpen ? (
        <a href={scrollCue.href} className="hero-scroll-cue">
          <span>{scrollCue.label}</span>
          <svg
            className="hero-scroll-cue__icon"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 5v14M12 19l-6-6M12 19l6-6"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      ) : null}
    </section>
  )
}
