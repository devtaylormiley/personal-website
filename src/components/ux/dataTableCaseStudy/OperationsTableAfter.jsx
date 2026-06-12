import { useCallback, useState } from 'react'
import { formatPrice, tableRows as initialTableRows } from './mockRows'
import OperationsTableColgroup, {
  assetIdCellClassAfter,
  numericCellClass,
} from './OperationsTableColgroup'
import { useColumnFilters } from './useColumnFilters'
import { getStatusTextClass } from './workOrderConstants'
import SortableFilterableColumnHeader from './SortableFilterableColumnHeader'
import { useTableSort } from './useTableSort'
import WorkOrderEditModal from './WorkOrderEditModal'
import WorkOrderRowActions from './WorkOrderRowActions'
import OperationsTableAfterCards from './OperationsTableAfterCards'
import OperationsTableFilterPanel from './OperationsTableFilterPanel'
import { OPERATIONS_AFTER_COLUMNS } from './operationsTableColumns'

function nullDash(value) {
  if (value == null || value === '') {
    return <span className="text-zinc-600">—</span>
  }
  return value
}

function downloadWorkOrderRow(row) {
  const blob = new Blob([JSON.stringify(row, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${row.id}.json`
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * After: sticky header, zebra rows, per-column filters, row actions column.
 * Mobile: card list with collapsible filters. Tablet+: scrollable table with sticky work-order column.
 */
export default function OperationsTableAfter() {
  const [rows, setRows] = useState(() => initialTableRows.map((row) => ({ ...row })))
  const [editingRow, setEditingRow] = useState(null)

  const { filters, setFilter, filteredRows } = useColumnFilters(rows)
  const { sortedRows, sort, toggleSort } = useTableSort(filteredRows)

  const handleSaveWorkOrder = useCallback((updatedRow) => {
    setRows((current) =>
      current.map((row) => (row.id === updatedRow.id ? updatedRow : row)),
    )
    setEditingRow(null)
  }, [])

  const handleCompleteWorkOrder = useCallback((row) => {
    setRows((current) =>
      current.map((item) =>
        item.id === row.id ? { ...item, status: 'Closed' } : item,
      ),
    )
  }, [])

  const handleRestartWorkOrder = useCallback((row) => {
    setRows((current) =>
      current.map((item) =>
        item.id === row.id ? { ...item, status: 'Ready' } : item,
      ),
    )
  }, [])

  const rowActionProps = {
    onComplete: handleCompleteWorkOrder,
    onRestart: handleRestartWorkOrder,
    onEdit: setEditingRow,
    onDownload: downloadWorkOrderRow,
  }

  return (
    <div className="operations-table-after overflow-hidden rounded-lg border border-emerald-900/40 bg-zinc-950 shadow-inner">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3 py-2">
        <p className="text-xs font-medium text-zinc-500">Operations queue — redesigned</p>
        <span className="rounded bg-emerald-950/80 px-2 py-0.5 text-[10px] font-medium text-emerald-300 uppercase">
          After
        </span>
      </div>

      <div className="md:hidden">
        <details className="operations-table-after__mobile-filters group">
          <summary className="flex items-center justify-between px-3 py-2.5 text-xs font-medium text-zinc-300">
            <span>Filters &amp; sort</span>
            <span className="text-zinc-500 transition-transform group-open:rotate-180" aria-hidden="true">
              ▾
            </span>
          </summary>
          <div className="border-t border-zinc-800 px-3 py-3">
            <OperationsTableFilterPanel
              filters={filters}
              onFilterChange={setFilter}
              sort={sort}
              onSort={toggleSort}
            />
          </div>
        </details>

        <OperationsTableAfterCards rows={sortedRows} {...rowActionProps} />
      </div>

      <div className="hidden md:block">
        <p className="operations-table-after__scroll-hint" aria-hidden="true">
          <span>↔</span>
          <span>Scroll for more columns</span>
        </p>

        <div className="operations-table-after__viewport operations-table-after__viewport--wide">
          <table className="operations-table-after__table">
            <OperationsTableColgroup variant="after" />
            <thead className="sticky top-0 z-10 bg-zinc-900 text-zinc-500">
              <tr>
                {OPERATIONS_AFTER_COLUMNS.map(({ key, label, filterType }) => (
                  <SortableFilterableColumnHeader
                    key={key}
                    label={label}
                    sortKey={key}
                    sort={sort}
                    onSort={toggleSort}
                    filterType={filterType}
                    filterValue={filters[key]}
                    onFilterChange={setFilter}
                    className={`px-2 py-2 font-normal align-top ${
                      key === 'id' ? 'operations-table-after__sticky-col px-3 pl-3' : ''
                    }`}
                  />
                ))}
                <th className="px-1 py-2 pr-2 text-right font-normal align-top">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {sortedRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 py-8 text-center text-zinc-500">
                    No work orders match your filters.
                  </td>
                </tr>
              ) : null}
              {sortedRows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`border-t border-zinc-800/60 ${
                    index % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/40'
                  }`}
                >
                  <td
                    className={`operations-table-after__sticky-col px-3 py-2.5 pl-3 font-medium text-zinc-200 ${numericCellClass}`}
                  >
                    {nullDash(row.id)}
                  </td>
                  <td className={`px-2 py-2.5 ${assetIdCellClassAfter}`}>{nullDash(row.asset)}</td>
                  <td className="px-2 py-2.5">{nullDash(row.site)}</td>
                  <td className="px-2 py-2.5">{nullDash(row.category)}</td>
                  <td className="px-2 py-2.5">{nullDash(row.owner)}</td>
                  <td className={`px-2 py-2.5 ${numericCellClass}`}>
                    {row.price == null ? (
                      <span className="text-zinc-600">—</span>
                    ) : (
                      formatPrice(row.price)
                    )}
                  </td>
                  <td className={`px-2 py-2.5 text-zinc-500 ${numericCellClass}`}>
                    {nullDash(row.updated)}
                  </td>
                  <td className="px-2 py-2.5">
                    {row.status == null || row.status === '' ? (
                      nullDash(row.status)
                    ) : (
                      <span className={getStatusTextClass(row.status)}>{row.status}</span>
                    )}
                  </td>
                  <td className="px-1 py-2.5 pr-2 text-right align-top">
                    <WorkOrderRowActions row={row} {...rowActionProps} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
