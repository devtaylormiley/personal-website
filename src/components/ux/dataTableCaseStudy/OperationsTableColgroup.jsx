const otherColumnWidths = ['10%', null, '10%', '11%', '15%', '12%', '11%', '13%']

/** Monospaced figures for prices, dates, and work order IDs. */
export const numericCellClass = 'font-mono tabular-nums'

/** ~3 lines at text-xs / leading 1.35. */
export const assetIdCellClass =
  'min-w-0 max-w-[10.5rem] whitespace-normal break-words align-top leading-[1.35] min-h-[3.05rem]'

/** ~2 lines at text-xs / leading 1.35 (after table only). */
export const assetIdCellClassAfter =
  'min-w-0 max-w-[10rem] whitespace-normal break-words align-top leading-[1.35] min-h-[2.03rem]'

/** After: id, asset, site, category, owner, price, updated, status, actions */
const afterColumnWidths = [
  '5.75rem', // work order
  '10rem', // asset (2-line wrap)
  '9%', // site
  '10%', // category
  '13%', // assigned technician
  '10%', // est. repair cost
  '8.5%', // last updated
  '9%', // status
  '5.5rem', // action icons (right-aligned)
]

/** Pending Orders tab (before): technician + complete control, then standard queue columns. */
const actionsColumnWidths = ['13%', '9rem', '22%', '9%', '10%', '11%', '9%', '10%']

export default function OperationsTableColgroup({ variant = 'before' }) {
  if (variant === 'after') {
    return (
      <colgroup>
        {afterColumnWidths.map((width, index) => (
          <col key={index} style={{ width }} />
        ))}
      </colgroup>
    )
  }

  if (variant === 'actions') {
    return (
      <colgroup>
        {actionsColumnWidths.map((width, index) => (
          <col key={index} style={{ width }} />
        ))}
      </colgroup>
    )
  }

  const columnWidths = otherColumnWidths.map((width, index) =>
    index === 1 ? '10.5rem' : width,
  )

  return (
    <colgroup>
      {columnWidths.map((width, index) => (
        <col key={index} style={{ width }} />
      ))}
    </colgroup>
  )
}
