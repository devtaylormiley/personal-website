import HeroEraStage from './HeroEraStage'

export default function Hero() {
  return (
    <section
      id="hero"
      className="home-hero relative flex min-h-[100svh] flex-col px-4 sm:px-6"
    >
      <HeroEraStage />
    </section>
  )
}
