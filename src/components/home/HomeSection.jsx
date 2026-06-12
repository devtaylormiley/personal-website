export default function HomeSection({
  id,
  eyebrow,
  title,
  lead,
  headerAfterTitle,
  align = 'left',
  showDivider = true,
  className = '',
  children,
}) {
  const alignClass = align === 'center' ? 'home-section--center' : ''

  return (
    <section
      id={id}
      className={`home-section ${alignClass}${showDivider ? ' home-section--divided' : ''}${className ? ` ${className}` : ''}`}
    >
      <div className="home-section__inner">
        <header className="home-section__header">
          <p className="home-section__eyebrow">{eyebrow}</p>
          <h2 className="home-section__title">{title}</h2>
          {headerAfterTitle ? (
            <div className="home-section__header-addon">{headerAfterTitle}</div>
          ) : null}
          {lead ? <p className="home-section__lead">{lead}</p> : null}
        </header>
        {children}
      </div>
    </section>
  )
}
