import { useEffect, useState } from 'react'

/** True when document content extends beyond the viewport (scroll needed). */
export default function usePageHasScrollbar({ threshold = 1, pathname = '' } = {}) {
  const [hasScrollbar, setHasScrollbar] = useState(false)

  useEffect(() => {
    function check() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setHasScrollbar(scrollable > threshold)
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
  }, [threshold, pathname])

  return hasScrollbar
}
