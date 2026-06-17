import UxCaseStudyPage from './UxCaseStudyPage'
import AccessibilityFlowsBefore from '../../components/ux/accessibilityCaseStudy/AccessibilityFlowsBefore'
import AccessibilityFlowsAfter from '../../components/ux/accessibilityCaseStudy/AccessibilityFlowsAfter'
import { getUxCaseNumber } from '../../data/uxImprovements'

export default function AccessibilityCoreFlowsPage() {
  return (
    <UxCaseStudyPage
      caseNumber={getUxCaseNumber('accessibility-core-flows')}
      title="Accessibility pass on core flows"
      context="Cross-product initiative"
      intro="Sign-in, search, and checkout failed WCAG 2.1 AA contrast on primary actions; forms relied on placeholders instead of labels; focus indicators were removed for aesthetics. Home navigation tiles used mouse-only spans instead of real links. Keyboard and screen-reader users hit dead ends on critical paths."
      fixes={[
        'Raised text and control contrast across the portfolio site — body copy, links, and buttons meet 4.5:1 targets on dark backgrounds',
        'Visible focus-visible rings on links, buttons, and inputs; pointer cursor only on truly interactive elements',
        'Forms use associated labels, sufficient touch targets, and hover states that do not rely on color alone',
        'Navigation tiles are single focusable links so the image, title, and CTA share one tab stop and one activation target',
        'This case study’s After panel mirrors patterns applied site-wide (navigation, contact form, project links, UX demos)',
      ]}
      BeforeDemo={AccessibilityFlowsBefore}
      AfterDemo={AccessibilityFlowsAfter}
      beforeBullets={[
        'Navigation tile: only a styled span handles clicks — not in tab order, screen readers do not announce it as a link',
        'Sign-in: placeholder-only inputs with no programmatic labels; weak button contrast; no focus ring',
        'Mouse users see a sign-in promo card; keyboard users cannot reach the sign-in page from the tile',
      ]}
      afterBullets={[
        'Navigation tile: entire card links to the sign-in page — Tab once, Enter to follow; hover and focus cover the full target',
        'Sign-in: explicit labels, AA contrast on the primary button, Tab shows focus-visible on fields and submit',
        'Portfolio pages use the same focus, cursor, and contrast rules in site-a11y.css',
      ]}
    />
  )
}
