import { formatPrice } from './mockRows'

export const EMPTY_COLUMN_FILTERS = {
  id: '',
  asset: '',
  site: '',
  category: '',
  owner: '',
  price: '',
  updated: '',
  status: 'all',
}

function matchesTextFilter(value, filter) {
  const query = filter.trim().toLowerCase()
  if (!query) return true
  if (value == null || value === '') return false
  return String(value).toLowerCase().includes(query)
}

function matchesPriceFilter(value, filter) {
  const query = filter.trim().toLowerCase()
  if (!query) return true
  if (value == null) return false
  const raw = String(value).toLowerCase()
  const formatted = (formatPrice(value) ?? '').toLowerCase()
  return raw.includes(query) || formatted.includes(query)
}

export function filterRowsByColumns(rows, filters) {
  return rows.filter((row) => {
    if (!matchesTextFilter(row.id, filters.id)) return false
    if (!matchesTextFilter(row.asset, filters.asset)) return false
    if (!matchesTextFilter(row.site, filters.site)) return false
    if (!matchesTextFilter(row.category, filters.category)) return false
    if (!matchesTextFilter(row.owner, filters.owner)) return false
    if (!matchesPriceFilter(row.price, filters.price)) return false
    if (!matchesTextFilter(row.updated, filters.updated)) return false
    if (filters.status !== 'all' && row.status !== filters.status) return false
    return true
  })
}
