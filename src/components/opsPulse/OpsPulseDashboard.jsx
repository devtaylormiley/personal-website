import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  backlogTrend,
  categoryMix,
  CHART_THEME,
  kpiSummary,
  monthlyWorkOrders,
  repairSpendBySite,
  slaBySite,
} from '../../data/opsPulseDashboard'

const tooltipStyle = {
  backgroundColor: CHART_THEME.tooltipBg,
  border: `1px solid ${CHART_THEME.tooltipBorder}`,
  borderRadius: '0.375rem',
  fontSize: '0.75rem',
  color: '#e4e4e7',
}

const PANEL_CHART_HEIGHT = 260

function KpiCard({ label, value, delta, deltaLabel, tone }) {
  const positive = delta > 0
  const inverseGood = label.includes('repair') || label.includes('Open')
  const good = inverseGood ? delta < 0 : delta > 0

  return (
    <article className={`ops-pulse-kpi ops-pulse-kpi--${tone}`}>
      <p className="ops-pulse-kpi__label">{label}</p>
      <p className="ops-pulse-kpi__value">{value}</p>
      <p className={`ops-pulse-kpi__delta ${good ? 'ops-pulse-kpi__delta--good' : 'ops-pulse-kpi__delta--warn'}`}>
        {positive ? '+' : ''}
        {delta}
        {typeof delta === 'number' && label.includes('SLA') ? ' pts' : ''}
        <span className="ops-pulse-kpi__delta-label">{deltaLabel}</span>
      </p>
    </article>
  )
}

export default function OpsPulseDashboard() {
  return (
    <div className="ops-pulse-dashboard">
      <div className="ops-pulse-dashboard__kpis">
        {kpiSummary.map((kpi) => (
          <KpiCard key={kpi.id} {...kpi} />
        ))}
      </div>

      <div className="ops-pulse-dashboard__grid">
        <section className="ops-pulse-panel ops-pulse-panel--wide" aria-labelledby="wo-trend-title">
          <header className="ops-pulse-panel__header">
            <h3 id="wo-trend-title" className="ops-pulse-panel__title">
              Work orders opened vs. completed
            </h3>
            <p className="ops-pulse-panel__subtitle">Rolling 7 months · all sites</p>
          </header>
          <div className="ops-pulse-panel__chart" role="img" aria-label="Line chart of work orders opened and completed by month">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyWorkOrders} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke={CHART_THEME.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: CHART_THEME.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: CHART_THEME.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#a1a1aa' }} />
                <Line type="monotone" dataKey="opened" name="Opened" stroke={CHART_THEME.opened} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="completed" name="Completed" stroke={CHART_THEME.completed} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="ops-pulse-panel" aria-labelledby="sla-site-title">
          <header className="ops-pulse-panel__header">
            <h3 id="sla-site-title" className="ops-pulse-panel__title">
              SLA compliance by site
            </h3>
            <p className="ops-pulse-panel__subtitle">Target 95% · closed within window</p>
          </header>
          <div className="ops-pulse-panel__chart" role="img" aria-label="Bar chart of SLA percentage by site">
            <ResponsiveContainer width="100%" height={PANEL_CHART_HEIGHT}>
              <BarChart data={slaBySite} layout="vertical" margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
                <CartesianGrid stroke={CHART_THEME.grid} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[80, 100]} tick={{ fill: CHART_THEME.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="site" width={88} tick={{ fill: CHART_THEME.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, 'SLA']} />
                <ReferenceLine x={95} stroke={CHART_THEME.target} strokeDasharray="4 4" label={{ value: 'Target', fill: '#71717a', fontSize: 10 }} />
                <Bar dataKey="sla" name="SLA %" radius={[0, 4, 4, 0]} fill={CHART_THEME.sla}>
                  {slaBySite.map((entry) => (
                    <Cell key={entry.site} fill={entry.sla >= entry.target ? CHART_THEME.completed : CHART_THEME.opened} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="ops-pulse-panel" aria-labelledby="backlog-title">
          <header className="ops-pulse-panel__header">
            <h3 id="backlog-title" className="ops-pulse-panel__title">
              Open backlog trend
            </h3>
            <p className="ops-pulse-panel__subtitle">Six-week rolling count</p>
          </header>
          <div className="ops-pulse-panel__chart" role="img" aria-label="Area chart of open work order backlog by week">
            <ResponsiveContainer width="100%" height={PANEL_CHART_HEIGHT}>
              <AreaChart data={backlogTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="backlogFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_THEME.backlog} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={CHART_THEME.backlog} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={CHART_THEME.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: CHART_THEME.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: CHART_THEME.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="backlog" name="Open backlog" stroke={CHART_THEME.backlog} fill="url(#backlogFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="ops-pulse-panel" aria-labelledby="category-title">
          <header className="ops-pulse-panel__header">
            <h3 id="category-title" className="ops-pulse-panel__title">
              Open orders by category
            </h3>
            <p className="ops-pulse-panel__subtitle">Current snapshot</p>
          </header>
          <div className="ops-pulse-panel__chart ops-pulse-panel__chart--pie" role="img" aria-label="Pie chart of open work orders by category">
            <ResponsiveContainer width="100%" height={PANEL_CHART_HEIGHT}>
              <PieChart>
                <Pie
                  data={categoryMix}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={2}
                >
                  {categoryMix.map((entry) => (
                    <Cell key={entry.category} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#a1a1aa' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="ops-pulse-panel" aria-labelledby="spend-site-title">
          <header className="ops-pulse-panel__header">
            <h3 id="spend-site-title" className="ops-pulse-panel__title">
              Repair spend by site
            </h3>
            <p className="ops-pulse-panel__subtitle">Month to date · thousands USD</p>
          </header>
          <div className="ops-pulse-panel__chart" role="img" aria-label="Bar chart of repair spend by site">
            <ResponsiveContainer width="100%" height={PANEL_CHART_HEIGHT}>
              <BarChart data={repairSpendBySite} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke={CHART_THEME.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="site" tick={{ fill: CHART_THEME.axis, fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={-18} textAnchor="end" height={52} />
                <YAxis tick={{ fill: CHART_THEME.axis, fontSize: 11 }} axisLine={false} tickLine={false} unit="K" />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`$${value}K`, 'Spend']} />
                <Bar dataKey="spend" name="Spend" fill={CHART_THEME.spend} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  )
}
