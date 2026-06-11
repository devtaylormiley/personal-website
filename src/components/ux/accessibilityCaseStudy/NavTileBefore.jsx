import { useState } from 'react'
import CaseStudyDemoChrome from '../shared/CaseStudyDemoChrome'
import NavSignInTileCard from './NavSignInTileCard'

export default function NavTileBefore() {
  const [activated, setActivated] = useState(false)

  return (
    <CaseStudyDemoChrome variant="before" title="Home navigation tile — span only">
      <div className="p-4">
        <p className="mb-3 text-center text-[10px] tracking-wide text-zinc-600 uppercase">
          Home · quick links
        </p>
        <NavSignInTileCard>
          <span
            onClick={() => setActivated(true)}
            className="inline-block cursor-pointer text-xs text-violet-400/90 hover:text-violet-300 hover:underline"
          >
            Go to sign-in page →
          </span>
        </NavSignInTileCard>
        {activated ? (
          <p className="mt-3 text-center text-xs text-zinc-500" role="status">
            Span would open sign-in — mouse only; not in tab order.
          </p>
        ) : (
          <p className="mt-3 text-center text-[10px] text-zinc-600">
            Only the text span is clickable · not a link or button · no{' '}
            <code className="text-zinc-500">tabIndex</code>
          </p>
        )}
      </div>
    </CaseStudyDemoChrome>
  )
}
