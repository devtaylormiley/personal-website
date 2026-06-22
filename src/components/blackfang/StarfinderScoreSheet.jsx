import { getFeatsForVeteranUpToLevel } from '../../data/deathwatchVeteranStarfinderBuilds'
import {
  ABILITY_KEYS,
  abilityShortLabel,
  classLabel,
  clampSf2eLevel,
  saveLabel,
  SF2E_SAVE_TO_ABILITY,
} from '../../lib/starfinderScores'
import StarfinderFeatsTable from './StarfinderFeatsTable'
import StatChip from './StatChip'

const scoreInputClass = 'bf-field-input w-14 px-2 py-1 text-center text-sm'

function ScoreChipRow({ children, className = '' }) {
  return <div className={`flex flex-wrap gap-1.5 ${className}`}>{children}</div>
}

export default function StarfinderScoreSheet({
  operative,
  compact = false,
  preview = false,
  editable = false,
  onLevelChange,
}) {
  const abilityScores = operative?.abilityScores ?? {}
  const sf2eClass = operative?.sf2eClass ?? 'soldier'
  const level = clampSf2eLevel(operative?.level ?? 1)
  const saves = operative?.starfinderSaves ?? {}
  const veteranId = operative?.sourceVeteranId ?? operative?.id
  const feats = veteranId ? getFeatsForVeteranUpToLevel(veteranId, level) : []

  const abilityChips = ABILITY_KEYS.map((key) => {
    const score = Number(abilityScores?.[key] ?? 10)
    return <StatChip key={key} label={abilityShortLabel(key)} value={score} />
  })

  const saveChips = Object.keys(SF2E_SAVE_TO_ABILITY).map((saveKey) => (
    <StatChip key={saveKey} label={saveLabel(saveKey)} value={saves[saveKey] ?? '—'} />
  ))

  if (preview) {
    return (
      <div className="mt-3 space-y-1.5 border-t border-[var(--bf-border)]/60 pt-3">
        <ScoreChipRow>{abilityChips}</ScoreChipRow>
        <ScoreChipRow>{saveChips}</ScoreChipRow>
      </div>
    )
  }

  const headClass = compact ? 'text-[10px]' : 'text-xs'

  return (
    <div className="mt-3">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <h4 className={`bf-mono-label ${headClass}`}>Starfinder 2e · {classLabel(sf2eClass)}</h4>
        {editable && onLevelChange ? (
          <label className="block w-24">
            <span className="bf-mono-label mb-1 block">Level</span>
            <input
              type="number"
              min={1}
              max={20}
              value={level}
              onChange={(event) => {
                const next = clampSf2eLevel(event.target.value)
                onLevelChange(next)
              }}
              className={`${scoreInputClass} w-full`}
            />
          </label>
        ) : (
          <p className={`bf-muted ${compact ? 'text-xs' : 'text-sm'}`}>
            Level <span className="tabular-nums text-[var(--bf-field)]">{level}</span>
          </p>
        )}
      </div>

      <ScoreChipRow className="mb-1.5">{abilityChips}</ScoreChipRow>
      <ScoreChipRow className="mb-3">{saveChips}</ScoreChipRow>

      <StarfinderFeatsTable feats={feats} compact={compact} operativeId={operative?.id ?? veteranId} />
    </div>
  )
}
