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

  return (
    <div className="overflow-hidden rounded-lg border border-emerald-900/40 bg-zinc-950 shadow-inner">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3 py-2">
        <p className="text-xs font-medium text-zinc-500">Operations queue — redesigned</p>
        <span className="rounded bg-emerald-950/80 px-2 py-0.5 text-[10px] font-medium text-emerald-300 uppercase">
          After
        </span>
      </div>

      <div className="max-h-80 overflow-auto">
        <table className="w-full table-fixed text-left text-xs">
          <OperationsTableColgroup variant="after" />
          <thead className="sticky top-0 z-10 bg-zinc-900 text-zinc-500 shadow-[0_1px_0_0_rgb(39_39_42)]">
            <tr>
              <SortableFilterableColumnHeader
                label="Work order"
                sortKey="id"
                sort={sort}
                onSort={toggleSort}
                filterValue={filters.id}
                onFilterChange={setFilter}
                className="px-3 py-2 pl-3 font-normal align-top"
              />
              <SortableFilterableColumnHeader
                label="Asset ID"
                sortKey="asset"
                sort={sort}
                onSort={toggleSort}
                filterValue={filters.asset}
                onFilterChange={setFilter}
              />
              <SortableFilterableColumnHeader
                label="Site location"
                sortKey="site"
                sort={sort}
                onSort={toggleSort}
                filterValue={filters.site}
                onFilterChange={setFilter}
              />
              <SortableFilterableColumnHeader
                label="Category"
                sortKey="category"
                sort={sort}
                onSort={toggleSort}
                filterValue={filters.category}
                onFilterChange={setFilter}
              />
              <SortableFilterableColumnHeader
                label="Assigned technician"
                sortKey="owner"
                sort={sort}
                onSort={toggleSort}
                filterValue={filters.owner}
                onFilterChange={setFilter}
              />
              <SortableFilterableColumnHeader
                label="Est. repair cost"
                sortKey="price"
                sort={sort}
                onSort={toggleSort}
                filterValue={filters.price}
                onFilterChange={setFilter}
              />
              <SortableFilterableColumnHeader
                label="Last updated"
                sortKey="updated"
                sort={sort}
                onSort={toggleSort}
                filterValue={filters.updated}
                onFilterChange={setFilter}
              />
              <SortableFilterableColumnHeader
                label="Status"
                sortKey="status"
                sort={sort}
                onSort={toggleSort}
                filterType="status"
                filterValue={filters.status}
                onFilterChange={setFilter}
              />
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
                <td className={`px-3 py-2.5 pl-3 font-medium text-zinc-200 ${numericCellClass}`}>
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
                  <WorkOrderRowActions
                    row={row}
                    onComplete={handleCompleteWorkOrder}
                    onRestart={handleRestartWorkOrder}
                    onEdit={setEditingRow}
                    onDownload={downloadWorkOrderRow}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
