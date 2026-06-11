import { useMemo, useState } from 'react'
import { EMPTY_COLUMN_FILTERS, filterRowsByColumns } from './filterRowsByColumns'

export function useColumnFilters(rows) {
  const [filters, setFilters] = useState(EMPTY_COLUMN_FILTERS)

  const filteredRows = useMemo(
    () => filterRowsByColumns(rows, filters),
    [rows, filters],
  )

  const setFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  return { filters, setFilter, filteredRows }
}
