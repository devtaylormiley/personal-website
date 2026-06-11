import {
  ABILITY_KEYS,
  ABILITY_META,
  ABILITY_SCORE_MIN_BELOW_TEN,
  abilityModifier,
  availableBoosts,
  canDecreaseAbilityScore,
  canIncreaseAbilityScore,
  formatModifier,
  getAbilityScoreValidationIssues,
  resolveOperativeAbilityScores,
} from '../../lib/abilityScores'

const scoreInputClass =
  'bf-field-input w-14 px-2 py-1 text-center text-sm'

const stepButtonClass =
  'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded text-[var(--bf-text-muted)] transition-colors hover:text-[var(--bf-accent-bright)] disabled:cursor-not-allowed disabled:opacity-40'

function ChevronUpIcon() {
  return (
    <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.5 7.5L6 4l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.5 4.5L6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function modifierChipClass(mod) {
  const base =
    'inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 tabular-nums text-xs font-medium'
  if (mod < 0) {
    return `${base} border-red-800/60 text-red-300`
  }
  return `${base} border-[var(--bf-border-bright)] text-[var(--bf-field)]`
}

export default function AbilityScoresRow({
  operative,
  editable,
  onLevelChange,
  onAbilityScoreAdjust,
  compact,
}) {
  const level = Math.min(20, Math.max(1, Number(operative?.level) || 1))
  const scores = resolveOperativeAbilityScores(operative)
  const boostsAvailable = availableBoosts(scores, level)
  const validationIssues = getAbilityScoreValidationIssues(scores, level)
  const cellPad = compact ? 'px-2 py-1.5' : 'px-3 py-2'
  const headClass = compact ? 'text-[10px]' : 'text-xs'
  const scoreValueClass = compact
    ? 'min-w-[1.75rem] text-base font-bold leading-none'
    : 'min-w-[2rem] text-xl font-bold leading-none'
  const valueClass = compact ? 'text-xs' : 'text-sm'

  return (
    <div className={compact ? 'mt-3' : 'mt-4'}>
      <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <h4 className={`bf-mono-label ${headClass}`}>Ability scores</h4>
        {editable ? (
          <label className="block w-24">
            <span className="bf-mono-label mb-1 block">Level</span>
            <input
              type="number"
              min={1}
              max={20}
              value={level}
              onChange={(event) => {
                const next = Math.min(20, Math.max(1, Number(event.target.value) || 1))
                onLevelChange(next)
              }}
              className={`${scoreInputClass} w-full`}
            />
          </label>
        ) : (
          <p className={`bf-muted ${valueClass}`}>
            Level <span className="tabular-nums text-[var(--bf-field)]">{level}</span>
          </p>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--bf-border)]">
        <table className={`w-full min-w-[36rem] text-left ${valueClass}`}>
          <thead>
            <tr className="operative-card-table-head border-b border-[var(--bf-border)]">
              {ABILITY_KEYS.map((key) => (
                <th key={key} className={`font-mono text-[var(--bf-accent)] ${cellPad} ${headClass}`}>
                  {ABILITY_META[key].short}
                </th>
              ))}
              <th
                className={`w-16 font-mono text-[var(--bf-accent)] ${cellPad} ${headClass} border-l border-[var(--bf-border)] text-left`}
              >
                Boosts
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {ABILITY_KEYS.map((key) => {
                const score = scores[key]
                const mod = abilityModifier(score)
                const modLabel = formatModifier(mod)
                const canIncrease = editable && canIncreaseAbilityScore(scores, key, level)
                const canDecrease = editable && canDecreaseAbilityScore(scores, key)

                return (
                  <td key={key} className={cellPad}>
                    <div className="flex flex-col items-start gap-1">
                      {editable ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={`${scoreValueClass} text-[var(--bf-field)]`}
                            aria-label={`${ABILITY_META[key].label} score`}
                          >
                            {score}
                          </span>
                          <div className="flex flex-col gap-0">
                            <button
                              type="button"
                              onClick={() => onAbilityScoreAdjust(key, 1)}
                              disabled={!canIncrease}
                              className={stepButtonClass}
                              aria-label={`Increase ${ABILITY_META[key].label}`}
                              title={
                                score === ABILITY_SCORE_MIN_BELOW_TEN
                                  ? 'Remove ability flaw (returns to 10)'
                                  : score >= 18
                                    ? 'Spend 1 boost (+1 above 18)'
                                    : 'Spend 1 boost (+2 up to 18)'
                              }
                            >
                              <ChevronUpIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() => onAbilityScoreAdjust(key, -1)}
                              disabled={!canDecrease}
                              className={stepButtonClass}
                              aria-label={`Decrease ${ABILITY_META[key].label}`}
                              title={
                                score === 10 && canDecrease
                                  ? 'Apply ability flaw (−2, awards 1 boost)'
                                  : 'Remove one boost'
                              }
                            >
                              <ChevronDownIcon />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className={`${scoreValueClass} text-[var(--bf-field)]`}>{score}</span>
                      )}
                      <span className={modifierChipClass(mod)} title="Ability modifier">
                        {modLabel}
                      </span>
                    </div>
                  </td>
                )
              })}
              <td className={`${cellPad} w-16 border-l border-zinc-800 align-top`}>
                <div className="flex flex-col items-center pt-1.5">
                  <span
                    className={`${scoreValueClass} ${
                      boostsAvailable > 0 ? 'boost-sparkle' : 'text-[var(--bf-text-muted)]'
                    }`}
                    title="Boosts remaining to spend"
                  >
                    {boostsAvailable}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {validationIssues.length > 0 ? (
        <ul className={`mt-2 space-y-1 ${compact ? 'text-xs' : 'text-sm'}`}>
          {validationIssues.map((issue) => (
            <li key={issue} className="text-sm text-red-300">
              {issue}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
