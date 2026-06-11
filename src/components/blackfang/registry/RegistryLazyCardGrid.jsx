import { useLazyList } from '../../../hooks/useLazyList'

export default function RegistryLazyCardGrid({
  items,
  renderItem,
  emptyMessage,
  columns = 3,
  pageSize,
  resetKey,
  listClassName,
}) {
  const { visibleItems, sentinelRef, hasMore, visibleCount, totalCount } = useLazyList(items, {
    pageSize,
    resetKey,
  })

  if (items.length === 0) {
    return <p className="bf-muted mt-6 py-10 text-center text-sm">{emptyMessage}</p>
  }

  const gridClass =
    listClassName ??
    (columns === 1 ? 'mt-6 grid grid-cols-1 gap-4' : 'mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3')

  return (
    <>
      <ul className={gridClass}>
        {visibleItems.map((item, index) => renderItem(item, index))}
      </ul>
      {hasMore ? (
        <div
          ref={sentinelRef}
          className="bf-lazy-list-sentinel bf-muted mt-4 py-6 text-center text-xs"
          aria-live="polite"
        >
          Loading more… ({visibleCount} of {totalCount})
        </div>
      ) : null}
    </>
  )
}
