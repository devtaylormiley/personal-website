import { useState } from 'react'
import CaseStudyDemoChrome from '../shared/CaseStudyDemoChrome'
import MockRichTextField from './MockRichTextField'

const DEFAULT_SECTIONS = {
  header:
    'MILLER & ASSOCIATES, P.C.\n1234 Commerce Street, Suite 500\nAustin, TX 78701\n(512) 555-0142',
  routing:
    'To: Acme Properties, LLC\nFrom: Miller & Associates, P.C.\nRe: Notice of lease default — Unit 4B, 880 Riverside Drive',
  body:
    'Dear Property Manager,\n\nPursuant to Section 12.4 of the lease dated March 3, 2024, our client has failed to cure the outstanding maintenance assessment within the statutory cure period. This letter serves as formal notice that we intend to pursue all remedies available under the agreement and applicable state law unless payment is received within ten (10) business days.\n\nPlease direct correspondence to the undersigned.',
  closing: 'Respectfully submitted,\n\nJordan Ellis\nManaging Partner',
}

export default function LegalLetterBefore() {
  const [sections, setSections] = useState(DEFAULT_SECTIONS)
  const [showExport, setShowExport] = useState(false)

  function updateSection(key, value) {
    setSections((current) => ({ ...current, [key]: value }))
  }

  return (
    <CaseStudyDemoChrome variant="before" title="Legal notice composer — segmented rich text">
      <div className="legal-letter-before p-4 sm:p-6">
        <p className="legal-letter-before__intro">
          Four independent rich text regions export into one PDF. Each editor carries its own font,
          size, and spacing — the output only looks like a letter after assembly.
        </p>

        <div className="space-y-5">
          <MockRichTextField
            id="letter-header"
            label="Letter header"
            value={sections.header}
            onChange={(value) => updateSection('header', value)}
            rows={4}
            fontFamily="Times New Roman"
            fontSize="14pt"
            lineHeight="1.2"
            showImageUpload
            hint="Seal/logo upload lives in the header editor — centered in export only, not visible while editing"
          />
          <MockRichTextField
            id="letter-routing"
            label="To / From / Subject"
            value={sections.routing}
            onChange={(value) => updateSection('routing', value)}
            rows={3}
            fontFamily="Arial"
            fontSize="12pt"
            lineHeight="1.35"
          />
          <MockRichTextField
            id="letter-body"
            label="Body"
            value={sections.body}
            onChange={(value) => updateSection('body', value)}
            rows={8}
            fontFamily="Calibri"
            fontSize="11pt"
            lineHeight="1.45"
          />
          <MockRichTextField
            id="letter-closing"
            label="Closing"
            value={sections.closing}
            onChange={(value) => updateSection('closing', value)}
            rows={3}
            fontFamily="Times New Roman"
            fontSize="12pt"
            lineHeight="1.6"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowExport((current) => !current)}
            className="cursor-pointer rounded bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white"
          >
            Export to PDF
          </button>
          <p className="text-xs text-zinc-500">
            Margins and typography come from whatever each editor last applied.
          </p>
        </div>

        {showExport ? (
          <div className="legal-letter-before__export mt-6" aria-label="Simulated PDF export preview">
            <p className="legal-letter-before__export-label">Exported preview (simulated)</p>
            <div className="legal-letter-before__export-page">
              <pre
                className="legal-letter-before__export-block legal-letter-before__export-block--header"
                style={{ fontFamily: 'Times New Roman, serif', fontSize: '14pt', lineHeight: 1.2 }}
              >
                {sections.header}
              </pre>
              <pre
                className="legal-letter-before__export-block"
                style={{ fontFamily: 'Arial, sans-serif', fontSize: '12pt', lineHeight: 1.35 }}
              >
                {sections.routing}
              </pre>
              <pre
                className="legal-letter-before__export-block"
                style={{ fontFamily: 'Calibri, sans-serif', fontSize: '11pt', lineHeight: 1.45 }}
              >
                {sections.body}
              </pre>
              <pre
                className="legal-letter-before__export-block"
                style={{ fontFamily: 'Times New Roman, serif', fontSize: '12pt', lineHeight: 1.6 }}
              >
                {sections.closing}
              </pre>
            </div>
            <p className="mt-3 text-xs text-red-300/90">
              Section spacing, alignment, and type rhythm are inconsistent — fails court filing
              templates and surprises customers who did not realize they were building a formal
              document.
            </p>
          </div>
        ) : null}
      </div>
    </CaseStudyDemoChrome>
  )
}
