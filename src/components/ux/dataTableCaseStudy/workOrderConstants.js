export const WORK_ORDER_STATUSES = ['Ready', 'In progress', 'Blocked', 'Closed']

export const STATUS_TEXT_CLASS = {
  Ready: 'text-emerald-400',
  'In progress': 'text-amber-400',
  Blocked: 'text-red-400',
  Closed: 'text-zinc-500',
}

export function getStatusTextClass(status) {
  if (status == null || status === '') return null
  return STATUS_TEXT_CLASS[status] ?? 'text-zinc-300'
}

export function getOperationSites(rows) {
  return [...new Set(rows.map((row) => row.site).filter(Boolean))].sort()
}

export function getOperationCategories(rows) {
  return [...new Set(rows.map((row) => row.category).filter(Boolean))].sort()
}
