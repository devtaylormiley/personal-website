import RegistryTable from './registry/RegistryTable'
import {
  getPloyCpShortLabel,
  getPloyUsageHint,
} from '../../lib/killTeamPloys'
import { dataslateToneClass } from '../../lib/ruleChipTones'

function renderEffect(ploy) {
  const description = ploy.description?.trim()
  const usageHint = getPloyUsageHint(description)

  if (!description && !usageHint) {
    return <span className="bf-muted">—</span>
  }

  return (
    <div className="space-y-1.5">
      {usageHint ? (
        <p className="font-medium text-[var(--bf-phosphor-orange)]">{usageHint}</p>
      ) : null}
      {description ? (
        <p className="bf-body whitespace-pre-wrap text-[var(--bf-text)]">{description}</p>
      ) : null}
    </div>
  )
}

const PLOY_COLUMNS = [
  {
    key: 'name',
    label: 'Ploy',
    className: 'w-[26%] min-w-[7rem]',
    render: (row) => (
      <span className="font-medium text-[var(--bf-item,var(--bf-accent))]">
        {row.name}
      </span>
    ),
  },
  {
    key: 'cp',
    label: 'CP',
    className: 'w-[3.5rem] min-w-[3rem] max-w-[4rem] whitespace-nowrap text-center',
    render: (row) => (
      <span className="font-medium text-[var(--bf-phosphor-cyan)]">
        {getPloyCpShortLabel(row)}
      </span>
    ),
  },
  {
    key: 'effect',
    label: 'Effect',
    className: 'min-w-[12rem]',
    render: (row) => renderEffect(row),
  },
]

export default function PloysTable({ ploys, emptyMessage = 'No ploys listed.' }) {
  const rows = (ploys ?? []).map((ploy, index) => ({
    key: ploy.ployId ?? ploy.name,
    toneClass: dataslateToneClass(ploy.name, index),
    ...ploy,
  }))

  return (
    <RegistryTable
      columns={PLOY_COLUMNS}
      rows={rows}
      emptyMessage={emptyMessage}
    />
  )
}
