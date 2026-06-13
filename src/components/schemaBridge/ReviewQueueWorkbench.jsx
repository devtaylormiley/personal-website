import { useEffect, useMemo, useState } from 'react'
import { WORK_ORDER_STATUSES } from '../ux/dataTableCaseStudy/workOrderConstants'

const CATEGORIES = ['Mechanical', 'Electrical', 'Safety', 'Fleet', 'HVAC', 'Plumbing']

const fieldClass =
  'w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30'

const fieldLabelClass = 'mb-1 block text-xs text-zinc-400'

const legacyValueClass =
  'break-all border-l-2 border-zinc-700/70 py-0.5 pl-3 text-sm text-zinc-300'

function LegacySnapshot({ legacy }) {
  const entries = Object.entries(legacy ?? {}).filter(([, value]) => value != null && value !== '')

  if (!entries.length) {
    return <p className="text-sm text-zinc-500">No legacy fields on this row.</p>
  }

  return (
    <dl className="space-y-3">
      {entries.map(([key, value]) => (
        <div key={key}>
          <dt className={fieldLabelClass}>{key}</dt>
          <dd className={legacyValueClass}>{String(value)}</dd>
        </div>
      ))}
    </dl>
  )
}

function queueItemKey(item) {
  return `${item.source}-${item.row_index}`
}

function confidenceTone(confidence) {
  if (confidence >= 0.9) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
  if (confidence >= 0.8) return 'text-amber-300 border-amber-500/30 bg-amber-500/10'
  return 'text-red-300 border-red-500/30 bg-red-500/10'
}

function ReviewStatusBadge({ status }) {
  if (status === 'approved') {
    return (
      <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-emerald-300 uppercase">
        Approved
      </span>
    )
  }
  if (status === 'rejected') {
    return (
      <span className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-red-300 uppercase">
        Rejected
      </span>
    )
  }
  return (
    <span className="rounded-md border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
      Pending
    </span>
  )
}

