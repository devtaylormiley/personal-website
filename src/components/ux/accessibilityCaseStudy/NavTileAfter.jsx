import { useState } from 'react'
import CaseStudyDemoChrome from '../shared/CaseStudyDemoChrome'
import NavSignInTileCard from './NavSignInTileCard'

export default function NavTileAfter() {
  const [activated, setActivated] = useState(false)

  return (
    <CaseStudyDemoChrome variant="after" title="Home navigation tile — full card link">
      <div className="p-4">
        <p className="mb-3 text-center text-[10px] tracking-wide text-zinc-500 uppercase">
          Home · quick links
        </p>
        <a
          href="#sign-in"
          aria-label="Go to member sign-in page"
          onClick={(e) => {
            e.preventDefault()
            setActivated(true)
          }}
          className="group mx-auto block max-w-[15rem] cursor-pointer rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
        >
          <NavSignInTileCard className="group-hover:border-violet-600/50 group-hover:bg-zinc-900 group-focus-visible:border-violet-600/50">
            <span className="inline-block text-xs font-medium text-violet-300 group-hover:text-violet-200">
              Go to sign-in page →
            </span>
          </NavSignInTileCard>
        </a>
        {activated ? (
          <p className="mt-3 text-center text-xs text-zinc-400" role="status">
            Entire card links to sign-in — Tab to highlight, Enter to activate.
          </p>
        ) : (
          <p className="mt-3 text-center text-[10px] text-zinc-500">
            Whole tile is a single <code className="text-zinc-400">&lt;a&gt;</code> · keyboard focus ring
            on the card
          </p>
        )}
      </div>
    </CaseStudyDemoChrome>
  )
}
