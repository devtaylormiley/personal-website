import { useLayoutEffect, useRef, useState } from 'react'
import CaseStudyDemoChrome from '../shared/CaseStudyDemoChrome'

const DEFAULT = {
  letterhead: 'MILLER & ASSOCIATES, P.C.\n1234 Commerce Street, Suite 500\nAustin, TX 78701\n(512) 555-0142',
  to: 'Acme Properties, LLC\n880 Riverside Drive\nAustin, TX 78702',
  from: 'Miller & Associates, P.C.',
  attn: 'Jordan Ellis, Managing Partner',
  subject: 'Notice of lease default — Unit 4B',
  body:
    'Dear Property Manager,\n\nPursuant to Section 12.4 of the lease dated March 3, 2024, our client has failed to cure the outstanding maintenance assessment within the statutory cure period. This letter serves as formal notice that we intend to pursue all remedies available under the agreement and applicable state law unless payment is received within ten (10) business days.\n\nPlease direct correspondence to the undersigned.',
  closing: 'Respectfully submitted,',
  signature: 'Jordan Ellis\nManaging Partner',
}

function AutoResizeTextarea({ value, onChange, className }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    node.style.height = 'auto'
    node.style.height = `${node.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={onChange}
      className={className}
    />
  )
}

function LetterLine({ label, value, onChange }) {
  return (
    <label className="legal-letter-after__line">
      <span className="legal-letter-after__line-label">{label}</span>
      <AutoResizeTextarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="legal-letter-sheet__line-input"
      />
    </label>
  )
}

export default function LegalLetterAfter() {
  const [draft, setDraft] = useState(DEFAULT)
  const [sealPreview, setSealPreview] = useState(null)
  const [showExport, setShowExport] = useState(false)
  const fileInputRef = useRef(null)

  function updateField(key, value) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function handleSealChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setSealPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return url
    })
  }

  return (
    <CaseStudyDemoChrome variant="after" title="Legal notice composer — letter layout">
      <div className="legal-letter-after-wrap p-4 sm:p-6">
        <p className="legal-letter-after-wrap__intro">
          The form is the document. Fixed margins, court-standard type, and section spacing are baked
          into the layout — users edit the letter they will file.
        </p>

        <article className="legal-letter-sheet" aria-label="Official legal letter draft">
          <header className="legal-letter-sheet__header">
            <div className="legal-letter-sheet__seal">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleSealChange}
                aria-label="Upload legal seal image"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="legal-letter-sheet__seal-button"
              >
                {sealPreview ? (
                  <img src={sealPreview} alt="" className="legal-letter-sheet__seal-image" />
                ) : (
                  <>
                    <span className="legal-letter-sheet__seal-icon" aria-hidden="true">
                      ◎
                    </span>
                    <span className="legal-letter-sheet__seal-label">Upload seal</span>
                  </>
                )}
              </button>
            </div>
            <label className="legal-letter-sheet__letterhead">
              <span className="sr-only">Letterhead</span>
              <AutoResizeTextarea
                value={draft.letterhead}
                onChange={(event) => updateField('letterhead', event.target.value)}
                className="legal-letter-sheet__letterhead-input"
              />
            </label>
          </header>

          <div className="legal-letter-sheet__routing">
            <LetterLine label="To:" value={draft.to} onChange={(value) => updateField('to', value)} />
            <LetterLine
              label="From:"
              value={draft.from}
              onChange={(value) => updateField('from', value)}
            />
            <LetterLine
              label="Attn:"
              value={draft.attn}
              onChange={(value) => updateField('attn', value)}
            />
            <LetterLine
              label="Re:"
              value={draft.subject}
              onChange={(value) => updateField('subject', value)}
            />
          </div>

          <label className="legal-letter-sheet__body">
            <span className="sr-only">Letter body</span>
            <AutoResizeTextarea
              value={draft.body}
              onChange={(event) => updateField('body', event.target.value)}
              className="legal-letter-sheet__body-input"
            />
          </label>

          <footer className="legal-letter-sheet__closing-block">
            <label className="legal-letter-sheet__closing">
              <span className="sr-only">Closing</span>
              <AutoResizeTextarea
                value={draft.closing}
                onChange={(event) => updateField('closing', event.target.value)}
                className="legal-letter-sheet__closing-input"
              />
            </label>
            <div className="legal-letter-sheet__signature-space" aria-hidden="true" />
            <label className="legal-letter-sheet__signature">
              <span className="sr-only">Signature block</span>
              <AutoResizeTextarea
                value={draft.signature}
                onChange={(event) => updateField('signature', event.target.value)}
                className="legal-letter-sheet__signature-input"
              />
            </label>
          </footer>
        </article>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowExport((current) => !current)}
            className="cursor-pointer rounded bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
          >
            Export to PDF
          </button>
          <p className="text-xs text-zinc-500">
            Export inherits the letter layout — margins, spacing, and typography stay consistent.
          </p>
        </div>

        {showExport ? (
          <div className="legal-letter-after__export mt-6" aria-label="Simulated PDF export preview">
            <p className="legal-letter-after__export-label">Exported preview (simulated)</p>
            <div className="legal-letter-after__export-page">
              <div className="legal-letter-after__export-header">
                {sealPreview ? (
                  <img src={sealPreview} alt="" className="legal-letter-after__export-seal" />
                ) : (
                  <div className="legal-letter-after__export-seal-placeholder" aria-hidden="true" />
                )}
                <pre className="legal-letter-after__export-letterhead">{draft.letterhead}</pre>
              </div>
              <pre className="legal-letter-after__export-block">{`To: ${draft.to}`}</pre>
              <pre className="legal-letter-after__export-block">{`From: ${draft.from}`}</pre>
              <pre className="legal-letter-after__export-block">{`Attn: ${draft.attn}`}</pre>
              <pre className="legal-letter-after__export-block">{`Re: ${draft.subject}`}</pre>
              <pre className="legal-letter-after__export-block legal-letter-after__export-block--body">
                {draft.body}
              </pre>
              <pre className="legal-letter-after__export-block">{draft.closing}</pre>
              <div className="legal-letter-after__export-signature-space" aria-hidden="true" />
              <pre className="legal-letter-after__export-block">{draft.signature}</pre>
            </div>
            <p className="legal-letter-after__export-note mt-3 text-xs text-emerald-300/90">
              Filing-ready output matches the on-screen letter — section spacing and court-standard
              typography are preserved.
            </p>
          </div>
        ) : null}
      </div>
    </CaseStudyDemoChrome>
  )
}
