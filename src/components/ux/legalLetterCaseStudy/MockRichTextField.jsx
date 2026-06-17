const TOOLBAR_BUTTONS = ['B', 'I', 'U']

export default function MockRichTextField({
  label,
  id,
  value,
  onChange,
  rows = 4,
  fontFamily = 'inherit',
  fontSize = '0.875rem',
  lineHeight = '1.5',
  hint,
  readOnly = false,
  showImageUpload = false,
}) {
  return (
    <div className="legal-letter-rte">
      {label ? (
        <label htmlFor={id} className="legal-letter-rte__label">
          {label}
        </label>
      ) : null}
      <div className="legal-letter-rte__chrome">
        <div className="legal-letter-rte__toolbar">
          {TOOLBAR_BUTTONS.map((btn) => (
            <span key={btn} className="legal-letter-rte__toolbar-btn" aria-hidden="true">
              {btn}
            </span>
          ))}
          {showImageUpload ? (
            <button
              type="button"
              className="legal-letter-rte__toolbar-btn legal-letter-rte__toolbar-btn--interactive"
              title="Insert image"
            >
              <span className="legal-letter-rte__toolbar-icon" aria-hidden="true">
                🖼
              </span>
              Image
            </button>
          ) : null}
          <span className="legal-letter-rte__toolbar-divider" aria-hidden="true" />
          <span className="legal-letter-rte__toolbar-meta">{fontFamily}</span>
          <span className="legal-letter-rte__toolbar-meta">{fontSize}</span>
        </div>
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          readOnly={readOnly || !onChange}
          className="legal-letter-rte__input"
          style={{ fontFamily, fontSize, lineHeight }}
        />
      </div>
      {hint ? <p className="legal-letter-rte__hint">{hint}</p> : null}
    </div>
  )
}
