import UxCaseStudyPage from './UxCaseStudyPage'
import ErrorLoadingBefore from '../../components/ux/errorLoadingCaseStudy/ErrorLoadingBefore'
import ErrorLoadingAfter from '../../components/ux/errorLoadingCaseStudy/ErrorLoadingAfter'
import { getUxCaseNumber } from '../../data/uxImprovements'

export default function ErrorLoadingPatternsPage() {
  return (
    <UxCaseStudyPage
      caseNumber={getUxCaseNumber('error-loading-patterns')}
      title="Error and loading patterns"
      context="Consumer app"
      intro="Inconsistent feedback made outages feel fatal: some screens showed a bare spinner with no layout shift, others dumped error codes with no recovery path. Users refreshed blindly or abandoned the session."
      fixes={[
        'Skeleton loaders preserve layout and content hierarchy while data loads — no full-screen spinner that hides structure',
        'Error states use plain-language headlines, reassurance about saved work, and a primary Try again action',
        'Loading, error, and success share the same content frame so switching states does not jump the UI',
      ]}
      BeforeDemo={ErrorLoadingBefore}
      AfterDemo={ErrorLoadingAfter}
      beforeBullets={[
        'Full-viewport spinner with no skeleton or label — users cannot tell what is loading',
        'Errors show “An error has occurred” plus an opaque code with no retry or next step',
        'No demo controls; each module implemented loading and failure differently',
      ]}
      afterBullets={[
        'Pulse-style skeleton cards mirror final list layout during load',
        'Alert panel explains what failed, why it might have happened, and offers Try again',
        'Toggle buttons let you compare loading, error, and success in one prototype',
      ]}
    />
  )
}
