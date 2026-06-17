import UxCaseStudyPage from './UxCaseStudyPage'
import OnboardingDashboardBefore from '../../components/ux/onboardingCaseStudy/OnboardingDashboardBefore'
import OnboardingDashboardAfter from '../../components/ux/onboardingCaseStudy/OnboardingDashboardAfter'
import { getUxCaseNumber } from '../../data/uxImprovements'

export default function OnboardingEmptyStatesPage() {
  return (
    <UxCaseStudyPage
      caseNumber={getUxCaseNumber('onboarding-empty-states')}
      title="Onboarding empty states"
      context="B2B SaaS"
      intro="New teams signed up to a blank workspace with no projects, no sample data, and no suggested next steps. Time-to-first-value stretched across days of trial support instead of one guided session."
      fixes={[
        'Replaced the empty dashboard with a welcome panel and a three-step checklist tied to real outcomes (invite, import, open a view)',
        'Sample data import populates KPI cards immediately so users can explore before connecting production sources',
        'Progress bar and completed states reinforce momentum; advanced areas stay available but de-emphasized until basics are done',
      ]}
      BeforeDemo={OnboardingDashboardBefore}
      AfterDemo={OnboardingDashboardAfter}
      beforeBullets={[
        'Centered empty state with a single “Create project” link and no explanation of what success looks like',
        'Navigation exposes Reports, Settings, and Billing — all empty — with no ordering or priority',
        'No sample data, templates, or progressive disclosure; users leave to read docs or wait for CS',
      ]}
      afterBullets={[
        'Welcome card frames first value with a visible completion meter',
        'Actionable checklist with Start buttons; completed steps strike through and show Done',
        'Sample dashboard preview after import so the product feels alive before live data exists',
      ]}
    />
  )
}
