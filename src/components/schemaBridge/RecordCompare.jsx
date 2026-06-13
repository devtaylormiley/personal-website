import ConfidenceBadge from './ConfidenceBadge'
import SourceBadge from './SourceBadge'

function FieldRow({ label, before, after, changed }) {
  return (
    <div
      className={`grid grid-cols-[minmax(0,7rem)_1fr_1fr] gap-3 border-b border-zinc-800/60 px-4 py-2 text-sm last:border-b-0 sm:grid-cols-[minmax(0,8rem)_1fr_1fr]`}
    >
      <span className="font-medium text-zinc-500">{label}</span>
      <span className={`break-all ${changed ? 'text-zinc-500 line-through decoration-zinc-600' : 'text-zinc-300'}`}>
        {before ?? '—'}
      </span>
      <span className={`break-all ${changed ? 'text-teal-300' : 'text-zinc-300'}`}>
        {after ?? '—'}
      </span>
    </div>
  )
}

function formatLegacyValue(key, value) {
  if (value == null || value === '') return '—'
  return String(value)
}

function formatSuggestedValue(key, value) {
  if (value == null) return '—'
  if (key === 'price' && typeof value === 'number') {
    return value.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
  }
  return String(value)
}

const TARGET_FIELDS = [
  { key: 'id', legacyKeys: ['WO #', 'WorkOrderID', 'order_num'] },
  { key: 'asset', legacyKeys: ['Asset Tag', 'equipment_id', 'asset_code'] },
  { key: 'site', legacyKeys: ['Location', 'facility', 'site_name'] },
  { key: 'status', legacyKeys: ['State', 'status_code', 'wo_status'] },
  { key: 'owner', legacyKeys: ['Assigned To', 'tech_name', 'owner_initials'] },
  { key: 'priority', legacyKeys: ['Urgency', 'priority_level', 'prio'] },
  { key: 'price', legacyKeys: ['Cost', 'estimate', 'amount'] },
  { key: 'updated', legacyKeys: ['Last Modified', 'date_updated', 'modified_on'] },
  { key: 'category', legacyKeys: ['Notes', 'work_description', 'comments'] },
]

function legacyValueForField(legacy, legacyKeys) {
  for (const key of legacyKeys) {
    if (key in legacy && legacy[key] != null && legacy[key] !== '') {
      return legacy[key]
    }
  }
  return null
}

export default function RecordCompare({ item }) {
  if (!item) return null

  const { legacy, suggested, decisions = [], confidence, reason, source } = item

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30">
      <header className="border-b border-zinc-800 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge source={source} />
          <span className="text-sm text-zinc-300">
            Row {item.row_index + 1}
          </span>
          <ConfidenceBadge confidence={confidence} suffix="confidence" />
        </div>
        {reason ? <p className="mt-2 text-xs text-zinc-500">{reason}</p> : null}
      </header>

      <div className="grid grid-cols-[minmax(0,7rem)_1fr_1fr] gap-3 border-b border-zinc-800 bg-zinc-900/50 px-4 py-2 text-xs font-medium tracking-wide text-zinc-500 uppercase sm:grid-cols-[minmax(0,8rem)_1fr_1fr] sm:px-5">
        <span>Field</span>
        <span>Legacy</span>
        <span>Normalized</span>
      </div>

      <div>
        {TARGET_FIELDS.map(({ key, legacyKeys }) => {
          const before = legacyValueForField(legacy, legacyKeys)
          const after = suggested[key]
          const changed =
            before != null &&
            after != null &&
            String(before).trim().toLowerCase() !== String(after).trim().toLowerCase()
          return (
            <FieldRow
              key={key}
              label={key}
              before={formatLegacyValue(key, before)}
              after={formatSuggestedValue(key, after)}
              changed={changed}
            />
          )
        })}
      </div>

      {decisions.length ? (
        <footer className="border-t border-zinc-800 px-4 py-3 sm:px-5">
          <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
            Mapping decisions
          </p>
          <ul className="mt-2 space-y-2">
            {decisions.map((decision) => (
              <li key={`${decision.field}-${decision.source_value}`} className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                <span className="min-w-0 flex-1">
                  <span className="text-teal-300">{decision.method}</span>
                  {' · '}
                  {decision.field}: {decision.source_value ?? '—'}
                  {' → '}
                  {decision.target_value ?? '—'}
                  {decision.reason ? ` (${decision.reason})` : ''}
                </span>
                {decision.confidence != null ? (
                  <ConfidenceBadge confidence={decision.confidence} compact />
                ) : null}
              </li>
            ))}
          </ul>
        </footer>
      ) : null}
    </article>
  )
}
