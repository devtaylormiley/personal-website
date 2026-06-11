const STATS = [
  { key: 'move', label: 'Move' },
  { key: 'apl', label: 'APL', type: 'number' },
  { key: 'save', label: 'Save' },
  { key: 'wounds', label: 'Wounds', type: 'number' },
]

export default function OperativeCardStatRibbon({ operative, editable, onFieldChange, compact, inline = false }) {
  const labelClass = inline
    ? compact
      ? 'text-[10px]'
      : 'text-xs'
    : compact
      ? 'text-[8px]'
      : 'text-[9px]'
  const valueClass = inline
    ? compact
      ? 'text-base'
      : 'text-lg'
    : compact
      ? 'text-xs'
      : 'text-sm'
  const cellPad = inline
    ? compact
      ? 'min-w-[3.25rem] px-2.5 py-0.5'
      : 'min-w-[4rem] px-4 py-1'
    : compact
      ? 'px-2 py-1.5'
      : 'px-3 py-2'

  const grid = (
    <div
      className={
        inline
          ? 'grid grid-cols-4 gap-x-3 sm:gap-x-4'
          : 'grid grid-cols-4 divide-x divide-amber-900/50'
      }
    >
      {STATS.map(({ key, label, type }) => (
        <div key={key} className={`text-left ${cellPad}`}>
          <p
            className={`font-semibold tracking-[0.15em] text-[var(--bf-field-muted)] uppercase ${labelClass}`}
          >
            {label}
          </p>
          {editable && onFieldChange ? (
            <input
              type={type === 'number' ? 'number' : 'text'}
              value={String(operative[key] ?? '')}
              onChange={(e) =>
                onFieldChange(key, type === 'number' ? Number(e.target.value) || 0 : e.target.value)
              }
              className={`mt-0.5 w-full min-w-0 bg-transparent text-left font-bold text-[var(--bf-field)] outline-none focus:text-[var(--bf-text-bright)] ${valueClass}`}
            />
          ) : (
            <p className={`mt-0.5 font-bold text-[var(--bf-field)] ${valueClass}`}>
              {operative[key] ?? '—'}
            </p>
          )}
        </div>
      ))}
    </div>
  )

  if (inline) {
    return (
      <div className="operative-card-stat-ribbon operative-card-stat-ribbon--inline shrink-0">
        {grid}
      </div>
    )
  }

  return <div className="operative-card-stat-ribbon border-y border-amber-800/40">{grid}</div>
}
