import { useMemo, useState } from 'react'
import RegistrySearch from './RegistrySearch'
import RegistryLazyCardGrid from './RegistryLazyCardGrid'
import WeaponProfilePanel, { WeaponProfileColumnsHead } from './WeaponProfilePanel'
import RulesMultiSelectFilter from './RulesMultiSelectFilter'
import {
  EMPTY_WEAPON_FILTERS,
  collectWeaponRuleOptions,
  filterWeaponsRows,
} from './filterWeaponsRows'

const filterInputClass =
  'bf-input bf-registry-filter-control w-full min-w-0 rounded-lg px-3 text-xs'

export default function WeaponsRegistry({ weapons }) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(EMPTY_WEAPON_FILTERS)
  const [sortKey, setSortKey] = useState('name-asc')

  const ruleOptions = useMemo(() => collectWeaponRuleOptions(weapons), [weapons])

  const displayRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = filterWeaponsRows(weapons, filters)
    if (q) {
      rows = rows.filter((row) => row.name.toLowerCase().includes(q))
    }

    const collator = new Intl.Collator(undefined, { sensitivity: 'base' })
    const [sortField, sortDir] = sortKey.includes('-')
      ? [sortKey.replace(/-asc|-desc$/, ''), sortKey.endsWith('-desc') ? 'desc' : 'asc']
      : ['name', 'asc']

    return [...rows].sort((a, b) => {
      const dir = sortDir === 'desc' ? -1 : 1
      if (sortField === 'atk') {
        return (a.atk - b.atk) * dir || collator.compare(a.name, b.name)
      }
      if (sortField === 'hit' || sortField === 'dmg' || sortField === 'rules') {
        const av = String(a[sortField] ?? '')
        const bv = String(b[sortField] ?? '')
        return collator.compare(av, bv) * dir || collator.compare(a.name, b.name)
      }
      return collator.compare(a.name, b.name) * dir
    })
  }, [weapons, filters, query, sortKey])

  const setFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  return (
    <div>
      <RegistrySearch
        value={query}
        onChange={setQuery}
        placeholder="Search weapons…"
        className="sm:max-w-md"
      />

      <div className="bf-registry-filter-row mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="search"
          value={filters.name}
          onChange={(e) => setFilter('name', e.target.value)}
          placeholder="Weapon name"
          className={filterInputClass}
          aria-label="Filter weapon name"
        />
        <input
          type="search"
          value={filters.atk}
          onChange={(e) => setFilter('atk', e.target.value)}
          placeholder="ATK (e.g. 4)"
          className={filterInputClass}
          aria-label="Filter ATK"
        />
        <input
          type="search"
          value={filters.hit}
          onChange={(e) => setFilter('hit', e.target.value)}
          placeholder="HIT (e.g. 3+)"
          className={filterInputClass}
          aria-label="Filter HIT"
        />
        <input
          type="search"
          value={filters.dmg}
          onChange={(e) => setFilter('dmg', e.target.value)}
          placeholder="DMG (e.g. 3/4)"
          className={filterInputClass}
          aria-label="Filter DMG"
        />
        <RulesMultiSelectFilter
          options={ruleOptions}
          selected={filters.rules}
          onChange={(next) => setFilter('rules', next)}
          label="Rules"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="bf-input bf-registry-filter-control rounded-lg px-4 text-xs"
          aria-label="Sort weapons"
        >
          <option value="name-asc">Name (A–Z)</option>
          <option value="name-desc">Name (Z–A)</option>
          <option value="atk-asc">ATK (low–high)</option>
          <option value="atk-desc">ATK (high–low)</option>
          <option value="hit-asc">HIT</option>
          <option value="dmg-asc">DMG</option>
        </select>
      </div>

      <p className="bf-muted mt-3 text-xs">
        {displayRows.length} of {weapons.length} unique weapon profiles
      </p>

      <div
        className={
          displayRows.length > 0
            ? 'bf-weapon-registry-aligned operative-card-aligned-tables mt-6'
            : undefined
        }
      >
        {displayRows.length > 0 ? <WeaponProfileColumnsHead /> : null}
        <RegistryLazyCardGrid
          columns={1}
          listClassName={displayRows.length > 0 ? 'grid grid-cols-1 gap-4' : undefined}
          items={displayRows}
          resetKey={`${query}|${sortKey}|${JSON.stringify(filters)}`}
          emptyMessage="No weapons match your filters."
          renderItem={(weapon) => (
            <li key={weapon.name}>
              <WeaponProfilePanel weapon={weapon} />
            </li>
          )}
        />
      </div>
    </div>
  )
}
