import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MigrationStats from '../components/schemaBridge/MigrationStats'
import PipelineSteps from '../components/schemaBridge/PipelineSteps'
import RecordCompare from '../components/schemaBridge/RecordCompare'
import ReviewQueueWorkbench from '../components/schemaBridge/ReviewQueueWorkbench'
import SchemaBridgeHero from '../components/schemaBridge/SchemaBridgeHero'
import { schemaBridge } from '../data/schemaBridge'

export default function SchemaBridgePage() {
  const [manifest, setManifest] = useState(null)
  const [reviewQueue, setReviewQueue] = useState([])
  const [examples, setExamples] = useState([])

  useEffect(() => {
    Promise.all([
      fetch('/data/schema-bridge/manifest.json').then((res) => (res.ok ? res.json() : null)),
      fetch('/data/schema-bridge/review_queue.json').then((res) => (res.ok ? res.json() : [])),
      fetch('/data/schema-bridge/examples.json').then((res) => (res.ok ? res.json() : [])),
    ]).then(([nextManifest, nextReview, nextExamples]) => {
      setManifest(nextManifest)
      setReviewQueue(Array.isArray(nextReview) ? nextReview : [])
      setExamples(Array.isArray(nextExamples) ? nextExamples : [])
    })
  }, [])

  const featuredExample =
    examples.find((entry) => entry.id === schemaBridge.featuredExampleId) ?? examples[0]

  return (
    <article className="scroll-mt-20 px-6 pt-28 pb-24">
      <div className="mx-auto max-w-5xl">
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
            <li className="text-zinc-200">{schemaBridge.title}</li>
          </ol>
        </nav>

        <SchemaBridgeHero
          subtitle={schemaBridge.subtitle}
          title={schemaBridge.title}
          intro={schemaBridge.intro}
        />

        <section id="review" className="mt-12 scroll-mt-28">
          <h2 className="text-lg font-medium text-zinc-100">Review workbench</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
            Approve or reject low-confidence mappings before they merge into production. Edit
            category, status, site, and owner—the form is driven by the normalized schema below.
          </p>
          <div className="mt-5">
            <ReviewQueueWorkbench items={reviewQueue} />
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-lg font-medium text-zinc-100">{schemaBridge.sections.migration.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
            {schemaBridge.sections.migration.body}
          </p>
          <div className="mt-6">
            <PipelineSteps />
          </div>
          <p className="mt-4 font-mono text-xs text-zinc-600">
            {schemaBridge.repoPath}
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            {schemaBridge.cliCommand}
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-lg font-medium text-zinc-100">{schemaBridge.sections.schemaUi.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
            {schemaBridge.sections.schemaUi.body}
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60">
            <p className="border-b border-zinc-800 px-4 py-2 text-xs font-medium tracking-wide text-zinc-500 uppercase">
              Target schema (WorkOrder)
            </p>
            <ul className="divide-y divide-zinc-800/80">
              {schemaBridge.targetSchemaFields.map((field) => (
                <li
                  key={field.name}
                  className="grid gap-1 px-4 py-2.5 text-sm sm:grid-cols-[8rem_6rem_1fr]"
                >
                  <span className="font-mono text-teal-300">{field.name}</span>
                  <span className="text-zinc-500">{field.type}</span>
                  <span className="text-zinc-400">{field.note}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500">
            Because every queue item already includes a <code className="text-zinc-400">suggested</code>{' '}
            object in this shape, the review UI can bind inputs directly—dropdowns for enums,
            text fields for strings—without custom forms for each legacy export format.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-lg font-medium text-zinc-100">Mapping example</h2>
          <p className="mt-2 text-sm text-zinc-500">
            One row before and after semantic mapping, with AI decisions attached.
          </p>
          <div className="mt-4">
            {featuredExample ? (
              <RecordCompare item={featuredExample} />
            ) : (
              <p className="text-sm text-zinc-500">Loading example…</p>
            )}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-lg font-medium text-zinc-100">Migration results</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Committed pipeline output — no live LLM calls on this page.
          </p>
          <div className="mt-4">
            <MigrationStats manifest={manifest} />
          </div>
        </section>

        <footer className="mt-14 border-t border-zinc-800 pt-8">
          <ul className="flex flex-wrap gap-2" aria-label="Technology tags">
            {schemaBridge.focusTags.map((tag) => (
              <li
                key={tag}
                className="rounded-md border border-zinc-700/80 bg-zinc-800/60 px-3 py-1.5 text-xs font-medium text-zinc-300"
              >
                {tag}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-zinc-500">
            Normalized output powers the{' '}
            <Link
              to="/projects/ux/data-table-scanability"
              className="text-violet-300 hover:text-violet-200"
            >
              operations table case study
            </Link>
            .
          </p>
        </footer>
      </div>
    </article>
  )
}
