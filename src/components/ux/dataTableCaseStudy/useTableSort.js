import { useMemo, useState } from 'react'
import { nextSortState, sortTableRows } from './sortTableRows'

export function useTableSort(rows, initialSort = { key: 'id', direction: 'asc' }) {
  const [sort, setSort] = useState(initialSort)

  const sortedRows = useMemo(() => sortTableRows(rows, sort), [rows, sort])

  const toggleSort = (key) => {
    setSort((current) => nextSortState(current, key))
  }

  return { sortedRows, sort, toggleSort }
}
