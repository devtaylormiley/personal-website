/**
 * Facilities & maintenance operations KPIs — familiar to any ops leader,
 * and aligned with the operations tooling UX case study on this site.
 */
export const opsPulse = {
  title: 'Ops Pulse',
  subtitle: 'Facilities operations · Recharts + agentic development',
  productName: 'Databox',
  productNote:
    'Teams pay $159–$559+/month for wall-mounted KPI dashboards built from the same chart types you get in any BI template — line, bar, area, and stat tiles wired to Salesforce, spreadsheets, or a warehouse.',
  intro: `Maintenance and facilities leaders often buy Databox (or Geckoboard) to put work-order throughput, SLA compliance, and backlog on a TV in the plant office. The product is polished, but you are mostly paying for connectors and layout chrome around charts you can ship yourself.

This demo replaces that subscription with a React dashboard backed by Recharts. The dataset is facilities operations — work orders, sites, categories, and repair cost — so every chart reads clearly without a data dictionary. Built in a weekend with agentic development, the same way Schema Bridge was.`,
  replacementPoints: [
    'Stat tiles, trend lines, site comparisons, and category mix — the core Databox chart set',
    'Facilities maintenance data everyone understands: open vs. completed work, SLA %, backlog, MTTR',
    'Own the code: no per-seat viewer fees, no connector tier upgrades for extra metrics',
    'Agent-generated React + Recharts instead of a drag-and-drop editor you outgrow in quarter two',
  ],
}

export const costComparison = {
  incumbent: {
    label: 'Databox Professional',
    monthly: 319,
    note: '10 connected metrics, 3 users — typical plant ops team',
  },
  replacement: {
    label: 'Self-hosted Ops Pulse',
    monthly: 24,
    note: 'Static hosting + warehouse query — charts you control',
  },
}

export const kpiSummary = [
  {
    id: 'open',
    label: 'Open work orders',
    value: 47,
    delta: -8,
    deltaLabel: 'vs. last month',
    tone: 'amber',
  },
  {
    id: 'sla',
    label: 'SLA compliance',
    value: '94.2%',
    delta: 2.1,
    deltaLabel: 'pts vs. target',
    tone: 'emerald',
  },
  {
    id: 'mttr',
    label: 'Mean time to repair',
    value: '3.8d',
    delta: -0.6,
    deltaLabel: 'days vs. Q1',
    tone: 'violet',
  },
  {
    id: 'cost',
    label: 'Est. repair spend (MTD)',
    value: '$128K',
    delta: 11,
    deltaLabel: '% vs. budget',
    tone: 'rose',
  },
]

export const monthlyWorkOrders = [
  { month: 'Oct', opened: 142, completed: 131 },
  { month: 'Nov', opened: 156, completed: 149 },
  { month: 'Dec', opened: 138, completed: 144 },
  { month: 'Jan', opened: 161, completed: 152 },
  { month: 'Feb', opened: 149, completed: 158 },
  { month: 'Mar', opened: 154, completed: 162 },
  { month: 'Apr', opened: 147, completed: 159 },
]

export const slaBySite = [
  { site: 'North Plant', sla: 96, target: 95 },
  { site: 'South Yard', sla: 91, target: 95 },
  { site: 'East DC', sla: 94, target: 95 },
  { site: 'West Campus', sla: 88, target: 95 },
  { site: 'HQ Tower', sla: 97, target: 95 },
]

export const backlogTrend = [
  { week: 'W1', backlog: 62 },
  { week: 'W2', backlog: 58 },
  { week: 'W3', backlog: 55 },
  { week: 'W4', backlog: 51 },
  { week: 'W5', backlog: 49 },
  { week: 'W6', backlog: 47 },
]

export const categoryMix = [
  { category: 'Mechanical', count: 18, fill: '#8b5cf6' },
  { category: 'Electrical', count: 12, fill: '#14b8a6' },
  { category: 'HVAC', count: 9, fill: '#f59e0b' },
  { category: 'Safety', count: 5, fill: '#f43f5e' },
  { category: 'Plumbing', count: 3, fill: '#6366f1' },
]

/** Repair spend in thousands USD, month to date */
export const repairSpendBySite = [
  { site: 'North Plant', spend: 42 },
  { site: 'South Yard', spend: 28 },
  { site: 'East DC', spend: 31 },
  { site: 'West Campus', spend: 19 },
  { site: 'HQ Tower', spend: 8 },
]

export const CHART_THEME = {
  grid: 'rgb(63 63 70 / 0.5)',
  axis: 'rgb(161 161 170)',
  tooltipBg: 'rgb(24 24 27)',
  tooltipBorder: 'rgb(63 63 70)',
  opened: '#f59e0b',
  completed: '#14b8a6',
  sla: '#8b5cf6',
  target: 'rgb(113 113 122)',
  backlog: '#a78bfa',
  spend: '#f43f5e',
}
