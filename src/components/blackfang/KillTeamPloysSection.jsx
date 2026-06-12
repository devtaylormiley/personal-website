import { useEffect, useState } from 'react'
import {
  formatPloysForEdit,
  parsePloysFromEditText,
  PLOYS_SECTION_TITLE,
  resolveKillTeamPloys,
} from '../../lib/killTeamPloys'
import PloysTable from './PloysTable'

function SectionHeading({ title, compact }) {
  return <p className={`bf-mono-label mb-2 ${compact ? 'text-[10px]' : ''}`}>{title}</p>
}

export default function KillTeamPloysSection({
  killTeam,
  editable = false,
  onPloysChange,
  className = '',
  compact = false,
}) {
  const ploys = resolveKillTeamPloys(killTeam)
  const [draft, setDraft] = useState(() => formatPloysForEdit(ploys))

  useEffect(() => {
    if (!editable) return
    setDraft(formatPloysForEdit(resolveKillTeamPloys(killTeam)))
  }, [editable, killTeam])

  if (editable && onPloysChange) {
    return (
      <label className={`block w-full min-w-0 ${className}`}>
        <span className="bf-mono-label mb-1 block">{PLOYS_SECTION_TITLE}</span>
        <span className="bf-hint mb-2 block text-xs">
          One ploy per block. Use &quot;Name: description&quot; for each entry.
        </span>
        <textarea
          value={draft}
          onChange={(e) => {
            const next = e.target.value
            setDraft(next)
            onPloysChange(parsePloysFromEditText(next))
          }}
          rows={8}
          className="bf-field-input min-h-[8rem] w-full resize-y text-sm"
          placeholder="Mission Tactics: Select Conceal or Engage…"
        />
      </label>
    )
  }

  return (
    <div className={`w-full min-w-0 ${className}`}>
      <SectionHeading title={PLOYS_SECTION_TITLE} compact={compact} />
      <PloysTable ploys={ploys} />
    </div>
  )
}
