export default function HeroEraBackdrop() {
  return (
    <div
      className="hero-era hero-era--modern hero-era--dark hero-era-backdrop"
      aria-hidden="true"
    >
      <div className="hero-aurora">
        <div className="hero-aurora__surface" />
        <div className="hero-aurora__blob hero-aurora__blob--teal" />
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
    </div>
  )
}
