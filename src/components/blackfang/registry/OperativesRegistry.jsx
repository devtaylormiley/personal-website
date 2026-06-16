import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { fetchOfficialOperative } from '../../../lib/kt24Teams'
import { getHomebrewOperative } from '../../../lib/homebrewApi'
import OperativeDataslate from '../OperativeDataslate'
import RegistrySearch from './RegistrySearch'
import OperativeRegistryCollapsedPreview from './OperativeRegistryCollapsedPreview'
import RegistryLazyCardGrid from './RegistryLazyCardGrid'
import RegistryExpandableCard from './RegistryExpandableCard'
import ActionButton from '../../ui/ActionButton'
import { ButtonIcon } from '../../ui/buttonIcons'

export default function OperativesRegistry({
  displayOperatives,
  registryOperatives,
  officialCount = 0,
  homebrewCount,
  homebrewTeams,
  query,
  onQueryChange,
  opSource,
  onOpSourceChange,
  opTeamFilter,
  onOpTeamFilterChange,
  opSort,
  onOpSortChange,
  user,
  hasSupabaseEnv,
  homebrewBusy,
  deleteBusyId,
  homebrewError,
  onCreateHomebrew,
  onDeleteHomebrew,
  homebrewOnly = false,
  editReturnTo,
  createButtonLabel = 'New homebrew operative',
  searchPlaceholder = 'Search operatives or kill teams…',
  countLabel = 'operatives',
}) {
  const [expandedKey, setExpandedKey] = useState(null)
  const [expandedOp, setExpandedOp] = useState(null)
  const [loadingKey, setLoadingKey] = useState(null)
  const [loadError, setLoadError] = useState('')

  const teamFilterOptions = useMemo(() => {
    const assigned = homebrewTeams.map((team) => ({
      id: team.id,
      label: team.killTeam.name,
    }))
    return assigned
  }, [homebrewTeams])

  async function toggleExpand(entry) {
    if (expandedKey === entry.key) {
      setExpandedKey(null)
      setExpandedOp(null)
      setLoadError('')
      setLoadingKey(null)
      return
    }

    setExpandedKey(entry.key)
    setExpandedOp(null)
    setLoadError('')
    setLoadingKey(entry.key)

    try {
      if (entry.kind === 'homebrew') {
        if (!user) throw new Error('Sign in to view homebrew operatives.')
        const operative = await getHomebrewOperative(entry.id, user.id)
        setExpandedOp(operative)
      } else {
        const operative = await fetchOfficialOperative(entry.teamSlug, entry.operativeId)
        setExpandedOp(operative)
      }
    } catch (err) {
      setLoadError(err.message)
    } finally {
      setLoadingKey(null)
    }
  }

  function renderFooter(entry) {
    if (entry.kind !== 'homebrew') return null

    const editPath = editReturnTo
      ? `/projects/blackfang-campaign/homebrew-operative/${entry.id}?returnTo=${encodeURIComponent(editReturnTo)}`
      : `/projects/blackfang-campaign/homebrew-operative/${entry.id}`

    return (
        <>
          <Link
            to={editPath}
            className="bf-btn-ghost inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium"
          >
            <ButtonIcon label="Edit" className="h-3.5 w-3.5 shrink-0" />
            <span>Edit</span>
          </Link>
          <ActionButton
            label={deleteBusyId === entry.id ? 'Deleting…' : 'Delete'}
            onClick={() => onDeleteHomebrew(entry)}
            disabled={deleteBusyId === entry.id}
            className="bf-btn-danger ml-auto cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium disabled:opacity-50"
          />
        </>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center">
          <RegistrySearch
            value={query}
            onChange={onQueryChange}
            placeholder={searchPlaceholder}
            className="lg:max-w-xs"
          />
          {!homebrewOnly && (
            <select
              value={opSource}
              onChange={(e) => onOpSourceChange(e.target.value)}
              className="bf-input rounded-lg px-4 py-2.5 text-sm"
              aria-label="Filter by source"
            >
              <option value="all">Official + homebrew</option>
              <option value="official">Official only</option>
              <option value="homebrew">My homebrew only</option>
            </select>
          )}
          <select
            value={opTeamFilter}
            onChange={(e) => onOpTeamFilterChange(e.target.value)}
            className="bf-input rounded-lg px-4 py-2.5 text-sm"
            aria-label="Filter by kill team"
            disabled={!homebrewOnly && opSource === 'official'}
          >
            <option value="all">All kill teams</option>
            <option value="unassigned">Unassigned homebrew</option>
            {teamFilterOptions.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={opSort}
            onChange={(e) => onOpSortChange(e.target.value)}
            className="bf-input rounded-lg px-4 py-2.5 text-sm"
            aria-label="Sort operatives"
          >
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="team">Kill team</option>
            <option value="apl-desc">APL (high–low)</option>
            <option value="wounds-desc">Wounds (high–low)</option>
            {!homebrewOnly && <option value="source">Homebrew, then official</option>}
          </select>
          <ActionButton
            label={homebrewBusy ? 'Creating…' : createButtonLabel}
            onClick={onCreateHomebrew}
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
          <p className="bf-hint text-xs">
            Sign in with Google to create and manage{' '}
            {homebrewOnly ? 'custom player operatives' : 'homebrew operatives'}.
          </p>
        )}
        {homebrewError && <p className="bf-error text-xs">{homebrewError}</p>}
      </div>

      <p className="bf-muted mt-4 text-xs">
        {displayOperatives.length} of {registryOperatives.length} {countLabel}
        {!homebrewOnly && registryOperatives.length > 0 && (
          <span>
            {' '}
            ({officialCount} official
            {user ? `, ${homebrewCount} homebrew` : ''})
          </span>
        )}
      </p>

      <RegistryLazyCardGrid
        items={displayOperatives}
        resetKey={`${query}|${opSource}|${opTeamFilter}|${opSort}`}
        columns={1}
        emptyMessage="No operatives match your filters."
        renderItem={(entry) => {
          const isExpanded = expandedKey === entry.key
          const isLoading = loadingKey === entry.key

          return (
            <li key={entry.key}>
              <RegistryExpandableCard
                headerInlineContent={
                  <OperativeRegistryCollapsedPreview
                    entry={entry}
                    isExpanded={isExpanded}
                    onToggle={() => toggleExpand(entry)}
                  />
                }
                footer={renderFooter(entry)}
                expandedLayout="replace"
                isExpanded={isExpanded}
                onToggle={() => toggleExpand(entry)}
                loading={isLoading}
                error={isExpanded && loadError && !isLoading ? loadError : ''}
                expandedContent={
                  expandedOp && isExpanded ? (
                    <OperativeDataslate operative={expandedOp} density="compact" />
                  ) : null
                }
              />
            </li>
          )
        }}
      />
    </div>
  )
}
