import UxCaseStudyPage from './UxCaseStudyPage'
import LegalLetterBefore from '../../components/ux/legalLetterCaseStudy/LegalLetterBefore'
import LegalLetterAfter from '../../components/ux/legalLetterCaseStudy/LegalLetterAfter'
import { getUxCaseNumber } from '../../data/uxImprovements'

export default function LegalLetterGenerationPage() {
  return (
    <UxCaseStudyPage
      caseNumber={getUxCaseNumber('legal-letter-generation')}
      title="Official legal letter generation"
      context="Legal operations"
      intro={`Our customers needed a self-serve way to produce filing-ready notices. The first design treated the letter as four disconnected rich text blocks that merged on export — customers did not realize they were authoring a formal document, and per-editor typography broke mandatory margin and spacing rules.

When the design decisions were turned over to me, I was able to simplify the process and make it more user-friendly. I made the form LOOK like a letter and customers raved about it.

While I don't love this design for a web form, it showcases how we can use styling and simple ideas to delight the customer.`}
      fixes={[
        'Replaced four generic rich text regions with a single letter-shaped canvas so authors see the document they will file',
        'Letterhead decomposed into seal upload and structured letterhead field with fixed alignment between sections',
        'To, From, Attn, and Subject became labeled lines; body and closing use court-standard type, margins, and vertical rhythm',
        'Closing and signature blocks preserve required whitespace before the signature line',
        'Export inherits layout constraints from the form — spacing and margins are guaranteed, not left to editor formatting',
      ]}
      BeforeDemo={LegalLetterBefore}
      AfterDemo={LegalLetterAfter}
      beforeBullets={[
        'Four labeled rich text areas — Letter Header, To/From/Subject, Body, and Closing — presented as a generic admin form',
        'Each region had its own font family, size, and line spacing toolbar; nothing on screen resembled the finished letter',
        'PDF export stitched sections together with standard page margins but kept whatever styling each editor applied',
        'Customers reported surprise at the formal output and filings failed review for inconsistent spacing and typography',
      ]}
      afterBullets={[
        'Webform laid out as a letter on the page — users edit the same structure counsel will print or file',
        'Header row centers seal upload on the left and letterhead rich text on the right; To, From, Attn, and Re lines follow in reading order',
        'Expanded body field and left-aligned closing preserve document flow; signature space sits below the closing with fixed gap; typography and margins are system-controlled',
      ]}
    />
  )
}