export default function ReviewQueueWorkbench({ items = [] }) {
  const [activeKey, setActiveKey] = useState(null)
  const [draft, setDraft] = useState(null)
  const [outcomes, setOutcomes] = useState({})

  const pendingKeys = useMemo(
    () => items.map(queueItemKey).filter((key) => !outcomes[key]),
    [items, outcomes],
  )

  const reviewedCount = items.length - pendingKeys.length

  const activeItem = useMemo(
    () => items.find((item) => queueItemKey(item) === activeKey) ?? null,
    [items, activeKey],
  )

  useEffect(() => {
    if (!items.length) {
      setActiveKey(null)
      setDraft(null)
      return
    }
    if (!activeKey || !items.some((item) => queueItemKey(item) === activeKey)) {
      const firstPending = items.find((item) => !outcomes[queueItemKey(item)])
      const nextKey = firstPending ? queueItemKey(firstPending) : queueItemKey(items[0])
      setActiveKey(nextKey)
    }
  }, [items, activeKey, outcomes])

  useEffect(() => {
    if (!activeItem) {
      setDraft(null)
      return
    }
    setDraft({ ...activeItem.suggested })
  }, [activeItem])

  function selectItem(item) {
    setActiveKey(queueItemKey(item))
  }

  function resolveItem(outcome, record) {
    if (!activeKey) return
    setOutcomes((current) => ({
      ...current,
      [activeKey]: { outcome, record, resolvedAt: Date.now() },
    }))
    const currentIndex = items.findIndex((item) => queueItemKey(item) === activeKey)
    for (let offset = 1; offset <= items.length; offset += 1) {
      const candidate = items[(currentIndex + offset) % items.length]
      const key = queueItemKey(candidate)
      if (!outcomes[key] && key !== activeKey) {
        setActiveKey(key)
        return
      }
    }
  }

  function handleApprove() {
    if (!draft) return
    resolveItem('approved', { ...draft })
  }

  function handleReject() {
    resolveItem('rejected', null)
  }

  function handleReset() {
    setOutcomes({})
    if (items[0]) setActiveKey(queueItemKey(items[0]))
  }

  if (!items.length) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-800 px-6 py-10 text-center text-sm text-zinc-500">
        Review queue is empty — all mappings cleared the confidence threshold.
      </p>
    )
  }

  const allReviewed = pendingKeys.length === 0

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3 sm:px-5">
        <div>
          <p className="text-sm font-medium text-zinc-100">Review workbench</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            {reviewedCount} of {items.length} resolved
            {pendingKeys.length ? ` · ${pendingKeys.length} awaiting review` : ' · queue clear'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-32 overflow-hidden rounded-full bg-zinc-800"
            role="progressbar"
            aria-valuenow={reviewedCount}
            aria-valuemin={0}
            aria-valuemax={items.length}
            aria-label="Review progress"
          >
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-300"
              style={{ width: `${(reviewedCount / items.length) * 100}%` }}
            />
          </div>
          {allReviewed ? (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100"
            >
              Reset demo
            </button>
          ) : null}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row lg:items-stretch">
        <aside className="flex max-h-72 shrink-0 flex-col border-b border-zinc-800 lg:max-h-none lg:w-60 lg:border-r lg:border-b-0">
          <p className="shrink-0 px-4 py-2 text-[10px] font-medium tracking-widest text-zinc-500 uppercase">
            Queue
          </p>
          <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {items.map((item) => {
              const key = queueItemKey(item)
              const outcome = outcomes[key]?.outcome
              const isActive = key === activeKey
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => selectItem(item)}
                    className={`flex w-full flex-col gap-1 border-l-2 px-4 py-3 text-left transition-colors ${
                      isActive
                        ? 'border-violet-400 bg-violet-500/10'
                        : 'border-transparent hover:bg-zinc-800/40'
                    }`}
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-zinc-200">
                        {item.suggested?.id ?? 'Pending'}
                      </span>
                      <ReviewStatusBadge status={outcome} />
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {(item.confidence * 100).toFixed(0)}% · {item.source}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        <div className="min-h-0 min-w-0 flex-1 p-4 sm:p-5">
          {allReviewed ? (
            <div className="flex min-h-[16rem] flex-col items-center justify-center rounded-lg border border-dashed border-emerald-500/30 bg-emerald-500/5 px-6 py-10 text-center">
              <p className="text-base font-medium text-emerald-200">Queue cleared</p>
              <p className="mt-2 max-w-sm text-sm text-zinc-400">
                Every low-confidence mapping was approved or rejected. In production, approved rows
                merge into the normalized dataset; rejected rows return to the pipeline or source
                team.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-6 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-600"
              >
                Run through queue again
              </button>
            </div>
          ) : activeItem && draft ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-mono text-lg text-zinc-100">{draft.id}</h3>
                    <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                      {activeItem.source}
                    </span>
                    <span
                      className={`rounded-md border px-2 py-0.5 text-xs font-medium ${confidenceTone(activeItem.confidence)}`}
                    >
                      {(activeItem.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{activeItem.reason}</p>
                </div>
              </div>

              {activeItem.decisions?.length ? (
                <div className="mt-4 rounded-lg border border-zinc-700/80 bg-zinc-900/60 p-3">
                  <p className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
                    AI mapping decisions
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {activeItem.decisions.map((decision) => (
                      <li key={`${decision.field}-${decision.source_value}`} className="text-xs text-zinc-400">
                        <span className="text-violet-300">{decision.method}</span>
                        {' · '}
                        <span className="text-zinc-300">{decision.field}</span>:{' '}
                        <span className="text-amber-300/90">{decision.source_value ?? '—'}</span>
                        {' → '}
                        <span className="text-teal-300">{decision.target_value ?? '—'}</span>
                        {decision.reason ? (
                          <span className="text-zinc-500"> ({decision.reason})</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-stretch">
                <div className="flex min-w-0 flex-col lg:h-full">
                  <p className="text-xs font-medium tracking-wide text-amber-400/90 uppercase">
                    Legacy source row
                  </p>
                  <div className="mt-2 flex flex-1 flex-col rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                    <LegacySnapshot legacy={activeItem.legacy} />
                  </div>
                </div>

                <div className="flex min-w-0 flex-col lg:h-full">
                  <p className="text-xs font-medium tracking-wide text-teal-400 uppercase">
                    Normalized target record
                  </p>
                  <form
                    className="mt-2 flex flex-1 flex-col space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3"
                    onSubmit={(event) => {
                      event.preventDefault()
                      handleApprove()
                    }}
                  >
                    <label className="block">
                      <span className={fieldLabelClass}>Category</span>
                      <select
                        value={draft.category ?? ''}
                        onChange={(event) =>
                          setDraft((current) => ({ ...current, category: event.target.value }))
                        }
                        className={fieldClass}
                      >
                        <option value="">Unset</option>
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className={fieldLabelClass}>Status</span>
                      <select
                        value={draft.status ?? ''}
                        onChange={(event) =>
                          setDraft((current) => ({ ...current, status: event.target.value }))
                        }
                        className={fieldClass}
                      >
                        {WORK_ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className={fieldLabelClass}>Site</span>
                      <input
                        type="text"
                        value={draft.site ?? ''}
                        onChange={(event) =>
                          setDraft((current) => ({ ...current, site: event.target.value }))
                        }
                        className={fieldClass}
                        placeholder="Site location"
                      />
                    </label>

                    <label className="block">
                      <span className={fieldLabelClass}>Owner</span>
                      <input
                        type="text"
                        value={draft.owner ?? ''}
                        onChange={(event) =>
                          setDraft((current) => ({ ...current, owner: event.target.value }))
                        }
                        className={fieldClass}
                      />
                    </label>

                    <div className="mt-auto flex flex-wrap gap-2 border-t border-zinc-800 pt-4">
                      <button
                        type="submit"
                        className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition-colors hover:bg-emerald-500/20"
                      >
                        Approve & next
                      </button>
                      <button
                        type="button"
                        onClick={handleReject}
                        className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10"
                      >
                        Reject
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {outcomes[activeKey] ? (
                <p className="mt-4 text-xs text-zinc-500">
                  This item was marked{' '}
                  <span className="text-zinc-300">{outcomes[activeKey].outcome}</span>. Select
                  another row or reset the demo.
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-zinc-500">Select a queue item to review.</p>
          )}
        </div>
      </div>
    </div>
  )
}
