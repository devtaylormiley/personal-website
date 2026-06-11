import ActionButton from '../ui/ActionButton'
import AbilityScoresRow from './AbilityScoresRow'
import EditableField from './EditableField'

function FieldError({ message }) {
  if (!message) return null
  return <p className="bf-error mt-1 text-xs">{message}</p>
}

export default function BlackshieldCharacterForm({
  operative,
  onFieldChange,
  onLevelChange,
  onAbilityScoreAdjust,
  slotLabel,
  showActions = false,
  onSubmit,
  onCancel,
  submitLabel = 'Create blackshield',
  busy = false,
  error = '',
  fieldErrors = {},
}) {
  function handleSubmit(event) {
    event.preventDefault()
    onSubmit?.()
  }

  const body = (
    <div className="space-y-6">
      {slotLabel ? (
        <p className="bf-muted text-sm">
          Registering <span className="text-[var(--bf-field)]">{slotLabel}</span> as a Blackshield
          operative for the campaign roster.
        </p>
      ) : null}

      <div className="bf-panel border border-[var(--bf-border)] p-4 sm:p-5">
        <p className="bf-mono-label mb-3">Identity</p>
        <EditableField
          label="Operative name"
          value={operative.name ?? ''}
          onChange={(value) => onFieldChange('name', value)}
          inputClassName="text-sm"
        />
        <FieldError message={fieldErrors.name} />
      </div>

      <div className="bf-panel border border-[var(--bf-border)] p-4 sm:p-5">
        <p className="bf-mono-label mb-1">Campaign — ability scores</p>
        <p className="bf-muted mb-3 text-xs leading-relaxed">
          Blackshields in the Blackfang roster use D&amp;D-style ability scores and level-based
          boosts. Adjust scores before saving the character.
        </p>
        <AbilityScoresRow
          operative={operative}
          editable
          compact
          onLevelChange={onLevelChange}
          onAbilityScoreAdjust={onAbilityScoreAdjust}
        />
      </div>

      <div className="bf-panel border border-[var(--bf-border)] p-4 sm:p-5">
        <p className="bf-mono-label mb-3">Blackshield dossier</p>
        <div className="space-y-4">
          <div>
            <EditableField
              label="Former chapter"
              value={operative.formerChapter ?? ''}
              onChange={(value) => onFieldChange('formerChapter', value)}
              inputClassName="text-sm"
            />
            <p className="bf-hint mt-1.5 text-xs">
              The heraldry and traditions your battle-brother abandoned — or lost — before taking the
              black shield.
            </p>
            <FieldError message={fieldErrors.formerChapter} />
          </div>

          <div>
            <EditableField
              label="Backstory"
              value={operative.backstory ?? ''}
              onChange={(value) => onFieldChange('backstory', value)}
              multiline
              inputClassName="min-h-[6rem] text-sm"
            />
            <p className="bf-hint mt-1.5 text-xs">
              How your operative reached veteran status and then arrived at the black siphon.
            </p>
          </div>
        </div>
      </div>

      {error ? <p className="bf-error text-sm">{error}</p> : null}

      {showActions ? (
        <div className="flex flex-wrap gap-3 border-t border-[var(--bf-border)] pt-4">
          <ActionButton
            label={busy ? 'Creating…' : submitLabel}
            type="submit"
            disabled={busy}
            className="bf-btn-primary px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
          />
          <ActionButton
            label="Cancel"
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="bf-btn-ghost px-4 py-2 text-sm font-medium disabled:opacity-40"
          />
        </div>
      ) : null}
    </div>
  )

  if (showActions) {
    return (
      <form onSubmit={handleSubmit} className="min-w-0">
        {body}
      </form>
    )
  }

  return body
}
