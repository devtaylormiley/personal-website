import { Link } from 'react-router-dom'
import OpsPulseDashboard from '../components/opsPulse/OpsPulseDashboard'
import { costComparison, opsPulse } from '../data/opsPulseDashboard'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function OpsPulseDashboardPage() {
  const annualIncumbent = costComparison.incumbent.monthly * 12
  const annualReplacement = costComparison.replacement.monthly * 12
  const annualSavings = annualIncumbent - annualReplacement

  return (
    <article className="scroll-mt-20 px-6 pt-28 pb-24">
      <div className="mx-auto max-w-6xl">
        <nav className="text-sm text-zinc-400" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/#projects" className="transition-colors hover:text-violet-300">
                Portfolio
              </Link>
            </li>
            <li aria-hidden="true" className="text-zinc-600">
              /
            </li>
            <li className="text-zinc-200">{opsPulse.title}</li>
          </ol>
        </nav>

        <header className="ops-pulse-hero">
          <p className="ops-pulse-hero__eyebrow">{opsPulse.subtitle}</p>
          <h1 className="ops-pulse-hero__title">{opsPulse.title}</h1>
          <p className="ops-pulse-hero__intro">{opsPulse.intro}</p>
        </header>

        <section className="ops-pulse-cost" aria-labelledby="cost-title">
          <h2 id="cost-title" className="sr-only">
            Subscription cost comparison
          </h2>
          <div className="ops-pulse-cost__grid">
            <article className="ops-pulse-cost__card ops-pulse-cost__card--incumbent">
              <p className="ops-pulse-cost__label">What teams often buy</p>
              <h3 className="ops-pulse-cost__product">{costComparison.incumbent.label}</h3>
              <p className="ops-pulse-cost__price">
                {formatCurrency(costComparison.incumbent.monthly)}
                <span className="ops-pulse-cost__period">/mo</span>
              </p>
              <p className="ops-pulse-cost__note">{costComparison.incumbent.note}</p>
              <p className="ops-pulse-cost__annual">
                {formatCurrency(annualIncumbent)} / year
              </p>
            </article>
            <article className="ops-pulse-cost__card ops-pulse-cost__card--replacement">
              <p className="ops-pulse-cost__label">This demo replaces it with</p>
              <h3 className="ops-pulse-cost__product">{costComparison.replacement.label}</h3>
              <p className="ops-pulse-cost__price">
                {formatCurrency(costComparison.replacement.monthly)}
                <span className="ops-pulse-cost__period">/mo</span>
              </p>
              <p className="ops-pulse-cost__note">{costComparison.replacement.note}</p>
              <p className="ops-pulse-cost__annual ops-pulse-cost__annual--highlight">
                ~{formatCurrency(annualSavings)} saved vs. {opsPulse.productName} annually
              </p>
            </article>
          </div>
          <p className="ops-pulse-cost__disclaimer">
            Illustrative pricing based on published {opsPulse.productName} Professional tiers and typical static hosting — your connectors and data volume will vary.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="dashboard-title">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="dashboard-title" className="text-lg font-medium text-zinc-100">
                Live dashboard
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-zinc-400">
                Facilities maintenance KPIs — the same metrics plant managers ask for on a Databox wallboard, rendered with Recharts.
              </p>
            </div>
            <span className="ops-pulse-live-badge">Sample data</span>
          </div>
          <div className="mt-6">
            <OpsPulseDashboard />
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-lg font-medium text-zinc-100">Why this replaces the subscription</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {opsPulse.replacementPoints.map((point) => (
              <li
                key={point}
                className="flex gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-200"
              >
                <span className="text-teal-400" aria-hidden="true">
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  )
}
