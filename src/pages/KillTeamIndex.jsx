import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ActionButton from '../components/ui/ActionButton'
import RegistrySearch from '../components/blackfang/registry/RegistrySearch'
import TeamsRegistryList from '../components/blackfang/registry/TeamsRegistryList'
import { useAuth } from '../context/AuthContext'
import { useRegistryTabData } from '../hooks/useRegistryTabData'
import {
  createHomebrewTeam,
  createHomebrewOperative,
  deleteHomebrewOperative,
  deleteHomebrewTeam,
} from '../lib/homebrewApi'
import { makeDefaultHomebrewOperative } from '../lib/homebrewDefaults'
import { KT24_REGISTRY_TAB_IDS } from '../lib/blackfangNavigation'

const OperativesRegistry = lazy(() => import('../components/blackfang/registry/OperativesRegistry'))
const JointNpoRegistry = lazy(() => import('../components/blackfang/registry/JointNpoRegistry'))
const WeaponsRegistry = lazy(() => import('../components/blackfang/registry/WeaponsRegistry'))
const EquipmentRegistry = lazy(() => import('../components/blackfang/registry/EquipmentRegistry'))

const FACTION_LABELS = {
  IMP: 'Imperium',
  CHAOS: 'Chaos',
  AEL: 'Aeldari',
  TAU: "T'au",
  NEC: 'Necrons',
  ORK: 'Orks',
  TYR: 'Tyranids',
  VOT: 'Leagues of Votann',
}

function RegistryTabFallback() {
  return <p className="bf-muted mt-12 text-center text-sm">Loading registry…</p>
}

