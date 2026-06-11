import RegistryLazyCardGrid from './RegistryLazyCardGrid'
import KillTeamRegistryCard from './KillTeamRegistryCard'

export default function TeamsRegistryList({
  teams,
  displayTeams,
  registryTeams,
  factionLabels,
  query,
  faction,
  teamSource,
  teamSort,
  deleteBusyId,
  onDelete,
  user,
}) {
  const resetKey = `${query}|${faction}|${teamSource}|${teamSort}`

  return (
    <>
      <p className="bf-muted mt-4 text-xs">
        {displayTeams.length} of {registryTeams.length} teams
        {registryTeams.length > 0 && (
          <span>
            {' '}
            ({teams.length} official
            {user ? `, ${registryTeams.length - teams.length} homebrew` : ''})
          </span>
        )}
      </p>

      <RegistryLazyCardGrid
        items={displayTeams}
        resetKey={resetKey}
        emptyMessage="No teams match your filters."
        renderItem={(team) => (
          <li key={team.key}>
            <KillTeamRegistryCard
              team={team}
              factionLabel={
                team.factionId === 'CUSTOM'
                  ? 'Homebrew'
                  : (factionLabels[team.factionId] ?? team.factionId)
              }
              deleteBusyId={deleteBusyId}
              onDelete={onDelete}
            />
          </li>
        )}
      />
    </>
  )
}
