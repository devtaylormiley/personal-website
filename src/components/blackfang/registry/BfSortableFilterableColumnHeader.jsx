import RulesMultiSelectFilter from './RulesMultiSelectFilter'

const filterInputClass =
  'mt-1 w-full min-w-0 border border-[var(--bf-border)] bg-[var(--bf-bg)] px-1 py-0.5 text-[10px] text-[var(--bf-text)] placeholder:text-[var(--bf-text-muted)]'

export default function BfSortableFilterableColumnHeader({
  label,
  sortKey,
  sort,
  onSort,
  filterType = 'text',
  filterValue,
  onFilterChange,
  ruleOptions = [],
  filterPlaceholder = 'Filter…',
  className = 'px-3 py-2 align-top',
}) {
  const isActive = sort.key === sortKey
  const indicator = !isActive ? '↕' : sort.direction === 'asc' ? '↑' : '↓'

  return (
    <th className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex max-w-full items-center gap-1 text-left hover:text-[var(--bf-accent-bright)] ${
          isActive ? 'text-[var(--bf-accent-bright)]' : 'text-[var(--bf-text-muted)]'
        }`}
        aria-sort={
          isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'
        }
      >
        <span>{label}</span>
        <span className="text-[10px] opacity-70" aria-hidden="true">
          {indicator}
        </span>
      </button>
      {filterType === 'rules' ? (
        <RulesMultiSelectFilter
          options={ruleOptions}
          selected={filterValue}
          onChange={(next) => onFilterChange(sortKey, next)}
          label={label}
        />
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
