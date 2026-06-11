import { useState } from 'react'
import CaseStudyDemoChrome from '../shared/CaseStudyDemoChrome'

export default function SignInFormAfter() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <CaseStudyDemoChrome variant="after" title="Sign-in — WCAG-aligned">
      <div className="mx-auto max-w-sm p-6">
        <h4 className="text-base font-semibold text-zinc-50">Sign in</h4>
        <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()} noValidate>
          <div>
            <label htmlFor="a11y-demo-email" className="mb-1.5 block text-sm font-medium text-zinc-200">
              Email address
            </label>
            <input
              id="a11y-demo-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-500"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label htmlFor="a11y-demo-password" className="mb-1.5 block text-sm font-medium text-zinc-200">
              Password
            </label>
            <input
              id="a11y-demo-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-50"
            />
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
          >
            Sign in
          </button>
        </form>
        <p className="mt-4 text-[10px] text-zinc-400">
          Visible labels · 4.5:1+ contrast on text and primary action · keyboard focus ring (Tab into fields)
        </p>
      </div>
    </CaseStudyDemoChrome>
  )
}
