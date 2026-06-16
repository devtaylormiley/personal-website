import { useEffect, useState } from 'react'

const TOP_THRESHOLD = 16

/** True when the window is scrolled near the top. */
export function isAtScrollTop(scrollY = window.scrollY, threshold = TOP_THRESHOLD) {
  return scrollY <= threshold
}

/** Track vertical scroll offset (for page-end nav visibility). */
export default function useScrollY(pathname = '') {
  const [scrollY, setScrollY] = useState(() =>
    typeof window !== 'undefined' ? window.scrollY : 0,
  )

  useEffect(() => {
    function check() {
      setScrollY(window.scrollY)
    }

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
  }, [pathname])

  return scrollY
}

export { TOP_THRESHOLD }
