export default function SortableColumnHeader({
  label,
  sortKey,
  sort,
  onSort,
  className = 'px-2 py-2 font-normal',
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
    </th>
  )
}
