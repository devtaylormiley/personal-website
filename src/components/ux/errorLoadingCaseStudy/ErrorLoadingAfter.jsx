import { useState } from 'react'
import CaseStudyDemoChrome from '../shared/CaseStudyDemoChrome'

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
      <div className="h-3 w-1/3 rounded bg-zinc-800" />
      <div className="mt-3 h-2 w-full rounded bg-zinc-800" />
      <div className="mt-2 h-2 w-4/5 rounded bg-zinc-800" />
    </div>
  )
}

export default function ErrorLoadingAfter() {
  const [state, setState] = useState('loading')

  return (
    <CaseStudyDemoChrome variant="after" title="Pulse — activity feed">
      <div className="min-h-[16rem] bg-zinc-950 p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            { id: 'loading', label: 'Loading' },
            { id: 'error', label: 'Error' },
            { id: 'success', label: 'Loaded' },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setState(id)}
              className={`cursor-pointer rounded px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 ${
                state === id
                  ? 'bg-violet-600 text-white'
                  : 'border border-zinc-600 text-zinc-300 hover:border-zinc-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {state === 'loading' && (
          <div className="space-y-3" aria-busy="true" aria-label="Loading feed">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {state === 'error' && (
          <div
            className="rounded-lg border border-amber-900/50 bg-amber-950/20 px-4 py-5 text-center"
            role="alert"
          >
            <p className="text-sm font-medium text-zinc-100">Couldn&apos;t load your activity feed</p>
            <p className="mt-2 text-xs text-zinc-400">
              Check your connection or try again in a moment. Your drafts are still saved locally.
            </p>
            <button
              type="button"
              onClick={() => setState('success')}
              className="mt-4 cursor-pointer rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
            >
              Try again
            </button>
          </div>
        )}

        {state === 'success' && (
          <ul className="space-y-2 text-sm text-zinc-300">
            <li className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2">
              Design review scheduled · 2h ago
            </li>
            <li className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2">
              Comment on wireframes · 5h ago
            </li>
          </ul>
        )}
      </div>
    </CaseStudyDemoChrome>
  )
}
