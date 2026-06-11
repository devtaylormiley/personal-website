import { useCallback, useEffect, useRef, useState } from 'react'

const DEFAULT_PAGE_SIZE = 30

/**
 * Renders a growing slice of `items` and loads more when a sentinel enters the viewport.
 * Pass `resetKey` (e.g. search query) to reset the window when filters change.
 */
export function useLazyList(items, { pageSize = DEFAULT_PAGE_SIZE, resetKey } = {}) {
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const sentinelRef = useRef(null)

  useEffect(() => {
    setVisibleCount(pageSize)
  }, [items, resetKey, pageSize])

  const visibleItems = items.slice(0, visibleCount)
  const hasMore = visibleCount < items.length

  const loadMore = useCallback(() => {
    setVisibleCount((count) => Math.min(count + pageSize, items.length))
  }, [items.length, pageSize])

  useEffect(() => {
    if (!hasMore) return undefined
    const node = sentinelRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '320px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loadMore, visibleCount])

  return {
    visibleItems,
    sentinelRef,
    hasMore,
    visibleCount,
    totalCount: items.length,
  }
}
