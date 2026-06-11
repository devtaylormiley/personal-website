import { formatPrice } from './mockRows'

export function filterOperationsRows(rows, { keyword, site }) {
  const query = keyword.trim().toLowerCase()

  return rows.filter((row) => {
    if (site !== 'all' && row.site !== site) return false
    if (!query) return true

    const searchable = [
      row.id,
      row.asset,
      row.site ?? '',
      row.status,
      row.owner ?? '',
      row.category ?? '',
      row.updated,
      row.price != null ? String(row.price) : '',
      formatPrice(row.price) ?? '',
    ]
      .join(' ')
      .toLowerCase()

    return searchable.includes(query)
  })
}
