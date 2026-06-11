import { ployTooltip } from '../../lib/killTeamPloys'

export default function PloyChips({ ploys, compact = false }) {
  if (!ploys?.length) {
    return <span className="bf-muted text-sm">—</span>
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {ploys.map((ploy) => (
        <span
          key={ploy.name}
          title={ployTooltip(ploy)}
          className={`bf-chip cursor-help ${compact ? 'px-1.5 py-px text-[10px]' : 'px-2.5 py-1 text-xs'}`}
        >
          {ploy.name}
        </span>
      ))}
    </div>
  )
}
