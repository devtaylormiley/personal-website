import { useEffect, useState } from 'react'

/**
 * True when the user has scrolled near the bottom of the page.
 */
export default function usePageEndReached({ offset = 96, pathname = '' } = {}) {
  const [reached, setReached] = useState(false)

  useEffect(() => {
    function check() {
      const { scrollY, innerHeight } = window
      const docHeight = document.documentElement.scrollHeight
      setReached(scrollY + innerHeight >= docHeight - offset)
    }

    setReached(false)
    check()

    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(check)
        : null

    resizeObserver?.observe(document.documentElement)

    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
      resizeObserver?.disconnect()
    }
  }, [offset, pathname])

  return reached
}
