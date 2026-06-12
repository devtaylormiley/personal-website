import { formatPrice } from './mockRows'
import { numericCellClass } from './OperationsTableColgroup'
import { getStatusTextClass } from './workOrderConstants'
import WorkOrderRowActions from './WorkOrderRowActions'

function nullDash(value) {
  if (value == null || value === '') {
    return <span className="text-zinc-600">—</span>
  }
  return value
}

const CARD_FIELDS = [
  { key: 'asset', label: 'Asset ID' },
  { key: 'site', label: 'Site location' },
  { key: 'category', label: 'Category' },
  { key: 'owner', label: 'Assigned technician' },
  { key: 'price', label: 'Est. repair cost', format: (value) => (value == null ? null : formatPrice(value)) },
  { key: 'updated', label: 'Last updated' },
]

export default function OperationsTableAfterCards({
  rows,
  onComplete,
  onRestart,
  onEdit,
  onDownload,
}) {
  if (rows.length === 0) {
    return (
      <p className="px-3 py-10 text-center text-sm text-zinc-500">No work orders match your filters.</p>
    )
  }

  return (
    <ul className="operations-table-after__cards divide-y divide-zinc-800/80">
      {rows.map((row, index) => (
        <li
          key={row.id}
          className={`operations-table-after__card p-3 sm:p-4 ${
            index % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/40'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className={`text-sm font-medium text-zinc-200 ${numericCellClass}`}>
                {nullDash(row.id)}
              </p>
              <p className="mt-1">
                {row.status == null || row.status === '' ? (
                  nullDash(row.status)
                ) : (
                  <span className={`text-xs font-medium ${getStatusTextClass(row.status)}`}>
                    {row.status}
                  </span>
                )}
              </p>
            </div>
            <WorkOrderRowActions
              row={row}
              onComplete={onComplete}
              onRestart={onRestart}
              onEdit={onEdit}
              onDownload={onDownload}
            />
          </div>

          <dl className="mt-3 grid grid-cols-[minmax(0,7.5rem)_1fr] gap-x-3 gap-y-2 text-xs">
            {CARD_FIELDS.map(({ key, label, format }) => {
              const raw = row[key]
              const value = format ? format(raw) : raw
              return (
                <div key={key} className="contents">
                  <dt className="text-zinc-500">{label}</dt>
                  <dd className={`min-w-0 break-words text-zinc-300 ${key === 'price' || key === 'updated' ? numericCellClass : ''}`}>
                    {value == null || value === '' ? nullDash(value) : value}
                  </dd>
                </div>
              )
            })}
          </dl>
        </li>
      ))}
    </ul>
  )
}
