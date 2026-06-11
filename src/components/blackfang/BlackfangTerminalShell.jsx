/**
 * Wraps Blackfang page content in a retro terminal frame (title bar + bezel).
 */
export default function BlackfangTerminalShell({ title = 'CAMPAIGN_HUB', children, className = '' }) {
  const label = title.toUpperCase().replace(/\s+/g, '_')
  const screenClass = ['bf-terminal-screen', className].filter(Boolean).join(' ')

  return (
    <div className={screenClass}>
      <div className="bf-terminal-titlebar" aria-hidden="true">
        <span className="bf-terminal-titlebar-path">
          {label}
          <span className="bf-terminal-cursor">█</span>
        </span>
        <span className="bf-terminal-titlebar-meta">PHOSPHOR_40X25 · ONLINE</span>
      </div>
      <div className="bf-terminal-body">{children}</div>
    </div>
  )
}
