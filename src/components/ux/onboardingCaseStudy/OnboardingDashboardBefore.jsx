import CaseStudyDemoChrome from '../shared/CaseStudyDemoChrome'

export default function OnboardingDashboardBefore() {
  return (
    <CaseStudyDemoChrome variant="before" title="Relay — workspace (day 1)">
      <div className="flex min-h-[16rem] flex-col items-center justify-center bg-zinc-950 p-8 text-center">
        <div className="h-12 w-12 rounded-full border border-dashed border-zinc-700" aria-hidden="true" />
        <p className="mt-4 text-sm text-zinc-500">No projects yet</p>
        <button
          type="button"
          className="mt-2 text-xs text-zinc-600 underline decoration-zinc-700"
        >
          Create project
        </button>
        <p className="mt-8 max-w-xs text-[11px] leading-relaxed text-zinc-600">
          Sidebar links to Reports, Settings, and Billing are visible but every destination is
          empty — no guidance on what to do first.
        </p>
      </div>
    </CaseStudyDemoChrome>
  )
}
