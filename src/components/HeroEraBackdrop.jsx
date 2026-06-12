export default function HeroEraBackdrop() {
  return (
    <div
      className="hero-era hero-era--modern hero-era--dark hero-era-backdrop"
      aria-hidden="true"
    >
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id="hero-watercolor-bleed" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="3"
              seed="8"
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="28" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="hero-aurora">
        <div className="hero-aurora__surface" />
        <div className="hero-aurora__paper" />
        <div className="hero-aurora__sweep" />
        <div className="hero-aurora__blob hero-aurora__blob--purple" />
        <div className="hero-aurora__blob hero-aurora__blob--blue" />
        <div className="hero-aurora__blob hero-aurora__blob--teal" />
        <div className="hero-aurora__blob hero-aurora__blob--indigo" />
        <div className="hero-aurora__blob hero-aurora__blob--coral" />
        <div className="hero-aurora__caustics" />
        <div className="hero-aurora__particles" />
        <div className="hero-aurora__depth" />
        <div className="hero-aurora__vignette" />
      </div>

      <div className="hero-era__landscape">
        <div className="hero-era__landscape-sky" />
        <div className="hero-era__landscape-sun" />
        <div className="hero-era__landscape-hills hero-era__landscape-hills--back" />
        <div className="hero-era__landscape-hills hero-era__landscape-hills--front" />
      </div>

      <div className="hero-era__layer hero-era__layer--modern" />

      <div className="hero-era-backdrop__grain" />
    </div>
  )
}
