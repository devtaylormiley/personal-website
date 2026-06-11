import { useMemo, useState } from 'react'
import RegistrySearch from './RegistrySearch'
import RegistryLazyCardGrid from './RegistryLazyCardGrid'
import EquipmentDetailPanel from './EquipmentDetailPanel'

function filterEquipment(items, query, scope) {
  let rows = items
  if (scope === 'universal') {
    rows = rows.filter((item) => item.isUniversal)
  } else if (scope === 'team') {
    rows = rows.filter((item) => !item.isUniversal)
  }

  const q = query.trim().toLowerCase()
  if (!q) return rows

  return rows.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      String(item.description ?? '')
        .toLowerCase()
        .includes(q) ||
      String(item.teamName ?? '')
        .toLowerCase()
        .includes(q) ||
      item.eqId.toLowerCase().includes(q),
  )
}

export default function EquipmentRegistry({ equipment }) {
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState('all')
  const [sortKey, setSortKey] = useState('name-asc')

  const filtered = useMemo(
    () => filterEquipment(equipment, query, scope),
    [equipment, query, scope],
  )

  const displayRows = useMemo(() => {
    const collator = new Intl.Collator(undefined, { sensitivity: 'base' })
    const dir = sortKey.endsWith('-desc') ? -1 : 1
    return [...filtered].sort((a, b) => {
      if (sortKey.startsWith('source')) {
        const as = a.isUniversal ? 'Universal' : a.teamName
        const bs = b.isUniversal ? 'Universal' : b.teamName
        return collator.compare(as, bs) * dir || collator.compare(a.name, b.name)
      }
      return collator.compare(a.name, b.name) * dir
    })
  }, [filtered, sortKey])

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <RegistrySearch
          value={query}
          onChange={setQuery}
          placeholder="Search equipment…"
          className="sm:max-w-md"
        />
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="bf-input rounded-lg px-4 py-2.5 text-sm"
          aria-label="Filter equipment scope"
        >
          <option value="all">All equipment</option>
          <option value="universal">Universal only</option>
          <option value="team">Kill team equipment</option>
        </select>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="bf-input rounded-lg px-4 py-2.5 text-sm"
          aria-label="Sort equipment"
        >
          <option value="name-asc">Name (A–Z)</option>
          <option value="name-desc">Name (Z–A)</option>
          <option value="source-asc">Source (A–Z)</option>
          <option value="source-desc">Source (Z–A)</option>
        </select>
      </div>

      <p className="bf-muted mt-3 text-xs">
        {displayRows.length} of {equipment.length} equipment entries
      </p>

      <RegistryLazyCardGrid
        columns={1}
        items={displayRows}
        resetKey={`${query}|${scope}|${sortKey}`}
        emptyMessage="No equipment matches your search."
        renderItem={(item) => (
          <li key={item.eqId}>
            <EquipmentDetailPanel item={item} />
          </li>
        )}
      />
    </div>
  )
}
