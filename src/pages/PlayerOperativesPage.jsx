import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  deleteHomebrewOperative,
  listHomebrewOperatives,
  listHomebrewTeams,
} from '../lib/homebrewApi'

const OperativesRegistry = lazy(() => import('../components/blackfang/registry/OperativesRegistry'))

import { PLAYER_OPERATIVES_PATH } from '../lib/blackfangNavigation'

const RETURN_TO = 'player-operatives'

function RegistryFallback() {
  return <p className="bf-muted mt-12 text-center text-sm">Loading player operatives…</p>
}

export default function PlayerOperativesPage() {
  const { user, hasSupabaseEnv } = useAuth()
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [homebrewOperatives, setHomebrewOperatives] = useState([])
  const [homebrewTeams, setHomebrewTeams] = useState([])
  const [query, setQuery] = useState('')
  const [opTeamFilter, setOpTeamFilter] = useState('all')
  const [opSort, setOpSort] = useState('name-asc')
  const [homebrewBusy, setHomebrewBusy] = useState(false)
  const [deleteBusyId, setDeleteBusyId] = useState('')
  const [homebrewError, setHomebrewError] = useState('')

  const refreshOperatives = useCallback(async () => {
    if (!user || !hasSupabaseEnv) {
      setHomebrewOperatives([])
      setHomebrewTeams([])
      return
    }

    const [operatives, teams] = await Promise.all([
      listHomebrewOperatives(user.id),
      listHomebrewTeams(user.id),
    ])
    setHomebrewOperatives(operatives)
    setHomebrewTeams(teams)
  }, [user, hasSupabaseEnv])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setLoadError('')
      try {
        if (user && hasSupabaseEnv) {
          await refreshOperatives()
        } else {
          setHomebrewOperatives([])
          setHomebrewTeams([])
        }
      } catch (err) {
        if (!cancelled) setLoadError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [user, hasSupabaseEnv, refreshOperatives])

  const registryOperatives = useMemo(() => {
    return homebrewOperatives
      .filter((entry) => (entry.category ?? 'po') === 'po')
      .map((entry) => ({
        kind: 'homebrew',
        key: `homebrew-${entry.id}`,
        id: entry.id,
        teamId: entry.teamId ?? null,
        teamName: entry.teamName ?? null,
        name: entry.name,
        category: entry.category ?? 'po',
        role: entry.role ?? '',
        apl: entry.apl ?? null,
        move: entry.move ?? '',
        save: entry.save ?? '',
        wounds: entry.wounds ?? null,
        keywords: entry.keywords ?? '',
        isBlackshield: entry.isBlackshield === true,
      }))
  }, [homebrewOperatives])

  const displayOperatives = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = registryOperatives.filter((entry) => {
      if (opTeamFilter === 'unassigned' && entry.teamId) return false
      if (opTeamFilter !== 'all' && opTeamFilter !== 'unassigned' && entry.teamId !== opTeamFilter) {
        return false
      }
      if (!q) return true
      return (
        entry.name.toLowerCase().includes(q) ||
        (entry.teamName ?? '').toLowerCase().includes(q) ||
        entry.role.toLowerCase().includes(q) ||
        entry.keywords.toLowerCase().includes(q)
      )
    })

    const collator = new Intl.Collator(undefined, { sensitivity: 'base' })
    rows = [...rows].sort((a, b) => {
      switch (opSort) {
        case 'name-desc':
          return collator.compare(b.name, a.name)
        case 'team':
          return (
            collator.compare(a.teamName ?? 'ZZZ', b.teamName ?? 'ZZZ') ||
            collator.compare(a.name, b.name)
          )
        case 'apl-desc':
          return (Number(b.apl) || 0) - (Number(a.apl) || 0) || collator.compare(a.name, b.name)
        case 'wounds-desc':
          return (
            (Number(b.wounds) || 0) - (Number(a.wounds) || 0) || collator.compare(a.name, b.name)
          )
        case 'name-asc':
        default:
          return collator.compare(a.name, b.name)
      }
    })

    return rows
  }, [registryOperatives, query, opTeamFilter, opSort])

  async function handleCreateHomebrewOperative() {
    if (!user) return
    window.location.assign(`${PLAYER_OPERATIVES_PATH}/new`)
  }

  async function handleDeleteHomebrewOperative(entry) {
    if (!user || entry.kind !== 'homebrew') return
    if (!window.confirm(`Delete “${entry.name}” permanently? This cannot be undone.`)) return
    setDeleteBusyId(entry.id)
    setHomebrewError('')
    try {
      await deleteHomebrewOperative(entry.id, user.id)
      await refreshOperatives()
    } catch (err) {
      setHomebrewError(err.message)
    } finally {
      setDeleteBusyId('')
    }
  }

  return (
    <section className="bf-panel-elevated p-4 sm:p-6">
      <header className="max-w-3xl">
        <p className="bf-eyebrow">Campaign roster</p>
        <h1 className="bf-title mt-2">Player Operatives</h1>
        <p className="bf-body mt-4 text-sm leading-relaxed sm:text-base">
          Create and manage custom player operative dataslates for your campaign. Build characters from
          scratch, clone official profiles, or assign them to homebrew kill teams when ready.
        </p>
      </header>

      {loading && <RegistryFallback />}
      {loadError && (
        <p className="bf-error mt-8 rounded-xl border border-red-900/50 bg-red-950/30 px-6 py-4 text-sm">
          {loadError}
        </p>
      )}

      {!loading && !loadError && (
        <div className="mt-6">
          <Suspense fallback={<RegistryFallback />}>
            <OperativesRegistry
              homebrewOnly
              editReturnTo={RETURN_TO}
              createButtonLabel="New player operative"
              searchPlaceholder="Search custom operatives…"
              countLabel="custom operatives"
              displayOperatives={displayOperatives}
              registryOperatives={registryOperatives}
              homebrewCount={registryOperatives.length}
              homebrewTeams={homebrewTeams}
              query={query}
              onQueryChange={setQuery}
              opTeamFilter={opTeamFilter}
              onOpTeamFilterChange={setOpTeamFilter}
              opSort={opSort}
              onOpSortChange={setOpSort}
              user={user}
              hasSupabaseEnv={hasSupabaseEnv}
              homebrewBusy={homebrewBusy}
              deleteBusyId={deleteBusyId}
              homebrewError={homebrewError}
              onCreateHomebrew={handleCreateHomebrewOperative}
              onDeleteHomebrew={handleDeleteHomebrewOperative}
            />
          </Suspense>
        </div>
      )}
    </section>
  )
}
