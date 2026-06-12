import { useEffect, useState } from 'react'

const DEFAULT_FOOTER_SELECTOR = '.portfolio-site__footer'
const GAP_PX = 12

/**
 * Pixels to add to fixed bottom offset so floats sit above a visible site footer.
 */
export default function useFooterClearance(footerSelector = DEFAULT_FOOTER_SELECTOR, pathname = '') {
  const [clearance, setClearance] = useState(0)

  useEffect(() => {
    if (!footerSelector) {
      setClearance(0)
      return undefined
    }

    function update() {
      const footer = document.querySelector(footerSelector)
      if (!footer) {
        setClearance(0)
        return
      }

      const { top, bottom } = footer.getBoundingClientRect()
      const viewportBottom = window.innerHeight

      if (bottom <= 0 || top >= viewportBottom) {
        setClearance(0)
        return
      }

      const visibleHeight = Math.min(bottom, viewportBottom) - Math.max(top, 0)
      setClearance(Math.max(0, visibleHeight + GAP_PX))
    }

    update()

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    const footer = document.querySelector(footerSelector)
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && footer ? new ResizeObserver(update) : null
    resizeObserver?.observe(footer)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      resizeObserver?.disconnect()
    }
  }, [footerSelector, pathname])

  return clearance
}
