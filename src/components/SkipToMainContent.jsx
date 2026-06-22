export default function SkipToMainContent({
  targetId = 'main-content',
  label = 'Skip to main content',
  className = 'skip-to-main',
}) {
  function skipToMain() {
    const target = document.getElementById(targetId)
    if (!target) return

    target.focus({ preventScroll: true })

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    target.scrollIntoView({
      behavior: reducedMotion ? 'instant' : 'smooth',
      block: 'start',
    })
  }

  return (
    <button type="button" className={className} onClick={skipToMain}>
      {label}
    </button>
  )
}
