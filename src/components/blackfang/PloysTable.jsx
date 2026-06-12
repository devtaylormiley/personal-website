import RegistryTable from './registry/RegistryTable'
import {
  getPloyCpShortLabel,
  getPloyTypeLabel,
  getPloyUsageHint,
} from '../../lib/killTeamPloys'

function renderEffect(ploy) {
  const description = ploy.description?.trim()
  const usageHint = getPloyUsageHint(description)

  if (!description && !usageHint) {
    return <span className="bf-muted">—</span>
  }

  return (
    <div className="space-y-1.5">
      {usageHint ? (
        <p className="font-medium text-[var(--bf-phosphor-orange-bright)]">{usageHint}</p>
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
    className: 'w-[22%] min-w-[7rem]',
    render: (row) => (
      <span className="font-medium text-[var(--bf-accent-bright)]">{row.name}</span>
    ),
  },
  {
    key: 'type',
    label: 'Type',
    className: 'w-[14%] min-w-[5.5rem] whitespace-nowrap',
    render: (row) => (
      <span className="font-medium text-[var(--bf-phosphor-amber-bright)]">
        {getPloyTypeLabel(row.type)}
      </span>
    ),
  },
  {
    key: 'cp',
    label: 'CP',
    className: 'w-[12%] min-w-[4.5rem] whitespace-nowrap',
    render: (row) => (
      <span className="font-medium text-[var(--bf-phosphor-cyan-bright)]">
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
  const rows = (ploys ?? []).map((ploy) => ({
    key: ploy.ployId ?? ploy.name,
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
