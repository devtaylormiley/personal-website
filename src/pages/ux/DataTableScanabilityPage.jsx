import { useState } from 'react'
import { Link } from 'react-router-dom'
import OperationsTableBefore from '../../components/ux/dataTableCaseStudy/OperationsTableBefore'
import OperationsTableAfter from '../../components/ux/dataTableCaseStudy/OperationsTableAfter'
const fixes = [
  'One screen replaces the Search → Pending Orders handoff — filter, read, and act without switching tabs or re-learning a second column layout',
  'Column order matches how operators review a row: identify the order and asset, confirm site and category, check assignee and cost, see when it last changed, then status and actions',
  'Per-column filters and sort live in the sticky header so narrowing the queue and reading results happen in the same place',
  'Complete, edit, download, and restart sit on every row so finishing work never depends on which tab you started on',
  'Zebra rows, color-coded status, monospaced numerics, and em-dash placeholders make long queues easier to scan',
  'Mobile-responsive layout — stacked row cards with collapsible filters on small screens; horizontal scroll with a sticky work-order column on tablet and desktop',
]

export default function DataTableScanabilityPage() {
  const [view, setView] = useState('before')

  return (
    <article className="scroll-mt-20 px-4 pt-28 pb-24 sm:px-6">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
        <nav className="text-sm text-zinc-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/#projects" className="transition-colors hover:text-violet-400">
                Portfolio
              </Link>
            </li>
            <li aria-hidden="true" className="text-zinc-600">
              /
            </li>
            <li>
              <Link to="/#projects" className="transition-colors hover:text-violet-400">
                UI/UX improvements
              </Link>
            </li>
            <li aria-hidden="true" className="text-zinc-600">
              /
            </li>
            <li className="text-zinc-300">Data table workflow improvement</li>
          </ol>
        </nav>

        <header className="mt-8 border-b border-zinc-800 pb-8">
          <p className="text-sm font-medium tracking-widest text-violet-400 uppercase">
            Case study · 01
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Data table workflow improvement
          </h1>
          <p className="mt-2 text-sm font-medium text-zinc-500 uppercase">Operations tooling</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-zinc-400">
            Power users lived in this queue daily. The legacy flow split finding orders from closing
            them across two tabs, reshuffled columns between those views, and scattered actions so
            completing work meant leaving the row you were already reading.
          </p>
        </header>

        <div className="mt-10 flex flex-wrap gap-2">
          {[
            { id: 'before', label: 'Before' },
            { id: 'after', label: 'After' },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                view === id
                  ? 'bg-violet-600 text-white'
                  : 'border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-12">
          {view === 'before' ? (
            <section>
              <h3 className="mb-3 text-sm font-medium text-red-300/90">Before</h3>
              <OperationsTableBefore />
              <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-zinc-500">
                <li>
                  Search and Pending Orders are separate tabs with different column orders — Pending
                  Orders leads with assignee and Complete Order, and merges work order with asset ID
                </li>
                <li>
                  Typical flow: set keyword and site filters on Search, find a row, switch to Pending
                  Orders to complete it, then locate the same order again in the reshuffled table;
                  filters still apply but are not visible on Pending Orders
                </li>
                <li>
                  Actions are split by tab and status — edit via the work order link on Search only,
                  Complete Order on Pending Orders only, Restart inline in the status column for
                  closed rows; download is a mouse-only icon tucked in the Asset ID column with no
                  keyboard access; no sort controls
                </li>
                <li>
                  Headers scroll away with the table; empty cells are blank and status has no color
                  coding
                </li>
              </ul>
            </section>
          ) : (
            <section>
              <h3 className="mb-3 text-sm font-medium text-emerald-300/90">After</h3>
              <OperationsTableAfter />
              <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-zinc-500">
                <li>
                  One screen for the full journey: filter and sort in the header, read the row left
                  to right, act on the same line — no tab switch between finding work and finishing
                  it
                </li>
                <li>
                  Columns follow review order: work order and asset ID, then site and category (where
                  and what), then assignee, estimated cost, and last updated (ownership and
                  urgency), then color-coded status, then actions
                </li>
                <li>
                  Status filter replaces the Pending Orders tab — pick Ready, In progress, or any
                  single state while the same layout, filters, and sort controls stay in place
                </li>
                <li>
                  Every row exposes the same action set — complete or restart, edit, and download —
                  regardless of status; work order IDs are for reading, not navigation
                </li>
                <li>
                  Sticky header keeps filters visible while scrolling; zebra rows, monospaced
                  numerics, and em-dash placeholders for missing values
                </li>
                <li>
                  Mobile-responsive — on small screens, rows become labeled cards with a collapsible
                  filters &amp; sort panel; on tablet and desktop, the full table scrolls horizontally
                  with the work-order column pinned
                </li>
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
                className="flex gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-300"
              >
                <span className="text-violet-400" aria-hidden="true">
                  ✓
                </span>
                {fix}
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-center">
          <Link
            to="/#projects"
            className="text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
          >
            ← Back to all improvements
          </Link>
        </p>
      </div>
    </article>
  )
}
