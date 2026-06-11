/** Shared column grid: Role|Weapons, APL|ATK, Move|HIT, Save|DMG, Wounds|Rules */
export function OperativeCardTableColgroup({ actionsColumn = false, statsOnly = false }) {
  if (statsOnly) {
    return (
      <colgroup>
        <col className="operative-card-col-stat" />
        <col className="operative-card-col-stat" />
        <col className="operative-card-col-stat" />
        <col className="operative-card-col-stat" />
      </colgroup>
    )
  }

  return (
    <colgroup>
      <col className="operative-card-col-name" />
      <col className="operative-card-col-stat" />
      <col className="operative-card-col-stat" />
      <col className="operative-card-col-stat" />
      <col className="operative-card-col-wide" />
      {actionsColumn ? <col className="operative-card-col-actions" /> : null}
    </colgroup>
  )
}

export const operativeCardTableAlignedClass =
  'operative-card-table operative-card-table--aligned w-full min-w-0 text-left'
