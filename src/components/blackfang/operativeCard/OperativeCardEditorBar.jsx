import { Link } from 'react-router-dom'
import EditableField from '../EditableField'

export default function OperativeCardEditorBar({
  operative,
  officialOperatives,
  onCopyFromOperative,
  copyLoading,
  onFieldChange,
  compact,
  teamId,
  homebrewTeams,
  onTeamChange,
  toolbar,
}) {
  const assignedTeam = homebrewTeams?.find((team) => team.id === teamId)

  return (
    <div
      className={`operative-card-editor rounded-xl border px-3 py-2 sm:px-4 sm:py-3 ${compact ? '' : ''}`}
    >
      {toolbar ? (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--bf-border)] pb-3">
          {toolbar}
        </div>
      ) : null}

      <p className="bf-mono-label mb-2">Dataslate editor</p>
      <div className={`grid w-full gap-3 ${compact ? '' : 'sm:grid-cols-2'}`}>
        {officialOperatives?.length > 0 && onCopyFromOperative ? (
          <label className="block w-full min-w-0 sm:col-span-2">
            <span className="bf-mono-label mb-1 block">Copy from existing operative</span>
            <select
              value=""
              onChange={(e) => {
                const key = e.target.value
                if (key) onCopyFromOperative(key)
              }}
              disabled={copyLoading}
              className="bf-field-input w-full text-sm disabled:opacity-50"
            >
              <option value="">
                {copyLoading ? 'Loading…' : 'Select an operative…'}
              </option>
              {officialOperatives.map((entry) => (
                <option key={entry.key} value={entry.key}>
                  {entry.teamName} — {entry.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {onTeamChange && homebrewTeams ? (
          <div className="block w-full min-w-0 sm:col-span-2">
            <label htmlFor="operative-card-team" className="bf-mono-label mb-1 block">
              Kill team assignment
            </label>
            <select
              id="operative-card-team"
              value={teamId ?? ''}
              onChange={(e) => onTeamChange(e.target.value || null)}
              className="bf-field-input w-full text-sm"
            >
              <option value="">Unassigned — pick a team later</option>
              {homebrewTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.killTeam.name}
                </option>
              ))}
            </select>
            {assignedTeam ? (
              <p className="bf-hint mt-1.5 text-xs">
                Assigned to{' '}
                <Link
                  to={`/projects/blackfang-campaign/homebrew/${assignedTeam.id}`}
                  className="text-[var(--bf-accent)] hover:underline"
                >
                  {assignedTeam.killTeam.name}
                </Link>
                . Saving here updates the roster link.
              </p>
            ) : (
              <p className="bf-hint mt-1.5 text-xs">
                Not linked to a homebrew kill team yet. Assign one when ready.
              </p>
            )}
          </div>
        ) : null}

        <div className="flex w-full min-w-0 flex-wrap items-end gap-2 sm:col-span-2">
          <label className="block">
            <span className="bf-mono-label mb-1 block">Category</span>
            <select
              value={operative.category}
              onChange={(e) => onFieldChange('category', e.target.value)}
              className="bf-field-input text-sm"
            >
              <option value="po">PO</option>
              <option value="npo">NPO</option>
            </select>
          </label>
          <EditableField
            label="Role"
            value={operative.role}
            onChange={(v) => onFieldChange('role', v)}
            className="min-w-[8rem] flex-1"
          />
        </div>
      </div>
    </div>
  )
}
