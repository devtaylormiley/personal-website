/** Wraps Blackfang page content in a retro terminal frame (bezel only). */
export default function BlackfangTerminalShell({ children, className = '' }) {
  const screenClass = ['bf-terminal-screen', className].filter(Boolean).join(' ')

  return (
    <div className={screenClass}>
      <div className="bf-terminal-body">{children}</div>
    </div>
  )
}
