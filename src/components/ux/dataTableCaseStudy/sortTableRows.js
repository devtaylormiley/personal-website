function compareValues(a, b, key) {
  const av = a[key]
  const bv = b[key]

  if (av == null && bv == null) return 0
  if (av == null) return 1
  if (bv == null) return -1

  if (key === 'price' || key === 'atk') {
    const an = Number(av)
    const bn = Number(bv)
    if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn
  }
  if (key === 'updated') return String(av).localeCompare(String(bv))

  return String(av).localeCompare(String(bv), undefined, { sensitivity: 'base', numeric: true })
}

export function sortTableRows(rows, sort) {
  if (!sort?.key || !sort.direction) return rows

  const direction = sort.direction === 'asc' ? 1 : -1
  return [...rows].sort((a, b) => compareValues(a, b, sort.key) * direction)
}

export function nextSortState(current, key) {
  if (current.key !== key) return { key, direction: 'asc' }
  if (current.direction === 'asc') return { key, direction: 'desc' }
  return { key, direction: 'asc' }
}
