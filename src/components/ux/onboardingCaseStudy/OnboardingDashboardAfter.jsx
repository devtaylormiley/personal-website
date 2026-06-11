import { useState } from 'react'
import CaseStudyDemoChrome from '../shared/CaseStudyDemoChrome'

const STEPS = [
  { id: 'invite', label: 'Invite your team', done: true },
  { id: 'import', label: 'Import sample data', done: false },
  { id: 'view', label: 'Open your first dashboard', done: false },
]

export default function OnboardingDashboardAfter() {
  const [steps, setSteps] = useState(STEPS)
  const [showSample, setShowSample] = useState(false)

  function completeStep(id) {
    setSteps((current) =>
      current.map((s) => (s.id === id ? { ...s, done: true } : s)),
    )
    if (id === 'import') setShowSample(true)
  }

  const completed = steps.filter((s) => s.done).length

  return (
    <CaseStudyDemoChrome variant="after" title="Relay — workspace (guided setup)">
      <div className="space-y-4 p-4 sm:p-6">
        <div className="rounded-lg border border-violet-800/50 bg-violet-950/30 p-4">
          <h4 className="text-sm font-medium text-zinc-100">Welcome — let&apos;s get you to first value</h4>
          <p className="mt-1 text-xs text-zinc-400">
            {completed} of {steps.length} steps complete
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-violet-500 transition-all"
              style={{ width: `${(completed / steps.length) * 100}%` }}
            />
          </div>
          <ol className="mt-4 space-y-2">
            {steps.map((step) => (
              <li
                key={step.id}
                className="flex items-center justify-between gap-2 rounded border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm"
              >
                <span className={step.done ? 'text-zinc-400 line-through' : 'text-zinc-200'}>
                  {step.label}
                </span>
                {step.done ? (
                  <span className="text-xs text-emerald-400">Done</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => completeStep(step.id)}
                    className="cursor-pointer rounded bg-violet-600 px-2 py-1 text-xs font-medium text-white hover:bg-violet-500"
                  >
                    Start
                  </button>
                )}
              </li>
            ))}
          </ol>
        </div>

        {showSample ? (
          <div className="rounded-lg border border-zinc-700 bg-zinc-900/60 p-3">
            <p className="text-xs font-medium text-zinc-300">Sample dashboard preview</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[72, 48, 91].map((n) => (
                <div key={n} className="rounded bg-zinc-800 px-2 py-3 text-center">
                  <p className="text-lg font-semibold text-zinc-100">{n}</p>
                  <p className="text-[10px] text-zinc-500">KPI</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-zinc-500">
              Explore with sample data — replace anytime with your own import.
            </p>
          </div>
        ) : (
          <p className="text-xs text-zinc-500">Complete &quot;Import sample data&quot; to preview a populated workspace.</p>
        )}
      </div>
    </CaseStudyDemoChrome>
  )
}
