import HeroEraStage from './HeroEraStage'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[85svh] flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-20"
    >
      <HeroEraStage />
      <div className="hero-scroll-cue" aria-hidden="true">
        <span className="hero-scroll-cue__icon">↓</span>
        <span>Scroll</span>
      </div>
    </section>
  )
}
