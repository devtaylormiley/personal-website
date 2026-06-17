import { Link } from 'react-router-dom'
import { getUxCaseNumber, uxImprovements } from '../../data/uxImprovements'

const focusTags = [
  'WCAG',
  'Accessibility',
  'User journey',
  'Flow',
  'Usability',
  'Information architecture',
  'Heuristic evaluation',
  'Conversion',
  'Mobile-first',
  'Inclusive design',
]

export default function UxImprovementsPage() {
  const { title, subtitle, intro, items } = uxImprovements

  return (
    <article className="scroll-mt-20 px-6 pt-28 pb-24">
      <div className="mx-auto max-w-5xl">
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
            <li className="text-zinc-200">{title}</li>
          </ol>
        </nav>

        <header className="mt-8 max-w-2xl border-zinc-800">
          <p className="text-xs font-medium tracking-widest text-violet-400 uppercase">
            Career Wins
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-base text-zinc-300">{subtitle}</p>
          {intro ? (
            <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
              {intro}
            </p>
          ) : null}
        </header>

        <ol className="mt-10 divide-y divide-zinc-800/80 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30">
          {items.map((item) => {
            const caseNumber = getUxCaseNumber(item.slug)
            const rowBody = (
              <>
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-500/30 bg-violet-500/10 font-mono text-xs font-medium text-violet-300"
                  aria-hidden="true"
                >
                  {caseNumber}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="text-lg font-medium text-zinc-100">{item.title}</h2>
                    {item.context ? (
                      <span className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                        {item.context}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">{item.detail}</p>
                  {item.slug ? (
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-violet-300 transition-colors group-hover:text-violet-200">
                      View before & after
                      <span aria-hidden="true">→</span>
                    </span>
                  ) : null}
                </div>
              </>
            )

            return (
              <li key={item.title}>
                {item.slug ? (
                  <Link
                    to={`/projects/ux/${item.slug}`}
                    className="group flex cursor-pointer gap-4 px-6 py-5 transition-colors hover:bg-violet-500/5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-violet-400 sm:px-8 sm:py-6"
                  >
                    {rowBody}
                  </Link>
                ) : (
                  <div className="flex gap-4 px-6 py-5 sm:px-8 sm:py-6">{rowBody}</div>
                )}
              </li>
            )
          })}
        </ol>

        <footer className="mt-10 border-t border-zinc-800 pt-8">
          <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase">Focus areas</p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="UX focus tags">
            {focusTags.map((tag) => (
              <li
                key={tag}
                className="rounded-md border border-zinc-700/80 bg-zinc-800/60 px-3 py-1.5 text-xs font-medium text-zinc-300"
              >
                {tag}
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </article>
  )
}
