import { useEffect, useRef, useState } from 'react'

const STICKY_TOP = 96 // top-24

export default function StickyAfterFullScroll({ children, className = '' }) {
  const columnRef = useRef(null)
  const contentRef = useRef(null)
  const bottomSeenRef = useRef(false)
  const pastEndRef = useRef(false)
  const [pinned, setPinned] = useState(false)
  const [metrics, setMetrics] = useState({ width: 0, height: 0 })
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    function syncEnabled() {
      setEnabled(mq.matches)
    }
    syncEnabled()
    mq.addEventListener('change', syncEnabled)
    return () => mq.removeEventListener('change', syncEnabled)
  }, [])

  useEffect(() => {
    if (!enabled) {
      bottomSeenRef.current = false
      pastEndRef.current = false
      setPinned(false)
      return
    }

    function update() {
      const column = columnRef.current
      const content = contentRef.current
      if (!column || !content) return

      const columnRect = column.getBoundingClientRect()
      const contentRect = content.getBoundingClientRect()
      const contentHeight = content.offsetHeight

      setMetrics({ width: columnRect.width, height: contentHeight })

      const columnEnd = columnRect.bottom <= STICKY_TOP + contentHeight + 8
      const scrolledBack = columnRect.top > STICKY_TOP

      if (scrolledBack) {
        bottomSeenRef.current = false
        pastEndRef.current = false
      }

      if (columnEnd) {
        pastEndRef.current = true
      }

      if (!pastEndRef.current && contentRect.bottom <= window.innerHeight) {
        bottomSeenRef.current = true
      }

      const shouldPin =
        !pastEndRef.current &&
        bottomSeenRef.current &&
        contentRect.top <= STICKY_TOP &&
        !columnEnd &&
        !scrolledBack

      setPinned(shouldPin)
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [enabled])

  return (
    <div ref={columnRef} className={className}>
      {pinned && enabled ? <div aria-hidden style={{ height: metrics.height }} /> : null}
      <div
        ref={contentRef}
        className={pinned && enabled ? 'fixed z-10' : undefined}
        style={
          pinned && enabled
            ? { top: STICKY_TOP, width: metrics.width > 0 ? metrics.width : undefined }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  )
}
