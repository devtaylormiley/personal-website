import { useEffect, useRef, useState } from 'react'

const BAR_SEGMENTS = 32

const BOOT_LINES = [
  { at: 0, text: 'BLACKFANG UPLINK v3.1.9' },
  { at: 200, text: 'ESTABLISHING CONNECTION TO FORT PYKMAN...' },
  { at: 450, text: 'RESOLVING VOX-RELAY · SECTOR 7G' },
  { at: 1200, text: 'HANDSHAKE: AES-4096 / IMPERIAL CIPHER' },
  { at: 2100, text: 'ROUTING THROUGH DEEP VOID RELAY...' },
  { at: 2900, text: 'VERIFYING OPERATOR CLEARANCE...' },
  { at: 3600, text: 'CONNECTION ESTABLISHED — FORT PYKMAN ONLINE' },
]

const PROGRESS_DURATION_MS = 3400

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mediaQuery.matches)
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  return reduced
}

export default function FortPykmanConnectionOverlay({ runToken = 0 }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [lines, setLines] = useState([])
  const [progress, setProgress] = useState(0)
  const timersRef = useRef([])
  const lastRunTokenRef = useRef(0)

  useEffect(() => {
    if (runToken <= 0 || runToken === lastRunTokenRef.current) return
    lastRunTokenRef.current = runToken
    setExiting(false)
    setLines([])
    setProgress(0)
    setVisible(true)
  }, [runToken])

  useEffect(() => {
    if (!visible) return undefined

    const timers = timersRef.current

    const clearTimers = () => {
      timers.forEach(clearTimeout)
      timers.length = 0
    }

    if (prefersReducedMotion) {
      setVisible(false)
      return clearTimers
    }

    const start = performance.now()
    let rafId = 0

    const tickProgress = (now) => {
      const elapsed = now - start
      const next = Math.min(100, Math.round((elapsed / PROGRESS_DURATION_MS) * 100))
      setProgress(next)
      if (next < 100) {
        rafId = requestAnimationFrame(tickProgress)
      }
    }

    rafId = requestAnimationFrame(tickProgress)

    BOOT_LINES.forEach(({ at, text }) => {
      timers.push(
        setTimeout(() => {
          setLines((current) => [...current, text])
        }, at),
      )
    })

    timers.push(
      setTimeout(() => {
        setExiting(true)
      }, 4200),
    )

    timers.push(
      setTimeout(() => {
        setVisible(false)
      }, 4800),
    )

    return () => {
      cancelAnimationFrame(rafId)
      clearTimers()
    }
  }, [visible, prefersReducedMotion])

  if (!visible) {
    return null
  }

  const filledSegments = Math.round((progress / 100) * BAR_SEGMENTS)

  return (
    <div
      className={`bf-connection-overlay blackfang-campaign ${exiting ? 'bf-connection-overlay--exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Establishing connection to Fort Pykman"
      aria-live="polite"
    >
      <div className="bf-connection-scanlines" aria-hidden="true" />
      <div className="bf-connection-panel">
        <div className="bf-connection-titlebar">
          <span>
            UPLINK_INIT
            <span className="bf-terminal-cursor">█</span>
          </span>
          <span className="bf-connection-titlebar-meta">FORT PYKMAN · SECURE CHANNEL</span>
        </div>

        <div className="bf-connection-body">
          <p className="bf-connection-prompt">&gt; AWAITING HANDSHAKE...</p>

          <ul className="bf-connection-log">
            {lines.map((line, index) => (
              <li key={`${index}-${line}`}>&gt; {line}</li>
            ))}
          </ul>

          <div className="bf-connection-bar-row">
            <span className="bf-connection-bar-label">LINK</span>
            <div className="bf-connection-bar" aria-hidden="true">
              {Array.from({ length: BAR_SEGMENTS }, (_, index) => (
                <span
                  key={index}
                  className={
                    index < filledSegments
                      ? 'bf-connection-bar-seg bf-connection-bar-seg--on'
                      : 'bf-connection-bar-seg'
                  }
                />
              ))}
            </div>
            <span className="bf-connection-bar-pct">{String(progress).padStart(3, ' ')}%</span>
          </div>

          <p className="bf-connection-status">
            {progress < 100 ? 'NEGOTIATING SECURE TUNNEL...' : 'CHANNEL OPEN'}
          </p>
        </div>
      </div>
    </div>
  )
}
