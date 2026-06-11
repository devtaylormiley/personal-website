import { useId } from 'react'

const filterTriggerClass =
  'bf-input bf-registry-filter-control w-full min-w-0 rounded-lg px-3 text-xs'

export default function RulesMultiSelectFilter({
  options,
  selected,
  onChange,
  label = 'Rules',
  className = '',
}) {
  const listId = useId()
  const summary =
    selected.length === 0
      ? 'All rules'
      : selected.length === 1
        ? selected[0]
        : `${selected.length} rules`

  function toggleRule(rule) {
    if (selected.includes(rule)) {
      onChange(selected.filter((item) => item !== rule))
      return
    }
    onChange([...selected, rule])
  }

  return (
    <details className={`group relative min-w-0 ${className}`}>
      <summary
        className={`${filterTriggerClass} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
        aria-label={`Filter ${label}`}
      >
        <span className="flex min-w-0 flex-1 items-center justify-between gap-1">
          <span className="truncate">{summary}</span>
          <span className="shrink-0 text-[var(--bf-text-muted)]" aria-hidden="true">
            ▾
          </span>
        </span>
      </summary>
      <div
        id={listId}
        className="absolute left-0 z-30 mt-0.5 max-h-52 min-w-[12rem] overflow-y-auto border border-[var(--bf-border-bright)] bg-[var(--bf-bg-elevated)] p-1 shadow-[0_0_16px_rgb(0_0_0/0.85)]"
      >
        <div className="flex items-center justify-between gap-2 border-b border-[var(--bf-border)] px-2 py-1">
          <span className="text-[9px] tracking-wider text-[var(--bf-text-muted)] uppercase">
            {label}
          </span>
          {selected.length > 0 ? (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-[9px] text-[var(--bf-accent-bright)] hover:text-[var(--bf-accent)]"
            >
              Clear
            </button>
          ) : null}
        </div>
        {options.length === 0 ? (
          <p className="bf-muted px-2 py-2 text-[10px]">No rules in data.</p>
        ) : (
          <ul className="py-1">
            {options.map((rule) => (
              <li key={rule}>
                <label className="flex cursor-pointer items-start gap-2 px-2 py-1 hover:bg-[var(--bf-accent-bg)]">
                  <input
                    type="checkbox"
                    checked={selected.includes(rule)}
                    onChange={() => toggleRule(rule)}
                    className="mt-0.5 accent-[var(--bf-accent)]"
                  />
                  <span className="leading-snug text-[var(--bf-text)]">{rule}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  )
}
