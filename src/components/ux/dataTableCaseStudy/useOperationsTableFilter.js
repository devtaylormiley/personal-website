import { useMemo, useState } from 'react'
import { tableRows } from './mockRows'
import { filterOperationsRows } from './filterOperationsRows'

export function useOperationsTableFilter(rows = tableRows) {
  const [keyword, setKeyword] = useState('')
  const [site, setSite] = useState('all')

  const filteredRows = useMemo(
    () => filterOperationsRows(rows, { keyword, site }),
    [rows, keyword, site],
  )

  return { keyword, setKeyword, site, setSite, filteredRows }
}
