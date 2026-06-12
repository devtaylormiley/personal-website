import { OPERATIONS_AFTER_COLUMNS } from './operationsTableColumns'

const filterInputClass =
  'w-full min-w-0 rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600'

export default function OperationsTableFilterPanel({
  filters,
  onFilterChange,
  sort,
  onSort,
  className = '',
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div>
        <p className="text-[10px] font-medium tracking-wide text-zinc-500 uppercase">Sort by</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {OPERATIONS_AFTER_COLUMNS.map(({ key, label }) => {
            const isActive = sort.key === key
            const indicator = !isActive ? '' : sort.direction === 'asc' ? ' ↑' : ' ↓'
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSort(key)}
                className={`cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'border-violet-500/60 bg-violet-950/50 text-violet-200'
                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                }`}
                aria-sort={
                  isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'
                }
              >
                {label}
                {indicator}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-medium tracking-wide text-zinc-500 uppercase">Filters</p>
        <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
          {OPERATIONS_AFTER_COLUMNS.map(({ key, label, filterType }) => (
            <label key={key} className="block min-w-0">
              <span className="mb-1 block text-[11px] text-zinc-500">{label}</span>
              {filterType === 'status' ? (
                <select
                  value={filters[key]}
                  onChange={(event) => onFilterChange(key, event.target.value)}
                  className={filterInputClass}
                >
                  <option value="all">All</option>
                  <option value="Ready">Ready</option>
                  <option value="In progress">In progress</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Closed">Closed</option>
                </select>
              ) : (
                <input
                  type="search"
                  value={filters[key]}
                  onChange={(event) => onFilterChange(key, event.target.value)}
                  placeholder="Filter…"
                  className={filterInputClass}
                />
              )}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
