import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}

function scrollToHash(hash) {
  const id = hash.replace(/^#/, '')
  if (!id) {
    scrollToTop()
    return
  }

  const scrollToTarget = () => {
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ block: 'start', behavior: 'instant' })
      return true
    }
    return false
  }

  if (scrollToTarget()) return

  requestAnimationFrame(() => {
    if (!scrollToTarget()) scrollToTop()
  })
}

/** Scroll to top on route change; honor `#section` hashes for in-page targets. */
export default function useScrollToTopOnNavigate() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      scrollToHash(hash)
      return
    }
    scrollToTop()
  }, [pathname, hash])
}
