import {
  OperativeCardTableColgroup,
  operativeCardTableAlignedClass,
} from './operativeCardTableColumns'

const STAT_COLS = [
  { key: 'apl', label: 'APL', type: 'number' },
  { key: 'move', label: 'Move' },
  { key: 'save', label: 'Save' },
]

const WOUNDS_COL = { key: 'wounds', label: 'Wounds', type: 'number' }

export default function OperativeCardProfileStatsTable({
  operative,
  roleDisplay,
  editable,
  onFieldChange,
  compact,
  padActionsColumn = false,
  hideRoleColumn = false,
  listPreview = false,
}) {
  const tableClass = `${operativeCardTableAlignedClass} operative-card-profile-stats ${
    listPreview ? 'text-base' : compact ? 'text-xs' : 'text-sm'
  }`
  const headClass = listPreview
    ? 'px-4 py-2 text-sm'
    : compact
      ? 'px-2 py-1 text-[10px]'
      : 'px-3 py-1.5 text-xs'
  const cellClass = listPreview ? 'px-4 py-2.5' : compact ? 'px-2 py-1' : 'px-3 py-2'
  const statCellClass = `${cellClass} operative-card-col-stat-cell`
  const valueInputClass = `w-full min-w-0 bg-transparent text-left font-medium text-[var(--bf-field)] outline-none focus:text-[var(--bf-text-bright)] ${compact ? 'text-xs' : 'text-sm'}`

  return (
    <table className={tableClass}>
        <OperativeCardTableColgroup
          actionsColumn={padActionsColumn}
          statsOnly={hideRoleColumn}
        />
        <thead>
          <tr className="operative-card-profile-stats-head">
            {!hideRoleColumn ? <th className={headClass}>Role</th> : null}
            {STAT_COLS.map(({ label }) => (
              <th key={label} className={`${headClass} operative-card-col-stat-cell`}>
                {label}
              </th>
            ))}
            <th className={headClass}>{WOUNDS_COL.label}</th>
            {padActionsColumn ? <th className={headClass} aria-hidden="true" /> : null}
          </tr>
        </thead>
        <tbody>
          <tr>
            {!hideRoleColumn ? (
              <td className={`text-[var(--bf-field)] ${cellClass}`}>
                {editable && onFieldChange ? (
                  <input
                    type="text"
                    value={operative.role ?? ''}
                    onChange={(e) => onFieldChange('role', e.target.value)}
                    placeholder={roleDisplay || 'Role'}
                    className={valueInputClass}
                    aria-label="Operative role"
                  />
                ) : (
                  roleDisplay
                )}
              </td>
            ) : null}
            {[...STAT_COLS, WOUNDS_COL].map(({ key, type, label }) => (
              <td
                key={key}
                className={`text-[var(--bf-field)] ${STAT_COLS.some((s) => s.key === key) ? statCellClass : cellClass}`}
              >
                {editable && onFieldChange ? (
                  <input
                    type={type === 'number' ? 'number' : 'text'}
                    value={String(operative[key] ?? '')}
                    onChange={(e) =>
                      onFieldChange(key, type === 'number' ? Number(e.target.value) || 0 : e.target.value)
                    }
                    className={valueInputClass}
                    aria-label={label}
                  />
                ) : (
                  <span className="tabular-nums">{operative[key] ?? '—'}</span>
                )}
              </td>
            ))}
            {padActionsColumn ? <td className={cellClass} aria-hidden="true" /> : null}
          </tr>
        </tbody>
    </table>
  )
}
