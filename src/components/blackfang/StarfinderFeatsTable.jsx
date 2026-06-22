import { dataslateToneClass } from '../../lib/ruleChipTones'

export default function StarfinderFeatsTable({ feats = [], compact = false, operativeId = 'sf2e' }) {
  const cellPad = compact ? 'px-2 py-1.5 align-top' : 'px-3 py-2.5 align-top'
  const headClass = compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-2 text-xs'
  const tableClass = `operative-card-table w-full min-w-0 text-left ${compact ? 'text-xs' : 'text-sm'}`

  return (
    <div className="mt-3">
      <h4 className={`bf-mono-label mb-2 ${compact ? 'text-[10px]' : 'text-xs'}`}>Feats</h4>
      <div className="operative-card-table-wrap overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr className="operative-card-table-head">
              <th className={`font-medium ${headClass}`}>Feat</th>
              <th className={`w-16 font-medium ${headClass}`}>Level</th>
              <th className={`font-medium ${headClass}`}>Description</th>
            </tr>
          </thead>
          <tbody>
            {feats.length === 0 ? (
              <tr>
                <td colSpan={3} className={`${cellPad} bf-muted text-left`}>
                  No feats yet at this level.
                </td>
              </tr>
            ) : (
              feats.map((feat, index) => {
                const toneClass = dataslateToneClass(feat.name ?? feat.description, index)
                return (
                  <tr
                    key={`${operativeId}-feat-${feat.level}-${feat.name}`}
                    className={`bf-dataslate-row border-t border-[var(--bf-border)]/60 ${toneClass}`}
                  >
                    <td className={`${cellPad} font-medium text-[var(--bf-item,var(--bf-accent))] uppercase`}>
                      {feat.name}
                    </td>
                    <td className={`${cellPad} tabular-nums text-[var(--bf-field)]`}>{feat.level}</td>
                    <td className={`${cellPad} bf-body whitespace-pre-wrap`}>{feat.description}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
