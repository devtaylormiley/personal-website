import HeroEraStage from './HeroEraStage'

export default function Hero() {
  return (
    <section
      id="hero"
      className="home-hero relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pt-[calc(4.25rem+1.25rem)] pb-14 sm:px-6 sm:pt-32 sm:pb-20"
    >
      <HeroEraStage />
      <div className="hero-scroll-cue" aria-hidden="true">
        <span className="hero-scroll-cue__icon">↓</span>
        <span>Scroll</span>
      </div>
    </section>
  )
}
