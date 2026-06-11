import { useCallback, useEffect, useRef, useState } from 'react'
import { contactFormThemes, contactShowcaseCopy } from '../../data/contactFormThemes'

const initialForm = { name: '', email: '', message: '' }
const SWIPE_THRESHOLD = 48

function ContactLandscape({ themeId }) {
  return (
    <div className={`contact-showcase__landscape contact-showcase__landscape--${themeId}`} aria-hidden="true">
      {themeId === 'aurora' && (
        <>
          <div className="contact-showcase__aurora-blob contact-showcase__aurora-blob--violet" />
          <div className="contact-showcase__aurora-blob contact-showcase__aurora-blob--rose" />
          <div className="contact-showcase__aurora-blob contact-showcase__aurora-blob--teal" />
          <div className="contact-showcase__aurora-hills" />
        </>
      )}
      {themeId === 'gridline' && (
        <>
          <div className="contact-showcase__grid-horizon" />
          <div className="contact-showcase__grid-floor" />
        </>
      )}
      {themeId === 'editorial' && (
        <>
          <div className="contact-showcase__editorial-sky" />
          <div className="contact-showcase__editorial-hill contact-showcase__editorial-hill--back" />
          <div className="contact-showcase__editorial-hill contact-showcase__editorial-hill--front" />
        </>
      )}
      {themeId === 'beacon' && (
        <>
          <div className="contact-showcase__beacon-sun" />
          <div className="contact-showcase__beacon-ridge" />
          <div className="contact-showcase__beacon-city" />
          <div className="contact-showcase__beacon-glow" />
        </>
      )}
    </div>
  )
}

export default function ContactFormShowcase() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [themeIndex, setThemeIndex] = useState(0)
  const [colorMode, setColorMode] = useState('dark')
  const touchStartX = useRef(null)
  const stageRef = useRef(null)

  const theme = contactFormThemes[themeIndex]

  const goNext = useCallback(() => {
    setThemeIndex((index) => (index + 1) % contactFormThemes.length)
    setSubmitted(false)
  }, [])

  const goPrev = useCallback(() => {
    setThemeIndex((index) => (index - 1 + contactFormThemes.length) % contactFormThemes.length)
    setSubmitted(false)
  }, [])

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'ArrowRight') goNext()
      if (event.key === 'ArrowLeft') goPrev()
    }

    const stage = stageRef.current
    if (!stage) return undefined

    stage.addEventListener('keydown', onKeyDown)
    return () => stage.removeEventListener('keydown', onKeyDown)
  }, [goNext, goPrev])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setForm(initialForm)
  }

  function handleTouchStart(event) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null
  }

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return
    const deltaX = event.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return
    if (deltaX < 0) goNext()
    else goPrev()
  }

  const fieldClass = `contact-showcase__field contact-showcase__field--${theme.fieldStyle}`
  const inputClass = `contact-showcase__input contact-showcase__input--${theme.fieldStyle}`

  return (
    <div className="contact-showcase">
      <div
        ref={stageRef}
        className={`contact-showcase__stage contact-showcase--${theme.id} contact-showcase--${colorMode}`}
        tabIndex={0}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <ContactLandscape themeId={theme.id} />

        <form onSubmit={handleSubmit} className="contact-showcase__form" noValidate>
          <div className={fieldClass}>
            <label htmlFor={`contact-name-${theme.id}`} className="contact-showcase__label">
              Name
            </label>
            <input
              id={`contact-name-${theme.id}`}
              name="name"
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              className={inputClass}
            />
          </div>

          <div className={fieldClass}>
            <label htmlFor={`contact-email-${theme.id}`} className="contact-showcase__label">
              Email
            </label>
            <input
              id={`contact-email-${theme.id}`}
              name="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div className={`${fieldClass} contact-showcase__field--message`}>
            <label htmlFor={`contact-message-${theme.id}`} className="contact-showcase__label">
              Message
            </label>
            <textarea
              id={`contact-message-${theme.id}`}
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Tell me about your project..."
              className={inputClass}
            />
          </div>

          <button type="submit" className="contact-showcase__submit">
            Send message
          </button>

          {submitted && (
            <p className="contact-showcase__success" role="status">
              Thanks! Your message has been noted. Connect a backend or service to send it for real.
            </p>
          )}
        </form>
      </div>

      <div className="contact-showcase__controls">
        <p className="contact-showcase__hint">{contactShowcaseCopy.cycleHint}</p>
        <div className="contact-showcase__toolbar">
          <button
            type="button"
            className="contact-showcase__nav-btn"
            onClick={goPrev}
            aria-label={contactShowcaseCopy.prevLabel}
          >
            ←
          </button>

          <div className="contact-showcase__meta">
            <p className="contact-showcase__theme-name" aria-live="polite">
              {theme.name}
            </p>
            <p className="contact-showcase__theme-desc">{theme.description}</p>
          </div>

          <button
            type="button"
            className="contact-showcase__nav-btn"
            onClick={goNext}
            aria-label={contactShowcaseCopy.nextLabel}
          >
            →
          </button>
        </div>

        <div className="contact-showcase__mode-row">
          <button
            type="button"
            className={`contact-showcase__mode-btn${colorMode === 'dark' ? ' contact-showcase__mode-btn--active' : ''}`}
            onClick={() => setColorMode('dark')}
            aria-pressed={colorMode === 'dark'}
          >
            {contactShowcaseCopy.modeDark}
          </button>
          <button
            type="button"
            className={`contact-showcase__mode-btn${colorMode === 'light' ? ' contact-showcase__mode-btn--active' : ''}`}
            onClick={() => setColorMode('light')}
            aria-pressed={colorMode === 'light'}
          >
            {contactShowcaseCopy.modeLight}
          </button>
        </div>

        <div className="contact-showcase__dots" role="tablist" aria-label="Form style">
          {contactFormThemes.map((entry, index) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              className={`contact-showcase__dot${index === themeIndex ? ' contact-showcase__dot--active' : ''}`}
              aria-selected={index === themeIndex}
              aria-label={`${entry.name} form style`}
              onClick={() => {
                setThemeIndex(index)
                setSubmitted(false)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
