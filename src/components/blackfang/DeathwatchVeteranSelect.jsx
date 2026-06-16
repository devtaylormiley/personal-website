import { getDeathwatchVeteranGuide } from '../../data/deathwatchVeteranGuides'
import { bfToneClass } from '../../lib/blackfangNavigation'
import { getOperativeAccentTone } from '../../lib/operativeAccentTones'

function isGravisOperative(operative) {
  return (operative.keywords ?? '').toUpperCase().includes('GRAVIS')
}

function StatChip({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-[var(--bf-border)] bg-[var(--bf-bg)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--bf-text-muted)]">
      <span className="uppercase tracking-wide">{label}</span>
      <span className="font-semibold text-[var(--bf-field)]">{value}</span>
    </span>
  )
}

export default function DeathwatchVeteranSelect({
  operatives,
  selectedId,
  onSelect,
  applyingId,
  disabled = false,
}) {
  if (!operatives?.length) {
    return <p className="bf-muted text-sm">Loading Deathwatch veteran profiles…</p>
  }

  return (
    <div className="space-y-3">
      <p className="bf-body text-sm leading-relaxed">
        Choose the Deathwatch veteran archetype your Blackfang character is built from. This copies the
        official dataslate as a starting point — rename, re-flavour, and edit freely afterward.
      </p>

      <ul className="grid gap-3 sm:grid-cols-2" role="list">
        {operatives.map((operative, index) => {
          const guide = getDeathwatchVeteranGuide(operative.id)
          const selected = selectedId === operative.id
          const applying = applyingId === operative.id
          const tone = getOperativeAccentTone(index)
          const gravis = isGravisOperative(operative)

          return (
            <li key={operative.id}>
              <button
                type="button"
                disabled={disabled || applying}
                aria-pressed={selected}
                onClick={() => onSelect(operative.id)}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  selected
                    ? `border-[var(--bf-border-bright)] bg-[var(--bf-accent-bg)] ring-1 ring-[var(--bf-border-bright)] ${bfToneClass(tone)}`
                    : 'border-[var(--bf-border)] bg-[var(--bf-bg)] hover:border-[var(--bf-border-bright)] hover:bg-[var(--bf-surface)]'
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--bf-phosphor-amber)]">
                      {operative.role}
                    </p>
                    <h3 className="mt-0.5 font-display text-base tracking-wide text-[var(--bf-accent-bright)] uppercase">
                      {operative.name.replace(/^Deathwatch /, '')}
                    </h3>
                    {guide ? (
                      <p className="mt-1 text-sm font-medium text-[var(--bf-field)]">{guide.tagline}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-wrap justify-end gap-1">
                    {gravis ? (
                      <span className="rounded border border-[var(--bf-phosphor-orange-border)] bg-[var(--bf-phosphor-orange-bg)] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-[var(--bf-phosphor-orange)]">
                        Gravis
                      </span>
                    ) : null}
                    {selected ? (
                      <span className="rounded border border-[var(--bf-border-bright)] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-[var(--bf-accent-bright)]">
                        Selected
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <StatChip label="APL" value={operative.apl} />
                  <StatChip label="Move" value={operative.move} />
                  <StatChip label="Save" value={operative.save} />
                  <StatChip label="Wounds" value={operative.wounds} />
                  <StatChip label="Base" value={operative.points} />
                </div>

                {guide ? (
                  <div className="mt-3 space-y-2 border-t border-[var(--bf-border)]/60 pt-3">
                    <p className="bf-body text-xs leading-relaxed">{guide.summary}</p>
                    <div>
                      <p className="bf-mono-label mb-1 text-[10px]">Strengths</p>
                      <ul className="space-y-0.5 text-xs text-[var(--bf-field-muted)]">
                        {guide.strengths.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="bf-mono-label mb-1 text-[10px]">Watch outs</p>
                      <ul className="space-y-0.5 text-xs text-[var(--bf-text-muted)]">
                        {guide.considerations.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="bf-hint text-[11px] leading-relaxed">
                      <span className="font-medium text-[var(--bf-field-muted)]">Best for:</span>{' '}
                      {guide.bestFor}
                    </p>
                  </div>
                ) : null}

                {applying ? (
                  <p className="bf-muted mt-2 font-mono text-[10px] uppercase tracking-wide">
                    Applying dataslate…
                  </p>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
