import { useState } from 'react'
import ActionButton from '../ui/ActionButton'
import DisplayField from './DisplayField'
import AbilitiesList from './AbilitiesList'
import EditableField from './EditableField'
import EditableWeaponsTable from './EditableWeaponsTable'
import AbilityScoresRow from './AbilityScoresRow'
import OperativeCardProfileStatsTable from './operativeCard/OperativeCardProfileStatsTable'
import {
  OperativeCardTableColgroup,
  operativeCardTableAlignedClass,
} from './operativeCard/operativeCardTableColumns'
import OperativeCardEditorBar from './operativeCard/OperativeCardEditorBar'
import OperativeCardSection from './operativeCard/OperativeCardSection'
import WeaponRulesChips from './WeaponRulesChips'
import { bfToneClass } from '../../lib/blackfangNavigation'

const categoryLabel = { po: 'Player operative', npo: 'Non-player operative' }

function formatRoleDisplay(operative, editable) {
  if (editable) {
    return operative.role || categoryLabel[operative.category] || ''
  }
  const category = categoryLabel[operative.category] ?? operative.category
  if (operative.role && category) {
    return `${operative.role} · ${category}`
  }
  return operative.role || category || '—'
}

function OperativeCardKeywords({ operative, editable, onFieldChange, compact, inline = false }) {
  const textClass = compact
    ? 'text-[10px] leading-snug'
    : 'text-xs leading-relaxed'

  const fieldClass = `bg-transparent text-left font-medium tracking-wide uppercase outline-none placeholder:text-amber-900/60 focus:text-amber-50 ${textClass} ${
    inline ? 'min-w-0 flex-1' : 'w-full'
  }`

  if (editable && onFieldChange) {
    const input = (
      <input
        value={operative.keywords ?? ''}
        onChange={(e) => onFieldChange('keywords', e.target.value)}
        placeholder="KEYWORDS, FACTION, OPERATIVE TYPE…"
        className={fieldClass}
        aria-label="Operative keywords"
      />
    )
    if (inline) return <div className="operative-card-keywords operative-card-keywords--inline min-w-0 flex-1">{input}</div>
    return (
      <div className="operative-card-keywords border-b border-amber-900/30 bg-zinc-950/80 px-3 py-2 text-left">
        {input}
      </div>
    )
  }

  if (!operative.keywords?.trim()) return null

  const text = (
    <p className={`font-medium tracking-wide uppercase ${textClass}`}>{operative.keywords}</p>
  )
  if (inline) {
    return <div className="operative-card-keywords operative-card-keywords--inline min-w-0 flex-1">{text}</div>
  }
  return (
    <div className="operative-card-keywords border-b border-amber-900/30 bg-zinc-950/80 px-3 py-2 text-left">
      {text}
    </div>
  )
}

