import { useCallback, useMemo, useState } from 'react'
import { ButtonIcon } from '../../ui/buttonIcons'
import { formatPrice, tableRows as initialTableRows } from './mockRows'
import OperationsTableColgroup, { assetIdCellClass } from './OperationsTableColgroup'
import OperationsTableSearchBar from './OperationsTableSearchBar'
import { useOperationsTableFilter } from './useOperationsTableFilter'
import WorkOrderEditModal from './WorkOrderEditModal'
import WorkOrderLink from './WorkOrderLink'
import { getOperationSites } from './workOrderConstants'

function downloadWorkOrderRow(row) {
  const blob = new Blob([JSON.stringify(row, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${row.id}.json`
  link.click()
  URL.revokeObjectURL(url)
}

/** Legacy anti-pattern: icon looks clickable but is not a focusable control. */
function InaccessibleDownloadIcon({ row }) {
  return (
    <span
      role="presentation"
      tabIndex={-1}
      title="Download"
      onClick={() => downloadWorkOrderRow(row)}
      className="ml-1 inline-flex cursor-pointer align-middle text-violet-400 hover:text-violet-300"
      aria-hidden="true"
    >
      <ButtonIcon label="Download" className="h-3 w-3" />
    </span>
  )
}

function OperationsQueueActionsTable({ rows }) {
  return (
    <div className="max-h-72 overflow-auto rounded border border-zinc-800">
      <table className="w-full table-fixed text-left text-xs">
        <OperationsTableColgroup variant="actions" />
        <thead className="bg-zinc-900 text-zinc-500">
          <tr>
            <th className="px-2 py-2 pl-3 font-normal">Assigned technician</th>
            <th className="px-2 py-2 font-normal">
              <span className="sr-only">Complete order</span>
            </th>
            <th className="px-2 py-2 font-normal">Work order / Asset ID</th>
            <th className="px-2 py-2 font-normal">Site location</th>
            <th className="px-2 py-2 font-normal">Status</th>
            <th className="px-2 py-2 font-normal">Est. repair cost</th>
            <th className="px-2 py-2 font-normal">Last updated</th>
            <th className="px-2 py-2 font-normal">Category</th>
          </tr>
        </thead>
        <tbody className="bg-zinc-950 text-zinc-300">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-3 py-8 text-center text-zinc-500">
                No work orders match your filters.
              </td>
            </tr>
          ) : null}
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-zinc-800/80">
              <td className="px-2 py-2.5 pl-3">{row.owner ?? ''}</td>
              <td className="px-2 py-2.5">
                <button
                  type="button"
                  className="whitespace-nowrap rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-[10px] font-medium text-zinc-200 hover:border-violet-500 hover:bg-violet-950/40"
                >
                  Complete Order
                </button>
              </td>
              <td className={`px-2 py-2.5 ${assetIdCellClass}`}>
                {row.id} / {row.asset}
              </td>
              <td className="px-2 py-2.5">{row.site ?? ''}</td>
              <td className="px-2 py-2.5">{row.status}</td>
              <td className="px-2 py-2.5">
                {formatPrice(row.price) ?? ''}
              </td>
              <td className="px-2 py-2.5 text-zinc-500">{row.updated}</td>
              <td className="px-2 py-2.5">{row.category ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OperationsQueueTable({ rows, onEditWorkOrder, onRestartWorkOrder }) {
  return (
    <div className="max-h-72 overflow-auto rounded border border-zinc-800">
      <table className="w-full table-fixed text-left text-xs">
        <OperationsTableColgroup />
        <thead className="bg-zinc-900 text-zinc-500">
          <tr>
            <th className="px-3 py-2 pl-3 font-normal">Work order</th>
            <th className="px-2 py-2 font-normal">Asset ID</th>
            <th className="px-2 py-2 font-normal">Site location</th>
            <th className="px-2 py-2 font-normal">Status</th>
            <th className="px-2 py-2 font-normal">Assigned technician</th>
            <th className="px-2 py-2 font-normal">Est. repair cost</th>
            <th className="px-2 py-2 font-normal">Last updated</th>
            <th className="px-2 py-2 font-normal">Category</th>
          </tr>
        </thead>
        <tbody className="bg-zinc-950 text-zinc-300">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-3 py-8 text-center text-zinc-500">
                No work orders match your filters.
              </td>
            </tr>
          ) : null}
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-zinc-800/80">
              <td className="px-3 py-2.5 pl-3">
                <WorkOrderLink workOrderId={row.id} onOpen={() => onEditWorkOrder(row)} />
              </td>
              <td className={`px-2 py-2.5 ${assetIdCellClass}`}>
                <span className="inline-flex items-center gap-0.5">
                  {row.asset}
                  <InaccessibleDownloadIcon row={row} />
                </span>
              </td>
              <td className="px-2 py-2.5">{row.site ?? ''}</td>
              <td className="px-2 py-2.5">
                {row.status === 'Closed' ? (
                  <>
                    Closed{' '}
                    <button
                      type="button"
                      onClick={() => onRestartWorkOrder(row)}
                      className="text-violet-400 hover:text-violet-300 hover:underline"
                    >
                      Restart
                    </button>
                  </>
                ) : (
                  row.status
                )}
              </td>
              <td className="px-2 py-2.5">{row.owner ?? ''}</td>
              <td className="px-2 py-2.5">
                {formatPrice(row.price) ?? ''}
              </td>
              <td className="px-2 py-2.5 text-zinc-500">{row.updated}</td>
              <td className="px-2 py-2.5">{row.category ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const ACTIONS_TAB_STATUSES = new Set(['Ready', 'In progress'])

/**
 * Before: queue split across Search and Pending Orders tabs; Pending Orders shows Search filters + active statuses.
 */
export default function OperationsTableBefore() {
  const [tab, setTab] = useState('search')
  const [rows, setRows] = useState(() => initialTableRows.map((row) => ({ ...row })))
  const [editingRow, setEditingRow] = useState(null)

  const { keyword, setKeyword, site, setSite, filteredRows } = useOperationsTableFilter(rows)
  const siteOptions = useMemo(() => getOperationSites(rows), [rows])

  const actionRows = useMemo(
    () => filteredRows.filter((row) => ACTIONS_TAB_STATUSES.has(row.status)),
    [filteredRows],
  )

  const handleSaveWorkOrder = useCallback((updatedRow) => {
    setRows((current) =>
      current.map((row) => (row.id === updatedRow.id ? updatedRow : row)),
    )
    setEditingRow(null)
  }, [])

  const handleRestartWorkOrder = useCallback((row) => {
    setRows((current) =>
      current.map((item) =>
        item.id === row.id ? { ...item, status: 'Ready' } : item,
      ),
    )
  }, [])

  return (
    <div className="overflow-hidden rounded-lg border border-red-900/40 bg-zinc-950 shadow-inner">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3 py-2">
        <p className="text-xs font-medium text-zinc-500">Operations queue — legacy layout</p>
        <span className="rounded bg-red-950/80 px-2 py-0.5 text-[10px] font-medium text-red-300 uppercase">
          Before
        </span>
      </div>

      <div className="flex gap-0 border-b border-zinc-800">
        <button
          type="button"
          onClick={() => setTab('search')}
          className={`px-4 py-2.5 text-xs font-medium ${
            tab === 'search'
              ? 'border-b-2 border-violet-500 bg-zinc-900 text-zinc-100'
              : 'text-zinc-500 hover:text-zinc-400'
          }`}
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setTab('actions')}
          className={`px-4 py-2.5 text-xs font-medium ${
            tab === 'actions'
              ? 'border-b-2 border-violet-500 bg-zinc-900 text-zinc-100'
              : 'text-zinc-500 hover:text-zinc-400'
          }`}
        >
          Pending Orders
        </button>
      </div>

      {tab === 'search' ? (
        <div className="space-y-3 p-3">
          <OperationsTableSearchBar
            keyword={keyword}
            onKeywordChange={setKeyword}
            site={site}
            onSiteChange={setSite}
            sites={siteOptions}
          />
          <OperationsQueueTable
            rows={filteredRows}
            onEditWorkOrder={setEditingRow}
            onRestartWorkOrder={handleRestartWorkOrder}
          />
        </div>
      ) : (
        <div className="p-3">
          <OperationsQueueActionsTable rows={actionRows} />
        </div>
      )}

      {editingRow ? (
        <WorkOrderEditModal
          row={editingRow}
          allRows={rows}
          onClose={() => setEditingRow(null)}
          onSave={handleSaveWorkOrder}
        />
      ) : null}
    </div>
  )
}
