import { useCallback, useEffect, useRef, useState } from 'react'
import { contactFormThemes, contactShowcaseCopy } from '../../data/contactFormThemes'
import { submitContactInquiry } from '../../lib/contactApi'

const initialForm = { name: '', email: '', message: '', website: '' }
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

function ContactFormSlide({
  theme,
  colorMode,
  form,
  submitStatus,
  submitErrorMessage,
  isActive,
  isSubmitting,
  onChange,
  onSubmit,
}) {
  const fieldClass = `contact-showcase__field contact-showcase__field--${theme.fieldStyle}`
  const inputClass = `contact-showcase__input contact-showcase__input--${theme.fieldStyle}`

  return (
    <div
      className={`contact-showcase__stage contact-showcase--${theme.id} contact-showcase--${colorMode}`}
      aria-hidden={!isActive}
      inert={!isActive || undefined}
    >
      <ContactLandscape themeId={theme.id} />

      <form onSubmit={onSubmit} className="contact-showcase__form" noValidate>
        <div className="contact-showcase__honeypot" aria-hidden="true">
          <label htmlFor={`contact-website-${theme.id}`}>Website</label>
          <input
            id={`contact-website-${theme.id}`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={onChange}
          />
        </div>

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
            onChange={onChange}
            placeholder="Your name"
            className={inputClass}
            disabled={isSubmitting}
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
            onChange={onChange}
            placeholder="you@company.com"
            className={inputClass}
            disabled={isSubmitting}
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
            onChange={onChange}
            placeholder="What are you building, and how can I help?"
            className={inputClass}
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" className="contact-showcase__submit" disabled={isSubmitting}>
          {isSubmitting ? contactShowcaseCopy.submittingLabel : contactShowcaseCopy.submitLabel}
        </button>

        {submitStatus === 'success' && (
          <p className="contact-showcase__success" role="status">
            {contactShowcaseCopy.successMessage}
          </p>
        )}

        {submitStatus === 'error' && (
          <p className="contact-showcase__error" role="alert">
            {submitErrorMessage}
          </p>
        )}
      </form>
    </div>
  )
}

export default function ContactFormShowcase() {
  const [form, setForm] = useState(initialForm)
  const [submitState, setSubmitState] = useState({ status: 'idle', errorMessage: '' })
  const [themeIndex, setThemeIndex] = useState(0)
  const [colorMode, setColorMode] = useState('dark')
  const touchStartX = useRef(null)
  const viewportRef = useRef(null)

  const theme = contactFormThemes[themeIndex]
  const isSubmitting = submitState.status === 'submitting'

  const resetSubmitState = useCallback(() => {
    setSubmitState({ status: 'idle', errorMessage: '' })
  }, [])

  const goToIndex = useCallback(
    (index) => {
      setThemeIndex((current) => {
        if (index === current) return current
        return (index + contactFormThemes.length) % contactFormThemes.length
      })
      resetSubmitState()
    },
    [resetSubmitState],
  )

  const goNext = useCallback(() => {
    goToIndex(themeIndex + 1)
  }, [goToIndex, themeIndex])

  const goPrev = useCallback(() => {
    goToIndex(themeIndex - 1)
  }, [goToIndex, themeIndex])

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'ArrowRight') goNext()
      if (event.key === 'ArrowLeft') goPrev()
    }

    const viewport = viewportRef.current
    if (!viewport) return undefined

    viewport.addEventListener('keydown', onKeyDown)
    return () => viewport.removeEventListener('keydown', onKeyDown)
  }, [goNext, goPrev])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (submitState.status === 'error') {
      resetSubmitState()
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    setSubmitState({ status: 'submitting', errorMessage: '' })

    const result = await submitContactInquiry({
      name: form.name,
      email: form.email,
      message: form.message,
      website: form.website,
      formTheme: theme.id,
      colorMode,
    })

    if (!result.ok) {
      setSubmitState({ status: 'error', errorMessage: result.error })
      return
    }

    setForm(initialForm)
    setSubmitState({ status: 'success', errorMessage: '' })
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

  return (
    <div className="contact-showcase">
      <div
        ref={viewportRef}
        className="contact-showcase__viewport"
        tabIndex={0}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="contact-showcase__track"
          style={{ transform: `translate3d(-${themeIndex * 100}%, 0, 0)` }}
        >
          {contactFormThemes.map((entry, index) => (
            <ContactFormSlide
              key={entry.id}
              theme={entry}
              colorMode={colorMode}
              form={form}
              submitStatus={submitState.status}
              submitErrorMessage={submitState.errorMessage}
              isSubmitting={isSubmitting}
              isActive={index === themeIndex}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          ))}
        </div>
      </div>

      <div className="contact-showcase__controls">
        <p className="contact-showcase__hint">{contactShowcaseCopy.cycleHint}</p>
        <div className="contact-showcase__toolbar">
          <button
            type="button"
            className="contact-showcase__nav-btn"
            onClick={goPrev}
            aria-label={contactShowcaseCopy.prevLabel}
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          >
            {contactShowcaseCopy.modeDark}
          </button>
          <button
            type="button"
            className={`contact-showcase__mode-btn${colorMode === 'light' ? ' contact-showcase__mode-btn--active' : ''}`}
            onClick={() => setColorMode('light')}
            aria-pressed={colorMode === 'light'}
            disabled={isSubmitting}
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
              onClick={() => goToIndex(index)}
              disabled={isSubmitting}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