function OperativeCardWeapons({ operative, editable, compact, weaponsResetKey, weaponOptions, onWeaponChange, onReplaceWeapon, onAddWeapon, onRemoveWeapon, onTypeaheadOpenChange }) {
  const tableClass = `${operativeCardTableAlignedClass} ${compact ? 'text-xs' : 'text-sm'}`
  const headClass = compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'
  const cellClass = compact ? 'px-2 py-1' : 'px-3 py-2'
  const statCellClass = `${cellClass} operative-card-col-stat-cell`

  if (editable && onAddWeapon) {
    return (
      <EditableWeaponsTable
        key={`${operative.id}-weapons-${weaponsResetKey}`}
        weapons={operative.weapons}
        weaponOptions={weaponOptions ?? []}
        compact={compact}
        operativeId={operative.id}
        onWeaponChange={onWeaponChange}
        onReplaceWeapon={onReplaceWeapon}
        onAddWeapon={onAddWeapon}
        onRemoveWeapon={onRemoveWeapon}
        onTypeaheadOpenChange={onTypeaheadOpenChange}
        tableClassName={tableClass}
        headerClassName="operative-card-table-head"
        wrapperClassName=""
        alignedColumns
      />
    )
  }

  return (
    <table className={tableClass}>
      <OperativeCardTableColgroup />
      <thead>
        <tr className="operative-card-table-head">
          <th className={headClass}>Weapons</th>
          <th className={`${headClass} operative-card-col-stat-cell`}>ATK</th>
          <th className={`${headClass} operative-card-col-stat-cell`}>HIT</th>
          <th className={`${headClass} operative-card-col-stat-cell`}>DMG</th>
          <th className={headClass}>Rules</th>
        </tr>
      </thead>
      <tbody>
        {operative.weapons.length === 0 ? (
          <tr>
            <td colSpan={5} className={`bf-muted text-left ${compact ? 'px-2 py-2' : 'px-3 py-3'}`}>
              No weapons.
            </td>
          </tr>
        ) : (
          operative.weapons.map((w, index) => (
            <tr key={`${operative.id}-w-${index}`} className="border-t border-amber-950/50">
              <td className={`font-medium text-[var(--bf-field)] ${cellClass}`}>{w.name}</td>
              <td className={`text-[var(--bf-field)] tabular-nums ${statCellClass}`}>{w.atk}</td>
              <td className={`text-[var(--bf-field)] tabular-nums ${statCellClass}`}>{w.hit}</td>
              <td className={`text-[var(--bf-field)] tabular-nums ${statCellClass}`}>{w.dmg}</td>
              <td className={cellClass}>
                <WeaponRulesChips
                  rules={w.rules}
                  compact={compact}
                  ruleKeyPrefix={`${operative.id}-${index}`}
                />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

export default function OperativeDataslate({
  operative,
  onFieldChange,
  onLevelChange,
  onAbilityScoreAdjust,
  onWeaponChange,
  onReplaceWeapon,
  onAddWeapon,
  onRemoveWeapon,
  weaponOptions,
  isDirty,
  officialOperatives,
  onCopyFromOperative,
  copyLoading,
  weaponsResetKey = 0,
  density = 'default',
  onClose,
  showAbilityScores: showAbilityScoresProp = true,
  accentTone = null,
}) {
  const editable = Boolean(onFieldChange)
  const custom = operative.cardType === 'custom'
  const compact = density === 'compact'
  const [weaponsTypeaheadOpen, setWeaponsTypeaheadOpen] = useState(false)
  const showAbilityScores = showAbilityScoresProp && operative?.isBlackshield === true

  const cardBorderClass =
    editable && isDirty ? 'bf-dirty' : custom ? 'ring-1 ring-[var(--bf-border-bright)]' : ''
  const accentClass = accentTone ? bfToneClass(accentTone) : ''

  return (
    <div className={editable ? 'space-y-0' : ''}>
      {editable ? (
        <OperativeCardEditorBar
          operative={operative}
          officialOperatives={officialOperatives}
          onCopyFromOperative={onCopyFromOperative}
          copyLoading={copyLoading}
          onFieldChange={onFieldChange}
          compact={compact}
        />
      ) : null}

      <article
        className={`operative-card w-full min-w-0 overflow-hidden rounded-xl border-2 border-amber-800/60 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black shadow-lg shadow-black/40 ${accentClass} ${cardBorderClass} ${
          weaponsTypeaheadOpen ? 'overflow-visible' : ''
        } ${editable ? 'rounded-t-none border-t-0' : ''}`}
      >
        <header
          className={`operative-card-name relative border-b border-zinc-600/50 text-left ${onClose ? 'pr-24' : ''} ${compact ? 'px-3 py-2.5' : 'px-4 py-3'}`}
        >
          {onClose ? (
            <div className={`absolute z-10 ${compact ? 'top-1.5 right-1.5' : 'top-2 right-2'}`}>
              <ActionButton
                label="Close"
                onClick={onClose}
                className="bf-btn-primary cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium"
              />
            </div>
          ) : null}
          {editable ? (
            <input
              value={operative.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              className={`w-full bg-transparent text-left font-bold tracking-wide uppercase outline-none placeholder:text-[var(--bf-text-muted)] ${compact ? 'text-base' : 'text-lg'}`}
              aria-label="Operative name"
            />
          ) : (
            <h3 className={`text-left font-bold tracking-wide uppercase ${compact ? 'text-base' : 'text-lg'}`}>
              {operative.name}
            </h3>
          )}

          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <OperativeCardKeywords
              operative={operative}
              editable={editable}
              onFieldChange={onFieldChange}
              compact={compact}
              inline
            />

            <div
              className={`operative-card-base shrink-0 text-[var(--bf-text-muted)] ${compact ? 'text-[10px]' : 'text-xs'}`}
            >
              {editable ? (
                <label className="inline-flex items-baseline gap-1.5">
                  <span className="tracking-[0.12em] uppercase">Base</span>
                  <input
                    type="number"
                    value={operative.points ?? ''}
                    onChange={(e) => onFieldChange('points', Number(e.target.value) || 0)}
                    className={`w-10 bg-transparent text-left font-medium text-[var(--bf-text-muted)] outline-none focus:text-[var(--bf-field-muted)] ${compact ? 'text-[10px]' : 'text-xs'}`}
                    aria-label="Base size"
                  />
                </label>
              ) : (
                <p className="m-0 tracking-[0.12em] uppercase">
                  <span>Base </span>
                  <span className="font-medium tabular-nums">{operative.points ?? '—'}</span>
                </p>
              )}
            </div>
          </div>
        </header>

        {showAbilityScores ? (
          <div className="operative-card-campaign border-b px-2 py-2">
            <p className="bf-mono-label mb-1 text-left">Campaign — ability scores</p>
            <AbilityScoresRow
              operative={operative}
              editable={editable}
              compact={compact}
              onLevelChange={onLevelChange}
              onAbilityScoreAdjust={onAbilityScoreAdjust}
            />
          </div>
        ) : null}

        <section className="operative-card-weapons-block border-t border-zinc-600/50">
          <div className={`operative-card-section-body bg-zinc-950/60 ${compact ? 'p-2' : 'p-3'}`}>
            <div
              className={`operative-card-aligned-tables operative-card-table-wrap ${
                weaponsTypeaheadOpen ? 'overflow-visible' : 'overflow-x-auto'
              }`}
            >
              <OperativeCardProfileStatsTable
                operative={operative}
                roleDisplay={formatRoleDisplay(operative, editable)}
                editable={editable}
                onFieldChange={onFieldChange}
                compact={compact}
                padActionsColumn={editable}
              />
              <OperativeCardWeapons
                operative={operative}
                editable={editable}
                compact={compact}
                weaponsResetKey={weaponsResetKey}
                weaponOptions={weaponOptions}
                onWeaponChange={onWeaponChange}
                onReplaceWeapon={onReplaceWeapon}
                onAddWeapon={onAddWeapon}
                onRemoveWeapon={onRemoveWeapon}
                onTypeaheadOpenChange={setWeaponsTypeaheadOpen}
              />
            </div>
          </div>
        </section>

        <OperativeCardSection title="Abilities" compact={compact} className="border-t border-amber-900/30">
          {editable ? (
            <textarea
              value={operative.abilities ?? ''}
              onChange={(e) => onFieldChange('abilities', e.target.value)}
              rows={6}
              className={`operative-card-abilities-input bf-field-input min-h-[5rem] w-full resize-y ${compact ? 'text-xs' : 'text-sm'}`}
              placeholder="Operative abilities…"
            />
          ) : (
            <AbilitiesList abilities={operative.abilities} compact={compact} />
          )}
        </OperativeCardSection>

        {editable || operative.notes ? (
          <div className="border-t border-amber-900/30 bg-zinc-950/40 px-3 py-2">
            {editable ? (
              <EditableField
                label="Campaign notes"
                value={operative.notes}
                onChange={(v) => onFieldChange('notes', v)}
                multiline
                className="w-full"
                inputClassName={`min-h-[2.5rem] ${compact ? 'text-xs' : ''}`}
              />
            ) : (
              <DisplayField label="Campaign notes" value={operative.notes} multiline />
            )}
          </div>
        ) : null}

        {custom && editable ? (
          <p className="border-t border-[var(--bf-border)] px-3 py-1.5 text-left text-[10px] text-[var(--bf-text-muted)]">
            Homebrew dataslate
          </p>
        ) : null}
      </article>
    </div>
  )
}
