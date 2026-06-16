import { useEffect, useState } from 'react'
import {
  getOperationCategories,
  getOperationSites,
  WORK_ORDER_EDITABLE_STATUSES,
} from './workOrderConstants'

const fieldClass =
  'w-full rounded border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-sm text-zinc-200'

const numericFieldClass = `${fieldClass} font-mono tabular-nums`

function emptyToNull(value) {
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

export default function WorkOrderEditModal({ row, allRows, onClose, onSave }) {
  const [draft, setDraft] = useState(() => ({ ...row, priceInput: row.price ?? '' }))

  useEffect(() => {
    setDraft({ ...row, priceInput: row.price ?? '' })
  }, [row])

  const siteOptions = getOperationSites(allRows)
  const categoryOptions = getOperationCategories(allRows)

  function handleSubmit(event) {
    event.preventDefault()
    const priceRaw = String(draft.priceInput).trim()
    let price = null
    if (priceRaw !== '') {
      const parsed = Number(priceRaw)
      if (Number.isNaN(parsed) || parsed < 0) return
      price = parsed
    }

    onSave({
      ...row,
      asset: draft.asset.trim(),
      site: emptyToNull(draft.site ?? ''),
      status: row.status === 'Closed' ? 'Closed' : draft.status,
      owner: emptyToNull(draft.owner ?? ''),
      price,
      updated: draft.updated,
      category: emptyToNull(draft.category ?? ''),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-work-order-title"
      onClick={onClose}
    >
      <form
        className="w-full max-w-lg rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-zinc-800 px-4 py-3">
          <h2 id="edit-work-order-title" className="text-sm font-medium text-zinc-100">
            Edit work order
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500">{row.id}</p>
        </div>

        <div className="grid gap-3 px-4 py-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs text-zinc-400">Work order</span>
            <input type="text" value={row.id} readOnly className={`${numericFieldClass} text-zinc-500`} />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs text-zinc-400">Asset ID</span>
            <input
              type="text"
              value={draft.asset}
              onChange={(e) => setDraft((d) => ({ ...d, asset: e.target.value }))}
              className={fieldClass}
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs text-zinc-400">Site location</span>
            <select
              value={draft.site ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, site: e.target.value }))}
              className={fieldClass}
            >
              <option value="">None</option>
              {draft.site && !siteOptions.includes(draft.site) ? (
                <option value={draft.site}>{draft.site}</option>
              ) : null}
              {siteOptions.map((siteName) => (
                <option key={siteName} value={siteName}>
                  {siteName}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs text-zinc-400">Status</span>
            {row.status === 'Closed' ? (
              <input
                type="text"
                value="Closed"
                readOnly
                className={`${fieldClass} text-zinc-500`}
                aria-readonly="true"
              />
            ) : (
              <select
                value={draft.status}
                onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                className={fieldClass}
              >
                {WORK_ORDER_EDITABLE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            )}
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs text-zinc-400">Assigned technician</span>
            <input
              type="text"
              value={draft.owner ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, owner: e.target.value }))}
              className={fieldClass}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs text-zinc-400">Est. repair cost (USD)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={draft.priceInput}
              onChange={(e) => setDraft((d) => ({ ...d, priceInput: e.target.value }))}
              className={numericFieldClass}
              placeholder="Leave empty if unknown"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs text-zinc-400">Last updated</span>
            <input
              type="date"
              value={draft.updated}
              onChange={(e) => setDraft((d) => ({ ...d, updated: e.target.value }))}
              className={numericFieldClass}
              required
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs text-zinc-400">Category</span>
            <input
              type="text"
              list="work-order-categories"
              value={draft.category ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
              className={fieldClass}
            />
            <datalist id="work-order-categories">
              {categoryOptions.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-zinc-800 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-violet-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
