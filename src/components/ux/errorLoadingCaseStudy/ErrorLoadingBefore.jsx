import { useState } from 'react'
import CaseStudyDemoChrome from '../shared/CaseStudyDemoChrome'

export default function ErrorLoadingBefore() {
  const [loading, setLoading] = useState(true)

  return (
    <CaseStudyDemoChrome variant="before" title="Pulse — activity feed">
      <div className="relative min-h-[16rem] bg-zinc-950 p-6">
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setLoading(true)}
            className="cursor-pointer rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
          >
            Simulate load
          </button>
          <button
            type="button"
            onClick={() => setLoading(false)}
            className="cursor-pointer rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
          >
            Simulate error
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-[12rem] flex-col items-center justify-center">
            <div
              className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-400"
              aria-hidden="true"
            />
            <p className="sr-only">Loading</p>
          </div>
        ) : (
          <div className="flex min-h-[12rem] flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-red-400/80">An error has occurred.</p>
            <p className="mt-2 text-xs text-zinc-600">Error code: 0x4F2A</p>
          </div>
        )}
      </div>
    </CaseStudyDemoChrome>
  )
}
