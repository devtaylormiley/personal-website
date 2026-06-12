import { useEffect, useState } from 'react'

const MAIN_SELECTOR = '.bf-campaign-main'
const BASE_BOTTOM_PX = 20
const BASE_SIDE_PX = 16
const BASE_SIDE_PX_SM = 24
const SM_BREAKPOINT = 640

function readSideInset() {
  return window.innerWidth >= SM_BREAKPOINT ? BASE_SIDE_PX_SM : BASE_SIDE_PX
}

function measureInsets() {
  const main = document.querySelector(MAIN_SELECTOR)
  if (!main) {
    const side = readSideInset()
    return {
      bottomPx: BASE_BOTTOM_PX,
      leftPx: side,
      rightPx: side,
    }
  }

  const rect = main.getBoundingClientRect()
  const side = readSideInset()
  const viewportBottom = window.innerHeight

  return {
    leftPx: Math.max(side, rect.left + side),
    rightPx: Math.max(side, window.innerWidth - rect.right + side),
    bottomPx: Math.max(BASE_BOTTOM_PX, viewportBottom - rect.bottom + BASE_BOTTOM_PX),
  }
}

/**
 * Keeps fixed page-end FABs inside the Blackfang main column and aligned to its bottom
 * when content is shorter than the viewport.
 */
export default function useBlackfangMainSectionInsets(pathname = '') {
  const [insets, setInsets] = useState(() => measureInsets())

  useEffect(() => {
    function update() {
      setInsets(measureInsets())
    }

    update()

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    const main = document.querySelector(MAIN_SELECTOR)
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && main ? new ResizeObserver(update) : null
    resizeObserver?.observe(main)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      resizeObserver?.disconnect()
    }
  }, [pathname])

  return insets
}