export default function KillTeamIndex() {
  const navigate = useNavigate()
  const { tabId } = useParams()
  const validTabIds = KT24_REGISTRY_TAB_IDS
  const initialTab = validTabIds.includes(tabId) ? tabId : 'teams'

  const { user, hasSupabaseEnv } = useAuth()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [query, setQuery] = useState('')
  const [faction, setFaction] = useState('all')
  const [teamSource, setTeamSource] = useState('all')
  const [teamSort, setTeamSort] = useState('name-asc')
  const [opSource, setOpSource] = useState('all')
  const [opTeamFilter, setOpTeamFilter] = useState('all')
  const [opSort, setOpSort] = useState('name-asc')
  const [homebrewBusy, setHomebrewBusy] = useState(false)
  const [opHomebrewBusy, setOpHomebrewBusy] = useState(false)
  const [deleteBusyId, setDeleteBusyId] = useState('')
  const [opDeleteBusyId, setOpDeleteBusyId] = useState('')
  const [homebrewError, setHomebrewError] = useState('')
  const [opHomebrewError, setOpHomebrewError] = useState('')

  const {
    isLoading,
    error,
    teams,
    operatives,
    npos,
    weapons,
    equipment,
    homebrewTeams,
    homebrewOperatives,
    refreshHomebrewTeams,
    refreshHomebrewOperatives,
  } = useRegistryTabData(activeTab, { user, hasSupabaseEnv })

  useEffect(() => {
    if (!tabId) {
      setActiveTab('teams')
      return
    }
    if (!validTabIds.includes(tabId)) {
      navigate('/projects/blackfang-campaign/kt24-data', { replace: true })
      return
    }
    setActiveTab(tabId)
    setQuery('')
    setOpSource('all')
    setOpTeamFilter('all')
  }, [tabId, validTabIds, navigate])

  async function handleCreateHomebrewTeam() {
    if (!user) return
    setHomebrewBusy(true)
    setHomebrewError('')
    try {
      const stamp = Date.now()
      const slug = `homebrew-${stamp}`
      const created = await createHomebrewTeam({
        userId: user.id,
        slug,
        killteamId: null,
        factionId: 'IMP',
        killTeam: {
          name: `New Homebrew Team ${homebrewTeams.length + 1}`,
          archetypes: 'Seek And Destroy',
          description: 'Custom homebrew kill team.',
          factionRuleName: 'Faction rules',
          factionRule: '',
          specialIssueAmmunition: '',
          ploys: [],
          rosterNote: '',
        },
      })
      window.location.assign(`/projects/blackfang-campaign/homebrew/${created.id}`)
    } catch (err) {
      setHomebrewError(err.message)
    } finally {
      setHomebrewBusy(false)
    }
  }

  const registryTeams = useMemo(() => {
    const official = teams.map((team) => ({
      kind: 'official',
      key: `official-${team.slug}`,
      slug: team.slug,
      name: team.name,
      archetypes: team.archetypes ?? '',
      factionId: team.factionId,
      operativeCount: team.operativeCount ?? 0,
      killteamId: team.killteamId,
    }))

    const homebrew = homebrewTeams.map((team) => ({
      kind: 'homebrew',
      key: `homebrew-${team.id}`,
      id: team.id,
      slug: team.slug,
      name: team.killTeam.name,
      archetypes: team.killTeam.archetypes ?? '',
      factionId: team.factionId || 'CUSTOM',
      operativeCount: team.operativeCount ?? 0,
      killteamId: team.killteamId,
      imageUrl: team.imageUrl,
    }))

    return [...official, ...homebrew]
  }, [teams, homebrewTeams])

  const factions = useMemo(() => {
    const ids = [...new Set(registryTeams.map((t) => t.factionId).filter(Boolean))].sort()
    return ids.map((id) => ({
      id,
      label: id === 'CUSTOM' ? 'Unassigned' : (FACTION_LABELS[id] ?? id),
    }))
  }, [registryTeams])

  const displayTeams = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = registryTeams.filter((team) => {
      if (teamSource === 'official' && team.kind !== 'official') return false
      if (teamSource === 'homebrew' && team.kind !== 'homebrew') return false
      if (faction !== 'all' && team.factionId !== faction) return false
      if (!q) return true
      return (
        team.name.toLowerCase().includes(q) ||
        team.archetypes.toLowerCase().includes(q) ||
        team.slug.toLowerCase().includes(q)
      )
    })

    const collator = new Intl.Collator(undefined, { sensitivity: 'base' })
    rows = [...rows].sort((a, b) => {
      switch (teamSort) {
        case 'name-desc':
          return collator.compare(b.name, a.name)
        case 'faction':
          return (
            collator.compare(FACTION_LABELS[a.factionId] ?? a.factionId, FACTION_LABELS[b.factionId] ?? b.factionId) ||
            collator.compare(a.name, b.name)
          )
        case 'operatives-desc':
          return b.operativeCount - a.operativeCount || collator.compare(a.name, b.name)
        case 'source':
          if (a.kind !== b.kind) return a.kind === 'homebrew' ? -1 : 1
          return collator.compare(a.name, b.name)
        case 'name-asc':
        default:
          return collator.compare(a.name, b.name)
      }
    })

    return rows
  }, [registryTeams, query, faction, teamSource, teamSort])

  const registryOperatives = useMemo(() => {
    const official = operatives.map((entry) => ({
      kind: 'official',
      key: entry.key,
      teamSlug: entry.teamSlug,
      teamName: entry.teamName,
      operativeId: entry.operativeId,
      name: entry.name,
      category: entry.category ?? 'po',
      role: entry.role ?? '',
      apl: entry.apl ?? null,
      move: entry.move ?? '',
      save: entry.save ?? '',
      wounds: entry.wounds ?? null,
      keywords: entry.keywords ?? '',
    }))

    const homebrew = homebrewOperatives.map((entry) => ({
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
    }))

    return [...official, ...homebrew]
  }, [operatives, homebrewOperatives])

  const displayOperatives = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = registryOperatives.filter((entry) => {
      if (opSource === 'official' && entry.kind !== 'official') return false
      if (opSource === 'homebrew' && entry.kind !== 'homebrew') return false
      if (entry.kind === 'homebrew') {
        if (opTeamFilter === 'unassigned' && entry.teamId) return false
        if (opTeamFilter !== 'all' && opTeamFilter !== 'unassigned' && entry.teamId !== opTeamFilter) {
          return false
        }
      }
      if (!q) return true
      return (
        entry.name.toLowerCase().includes(q) ||
        String(entry.teamName ?? '')
          .toLowerCase()
          .includes(q) ||
        String(entry.role ?? '')
          .toLowerCase()
          .includes(q) ||
        String(entry.keywords ?? '')
          .toLowerCase()
          .includes(q)
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
        case 'source':
          if (a.kind !== b.kind) return a.kind === 'homebrew' ? -1 : 1
          return collator.compare(a.name, b.name)
        case 'name-asc':
        default:
          return collator.compare(a.name, b.name)
      }
    })

    return rows
  }, [registryOperatives, query, opSource, opTeamFilter, opSort])

  async function handleCreateHomebrewOperative() {
    if (!user) return
    setOpHomebrewBusy(true)
    setOpHomebrewError('')
    try {
      const created = await createHomebrewOperative({
        userId: user.id,
        operative: makeDefaultHomebrewOperative(homebrewOperatives.length),
      })
      window.location.assign(`/projects/blackfang-campaign/homebrew-operative/${created.id}`)
    } catch (err) {
      setOpHomebrewError(err.message)
    } finally {
      setOpHomebrewBusy(false)
    }
  }

  async function handleDeleteHomebrewOperative(entry) {
    if (!user || entry.kind !== 'homebrew') return
    if (!window.confirm(`Delete “${entry.name}” permanently? This cannot be undone.`)) return
    setOpDeleteBusyId(entry.id)
    setOpHomebrewError('')
    try {
      await deleteHomebrewOperative(entry.id, user.id)
      await refreshHomebrewOperatives()
    } catch (err) {
      setOpHomebrewError(err.message)
    } finally {
      setOpDeleteBusyId('')
    }
  }

  async function handleDeleteHomebrewTeam(team) {
    if (!user || team.kind !== 'homebrew') return
    if (!window.confirm(`Delete “${team.name}” permanently? This cannot be undone.`)) return
    setDeleteBusyId(team.id)
    setHomebrewError('')
    try {
      await deleteHomebrewTeam(team.id, user.id)
      await refreshHomebrewTeams()
    } catch (err) {
      setHomebrewError(err.message)
    } finally {
      setDeleteBusyId('')
    }
  }

  return (
    <section className="bf-panel-elevated p-4 sm:p-6">
      <p className="bf-muted max-w-3xl text-xs sm:text-sm">
        Browse kill teams, operatives, joint-operation NPOs, weapons, and equipment.
      </p>

      {isLoading && <RegistryTabFallback />}
      {error && (
        <p className="bf-error mt-12 rounded-xl border border-red-900/50 bg-red-950/30 px-6 py-4 text-sm">
          {error}. Run <code className="text-red-200">npm run sync:kt24</code> to generate data.
        </p>
      )}

      {!isLoading && !error && activeTab === 'teams' && (
        <>
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center">
              <RegistrySearch
                value={query}
                onChange={setQuery}
                placeholder="Search kill teams…"
                className="lg:max-w-xs"
              />
              <select
                value={faction}
                onChange={(e) => setFaction(e.target.value)}
                className="bf-input rounded-lg px-4 py-2.5 text-sm"
                aria-label="Filter by faction"
              >
                <option value="all">All factions</option>
                {factions.map(({ id, label }) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                value={teamSource}
                onChange={(e) => setTeamSource(e.target.value)}
                className="bf-input rounded-lg px-4 py-2.5 text-sm"
                aria-label="Filter by source"
              >
                <option value="all">Official + homebrew</option>
                <option value="official">Official only</option>
                <option value="homebrew">My homebrew only</option>
              </select>
              <select
                value={teamSort}
                onChange={(e) => setTeamSort(e.target.value)}
                className="bf-input rounded-lg px-4 py-2.5 text-sm"
                aria-label="Sort kill teams"
              >
                <option value="name-asc">Name (A–Z)</option>
                <option value="name-desc">Name (Z–A)</option>
                <option value="faction">Faction</option>
                <option value="operatives-desc">Operative count</option>
                <option value="source">Homebrew, then official</option>
              </select>
              <ActionButton
                label={homebrewBusy ? 'Creating…' : 'New homebrew team'}
                onClick={handleCreateHomebrewTeam}
                disabled={!user || homebrewBusy || !hasSupabaseEnv}
                className="bf-btn-primary cursor-pointer rounded-lg px-3 py-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40 lg:ml-auto"
              />
            </div>

            {!hasSupabaseEnv && (
              <p className="bf-hint text-xs">
                Configure Supabase environment variables to enable homebrew CRUD.
              </p>
            )}
            {!user && hasSupabaseEnv && (
              <p className="bf-hint text-xs">Sign in with Google to create and manage homebrew teams.</p>
            )}
            {homebrewError && <p className="bf-error text-xs">{homebrewError}</p>}
          </div>

          <TeamsRegistryList
            teams={teams}
            displayTeams={displayTeams}
            registryTeams={registryTeams}
            factionLabels={FACTION_LABELS}
            query={query}
            faction={faction}
            teamSource={teamSource}
            teamSort={teamSort}
            deleteBusyId={deleteBusyId}
            onDelete={handleDeleteHomebrewTeam}
            user={user}
          />
        </>
      )}

      {!isLoading && !error && activeTab === 'operatives' && (
        <div className="mt-6">
          <Suspense fallback={<RegistryTabFallback />}>
            <OperativesRegistry
              displayOperatives={displayOperatives}
              registryOperatives={registryOperatives}
              officialCount={operatives.length}
              homebrewCount={homebrewOperatives.length}
              homebrewTeams={homebrewTeams}
              query={query}
              onQueryChange={setQuery}
              opSource={opSource}
              onOpSourceChange={setOpSource}
              opTeamFilter={opTeamFilter}
              onOpTeamFilterChange={setOpTeamFilter}
              opSort={opSort}
              onOpSortChange={setOpSort}
              user={user}
              hasSupabaseEnv={hasSupabaseEnv}
              homebrewBusy={opHomebrewBusy}
              deleteBusyId={opDeleteBusyId}
              homebrewError={opHomebrewError}
              onCreateHomebrew={handleCreateHomebrewOperative}
              onDeleteHomebrew={handleDeleteHomebrewOperative}
            />
          </Suspense>
        </div>
      )}

      {!isLoading && !error && activeTab === 'joint-npos' && (
        <div className="mt-6">
          <Suspense fallback={<RegistryTabFallback />}>
            <JointNpoRegistry npos={npos} />
          </Suspense>
        </div>
      )}

      {!isLoading && !error && activeTab === 'weapons' && (
        <div className="mt-6">
          <Suspense fallback={<RegistryTabFallback />}>
            <WeaponsRegistry weapons={weapons} />
          </Suspense>
        </div>
      )}

      {!isLoading && !error && activeTab === 'equipment' && (
        <div className="mt-6">
          <Suspense fallback={<RegistryTabFallback />}>
            <EquipmentRegistry equipment={equipment} />
          </Suspense>
        </div>
      )}
    </section>
  )
}
