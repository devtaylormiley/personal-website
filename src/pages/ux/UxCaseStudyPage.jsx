import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function UxCaseStudyPage({
  caseNumber,
  title,
  context,
  intro,
  fixes,
  BeforeDemo,
  AfterDemo,
  beforeBullets,
  afterBullets,
}) {
  const [view, setView] = useState('before')

  return (
    <article className="scroll-mt-20 px-6 pt-28 pb-24">
      <div className="mx-auto w-full max-w-7xl">
        <nav className="text-sm text-zinc-400" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="transition-colors hover:text-violet-300">
                Portfolio
              </Link>
            </li>
            <li aria-hidden="true" className="text-zinc-600">
              /
            </li>
            <li>
              <Link to="/projects/ux" className="transition-colors hover:text-violet-300">
                UI/UX improvements
              </Link>
            </li>
            <li aria-hidden="true" className="text-zinc-600">
              /
            </li>
            <li className="text-zinc-200">{title}</li>
          </ol>
        </nav>

        <header className="mt-8 border-b border-zinc-800 pb-8">
          <p className="text-sm font-medium tracking-widest text-violet-300 uppercase">
            Case study · {caseNumber}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm font-medium text-zinc-400 uppercase">{context}</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-zinc-300">{intro}</p>
        </header>

        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Before and after">
          {[
            { id: 'before', label: 'Before' },
            { id: 'after', label: 'After' },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              onClick={() => setView(id)}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 ${
                view === id
                  ? 'bg-violet-600 text-white hover:bg-violet-500'
                  : 'border border-zinc-600 text-zinc-300 hover:border-zinc-400 hover:text-zinc-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-12">
          {view === 'before' ? (
            <section role="tabpanel">
              <h3 className="mb-3 text-sm font-medium text-red-300">Before</h3>
              <BeforeDemo />
              <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-zinc-400">
                {beforeBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : (
            <section role="tabpanel">
              <h3 className="mb-3 text-sm font-medium text-emerald-300">After</h3>
              <AfterDemo />
              <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-zinc-400">
                {afterBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-medium text-zinc-100">What changed</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {fixes.map((fix) => (
              <li
                key={fix}
                className="flex gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-200"
              >
                <span className="text-violet-300" aria-hidden="true">
                  ✓
                </span>
                {fix}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  )
}
