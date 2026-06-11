import CaseStudyDemoChrome from '../shared/CaseStudyDemoChrome'

export default function SignInFormBefore() {
  return (
    <CaseStudyDemoChrome variant="before" title="Sign-in — low contrast (legacy)">
      <div className="mx-auto max-w-sm p-6">
        <h4 className="text-base font-medium text-zinc-400">Sign in</h4>
        <div className="mt-4 space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-500 placeholder:text-zinc-600"
            aria-label={undefined}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-500 placeholder:text-zinc-600"
          />
          <button
            type="button"
            className="w-full rounded py-2 text-sm font-medium text-zinc-500 bg-zinc-800/80"
          >
            Continue
          </button>
        </div>
        <p className="mt-4 text-[10px] text-zinc-600">
          Placeholder-only fields · 3.2:1 button contrast · no visible focus ring
        </p>
      </div>
    </CaseStudyDemoChrome>
  )
}
