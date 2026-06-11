const filterInputClass =
  'mt-1 w-full min-w-0 rounded border border-zinc-700 bg-zinc-950 px-1 py-0.5 text-[10px] text-zinc-300 placeholder:text-zinc-600'

export default function SortableFilterableColumnHeader({
  label,
  sortKey,
  sort,
  onSort,
  filterType = 'text',
  filterValue,
  onFilterChange,
  filterPlaceholder = 'Filter…',
  className = 'px-2 py-2 font-normal align-top',
}) {
  const isActive = sort.key === sortKey
  const indicator = !isActive ? '↕' : sort.direction === 'asc' ? '↑' : '↓'

  return (
    <th className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex max-w-full items-center gap-1 text-left hover:text-zinc-200 ${
          isActive ? 'text-zinc-200' : ''
        }`}
        aria-sort={
          isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'
        }
      >
        <span>{label}</span>
        <span className="text-[10px] text-zinc-500" aria-hidden="true">
          {indicator}
        </span>
      </button>
      {filterType === 'status' ? (
        <select
          value={filterValue}
          onChange={(event) => onFilterChange(sortKey, event.target.value)}
          className={filterInputClass}
          aria-label={`Filter ${label}`}
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
          value={filterValue}
          onChange={(event) => onFilterChange(sortKey, event.target.value)}
          placeholder={filterPlaceholder}
          className={filterInputClass}
          aria-label={`Filter ${label}`}
        />
      )}
    </th>
  )
}
