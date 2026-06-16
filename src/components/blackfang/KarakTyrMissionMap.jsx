/** Metroid-style mission briefing schematic for Karak-Tyr hollow moon base. */
export default function KarakTyrMissionMap() {
  return (
    <figure className="bf-mission-map-figure">
      <div className="bf-mission-map-screen" role="img" aria-label="Mission map of Karak-Tyr hollow moon base showing insertion at Dock Sigma, corridors through stasis vaults, and primary objective at the Black Siphon core">
        <header className="bf-mission-map-header">
          <p className="bf-mission-map-header-label">Mission briefing · tactical overlay</p>
          <p className="bf-mission-map-header-title">KARAK-TYR · HOLLOW MOON STATION</p>
          <p className="bf-mission-map-header-meta">SECTOR GS-17 · CROSS-SECTION SCHEMATIC · REV 41.006</p>
        </header>

        <svg
          className="bf-mission-map-svg"
          viewBox="0 0 720 420"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="bf-map-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1b4d2a" strokeWidth="0.5" opacity="0.45" />
            </pattern>
            <filter id="bf-map-glow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="720" height="420" fill="#020804" />
          <rect width="720" height="420" fill="url(#bf-map-grid)" />

          {/* Hollow moon outer shell */}
          <ellipse cx="360" cy="210" rx="330" ry="185" fill="none" stroke="#33a357" strokeWidth="2" opacity="0.35" />
          <ellipse cx="360" cy="210" rx="300" ry="158" fill="none" stroke="#1b4d2a" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
          <text x="360" y="36" textAnchor="middle" className="bf-mission-map-svg-label">
            EXTERIOR HULL · NOCTILITH SHELL
          </text>

          {/* Corridors */}
          <g className="bf-mission-map-corridors" stroke="#1a6633" strokeWidth="6" strokeLinecap="square">
            <path d="M 130 210 H 220" />
            <path d="M 290 210 H 350" />
            <path d="M 430 210 H 500" />
            <path d="M 560 210 H 590" />
            <path d="M 250 210 V 145" />
            <path d="M 250 145 H 470" />
            <path d="M 470 145 V 210" />
            <path d="M 360 210 V 285" />
            <path d="M 360 285 H 520" />
            <path d="M 520 285 V 210" />
          </g>

          {/* Rooms */}
          <g className="bf-mission-map-rooms">
            <Room x={52} y={178} w={78} h={64} label="DOCK-Σ" sub="INSERT" variant="insert" />
            <Room x={168} y={178} w={82} h={64} label="AIRLOCK" sub="04" />
            <Room x={268} y={178} w={82} h={64} label="CORRIDOR" sub="A-7" />
            <Room x={168} y={96} w={164} h={58} label="STASIS VAULT" sub="DORMANT" variant="warn" />
            <Room x={368} y={178} w={92} h={64} label="RESEARCH" sub="LAB-3" />
            <Room x={488} y={178} w={72} h={64} label="CANOPTEK" sub="BAY" variant="unknown" />
            <Room x={568} y={178} w={88} h={64} label="SILENT" sub="HALL" variant="unknown" />
            <Room x={288} y={268} w={144} h={58} label="NECROPOLIS" sub="RESTRICTED" variant="warn" />
            <Room x={488} y={258} w={120} h={78} label="BLACK SIPHON" sub="PRIMARY OBJ" variant="objective" />
          </g>

          {/* Insertion marker */}
          <g filter="url(#bf-map-glow)">
            <polygon points="118,210 108,204 108,216" fill="#78c892" />
            <text x="118" y="248" className="bf-mission-map-svg-marker">
              YOU
            </text>
          </g>

          {/* Objective marker */}
          <g className="bf-mission-map-objective-pulse" filter="url(#bf-map-glow)">
            <rect x="534" y="288" width="28" height="18" fill="none" stroke="#c07858" strokeWidth="2" />
            <text x="548" y="340" textAnchor="middle" className="bf-mission-map-svg-objective">
              OBJ
            </text>
          </g>

          {/* Compass */}
          <g className="bf-mission-map-compass" transform="translate(648, 48)">
            <circle r="22" fill="#070d08" stroke="#4a8f62" strokeWidth="1" />
            <text y="-6" textAnchor="middle" className="bf-mission-map-svg-compass">
              N
            </text>
            <path d="M 0 -14 L 0 14 M -14 0 L 14 0" stroke="#5cb876" strokeWidth="1" opacity="0.6" />
          </g>
        </svg>

        <ul className="bf-mission-map-legend" aria-label="Map legend">
          <li>
            <span className="bf-mission-map-legend-swatch bf-mission-map-legend-swatch--insert" aria-hidden />
            Insertion / cleared
          </li>
          <li>
            <span className="bf-mission-map-legend-swatch bf-mission-map-legend-swatch--room" aria-hidden />
            Mapped sector
          </li>
          <li>
            <span className="bf-mission-map-legend-swatch bf-mission-map-legend-swatch--warn" aria-hidden />
            High threat
          </li>
          <li>
            <span className="bf-mission-map-legend-swatch bf-mission-map-legend-swatch--unknown" aria-hidden />
            Unconfirmed
          </li>
          <li>
            <span className="bf-mission-map-legend-swatch bf-mission-map-legend-swatch--objective" aria-hidden />
            Primary objective
          </li>
        </ul>
      </div>

      <figcaption className="bf-lore-document-figure-caption">
        Tactical schematic · Karak-Tyr interior · Black Siphon objective routing
      </figcaption>
    </figure>
  )
}

const ROOM_STYLES = {
  default: { fill: '#0d150f', stroke: '#4a8f62', dash: null },
  insert: { fill: '#1a3024', stroke: '#78c892', dash: null },
  warn: { fill: '#1a1408', stroke: '#967838', dash: null },
  unknown: { fill: '#0a110c', stroke: '#2a4a35', dash: '4 3' },
  objective: { fill: '#2a1814', stroke: '#c07858', dash: null },
}

function Room({ x, y, w, h, label, sub, variant = 'default' }) {
  const style = ROOM_STYLES[variant] ?? ROOM_STYLES.default

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={variant === 'objective' ? 2.5 : 1.5}
        strokeDasharray={style.dash ?? undefined}
      />
      <text x={x + w / 2} y={y + h / 2 - 2} textAnchor="middle" className="bf-mission-map-svg-room-label">
        {label}
      </text>
      <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" className="bf-mission-map-svg-room-sub">
        {sub}
      </text>
    </g>
  )
}
