import { useEffect, useState } from 'react'

/**
 * True after the user has scrolled past a meaningful portion of the page.
 */
export default function useScrollPastThreshold({
  minPx = 400,
  viewportRatio = 0.45,
  scrollableRatio = 0.2,
  pathname = '',
} = {}) {
  const [past, setPast] = useState(false)

  useEffect(() => {
    function check() {
      const { scrollY, innerHeight } = window
      const scrollable = document.documentElement.scrollHeight - innerHeight

      if (scrollable <= 0) {
        setPast(false)
        return
      }

      const threshold = Math.max(minPx, innerHeight * viewportRatio, scrollable * scrollableRatio)
      setPast(scrollY >= threshold)
    }

    setPast(false)
    check()

    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(check) : null
    resizeObserver?.observe(document.documentElement)

    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
      resizeObserver?.disconnect()
    }
  }, [minPx, viewportRatio, scrollableRatio, pathname])

  return past
}
