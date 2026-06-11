/** Map button label → icon key (phrase rules, then first word, then neutral fallback). */
export function resolveIconKey(label) {
  const text = String(label ?? '').trim()
  if (!text) return 'more'

  const lower = text.toLowerCase()
  const first = text.split(/\s+/)[0]?.replace(/[^a-zA-Z]/g, '').toLowerCase() ?? ''

  if (first === 'saving') return 'save'
  if (first === 'uploading') return 'upload'
  if (first === 'creating') return 'add'
  if (first === 'cloning') return 'clone'
  if (first === 'deleting') return 'delete'

  if (text === 'POs' || first === 'pos') return 'users'
  if (text === 'NPOs' || first === 'npos') return 'users'

  const phraseRules = [
    [/\bmenu\b|\bnavigation\b/, 'menu'],
    [/\bportfolio\b/i, 'portfolio'],
    [/expand\s*navigation/, 'expand'],
    [/collapse\s*navigation/, 'collapse'],
    [/\bclose\b/, 'close'],
    [/\bdataslate\b/, 'dataslate'],
    [/weapon\s*profile|\bprofile\b/, 'profile'],
    [/\bdetails\b/, 'details'],
    [/sign\s*out/, 'signout'],
    [/sign\s*in/, 'signin'],
    [/\bopen\b/, 'open'],
    [/clone/, 'clone'],
    [/download/, 'download'],
    [/complete/, 'done'],
    [/restart|revert/, 'revert'],
    [/kill\s*teams?/, 'teams'],
    [/joint[\s-]*op/, 'hostile'],
    [/\bequipment\b/, 'equipment'],
    [/\bweapons?\b/, 'weapon'],
    [/operative/, 'user'],
    [/replace/, 'replace'],
    [/remove|delete/, 'delete'],
    [/save/, 'save'],
    [/upload/, 'upload'],
    [/send|message/, 'send'],
    [/add|new\b/, 'add'],
    [/edit/, 'edit'],
    [/\bdone\b/, 'done'],
    [/image/, 'upload'],
    [/google/, 'signin'],
    [/\bcampaign\s+lore\b|\blore\b/i, 'lore'],
    [/\bcampaign\s+hub\b/i, 'campaign'],
    [/data\s*registry|\bkt24\b|\blog\s*book\b/i, 'logbook'],
    [/\bparty\b/i, 'party'],
  ]

  for (const [pattern, key] of phraseRules) {
    if (pattern.test(lower)) return key
  }

  const firstWordMap = {
    save: 'save',
    add: 'add',
    delete: 'delete',
    remove: 'delete',
    revert: 'revert',
    edit: 'edit',
    done: 'done',
    clone: 'clone',
    upload: 'upload',
    replace: 'replace',
    new: 'add',
    send: 'send',
    open: 'open',
    close: 'close',
    download: 'download',
    equipment: 'equipment',
    weapons: 'weapon',
    weapon: 'weapon',
    operatives: 'user',
    operative: 'user',
    kill: 'teams',
    joint: 'hostile',
    dataslate: 'dataslate',
    profile: 'profile',
    details: 'details',
    campaign: 'campaign',
    lore: 'lore',
    logbook: 'logbook',
    party: 'party',
  }

  return firstWordMap[first] ?? 'more'
}

function IconBase({ className, children }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const icons = {
  save: (className) => (
    <IconBase className={className}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </IconBase>
  ),
  add: (className) => (
    <IconBase className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </IconBase>
  ),
  delete: (className) => (
    <IconBase className={className}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </IconBase>
  ),
  remove: (className) => icons.delete(className),
  revert: (className) => (
    <IconBase className={className}>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </IconBase>
  ),
  edit: (className) => (
    <IconBase className={className}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </IconBase>
  ),
  done: (className) => (
    <IconBase className={className}>
      <polyline points="20 6 9 17 4 12" />
    </IconBase>
  ),
  clone: (className) => (
    <IconBase className={className}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </IconBase>
  ),
  upload: (className) => (
    <IconBase className={className}>
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </IconBase>
  ),
  replace: (className) => (
    <IconBase className={className}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </IconBase>
  ),
  new: (className) => icons.add(className),
  signin: (className) => (
    <IconBase className={className}>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </IconBase>
  ),
  signout: (className) => (
    <IconBase className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </IconBase>
  ),
  send: (className) => (
    <IconBase className={className}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </IconBase>
  ),
  download: (className) => (
    <IconBase className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </IconBase>
  ),
  users: (className) => (
    <IconBase className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconBase>
  ),
  user: (className) => (
    <IconBase className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </IconBase>
  ),
  menu: (className) => (
    <IconBase className={className}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </IconBase>
  ),
  collapse: (className) => (
    <IconBase className={className}>
      <polyline points="15 18 9 12 15 6" />
      <line x1="9" y1="12" x2="21" y2="12" />
    </IconBase>
  ),
  expand: (className) => (
    <IconBase className={className}>
      <polyline points="9 18 15 12 9 6" />
      <line x1="3" y1="12" x2="15" y2="12" />
    </IconBase>
  ),
  portfolio: (className) => (
    <IconBase className={className}>
      <path d="M2.5 6.5 8 2.5l5.5 4v7H2.5v-7Z" strokeLinejoin="round" />
      <path d="M6.5 13.5v-4h3v4" strokeLinejoin="round" />
    </IconBase>
  ),
  close: (className) => (
    <IconBase className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </IconBase>
  ),
  open: (className) => (
    <IconBase className={className}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </IconBase>
  ),
  dataslate: (className) => (
    <IconBase className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </IconBase>
  ),
  profile: (className) => (
    <IconBase className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <line x1="22" y1="12" x2="18" y2="12" />
      <line x1="6" y1="12" x2="2" y2="12" />
      <line x1="12" y1="6" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="18" />
    </IconBase>
  ),
  details: (className) => (
    <IconBase className={className}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </IconBase>
  ),
  teams: (className) => (
    <IconBase className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconBase>
  ),
  hostile: (className) => (
    <IconBase className={className}>
      <path d="M12 3c-3.5 0-6 2.5-6 6 0 2.2 1.2 4.1 3 5.2V17h6v-2.8c1.8-1.1 3-3 3-5.2 0-3.5-2.5-6-6-6z" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
      <path d="M9 13h6" />
      <line x1="10" y1="17" x2="10" y2="21" />
      <line x1="14" y1="17" x2="14" y2="21" />
    </IconBase>
  ),
  weapon: (className) => (
    <IconBase className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="22" y1="12" x2="18" y2="12" />
      <line x1="6" y1="12" x2="2" y2="12" />
      <line x1="12" y1="6" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="18" />
    </IconBase>
  ),
  equipment: (className) => (
    <IconBase className={className}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </IconBase>
  ),
  campaign: (className) => (
    <IconBase className={className}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </IconBase>
  ),
  lore: (className) => (
    <IconBase className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="12" y1="6" x2="12" y2="16" />
    </IconBase>
  ),
  logbook: (className) => (
    <IconBase className={className}>
      <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z" />
      <path d="M8 3v18" />
      <line x1="11" y1="8" x2="18" y2="8" />
      <line x1="11" y1="12" x2="18" y2="12" />
      <line x1="11" y1="16" x2="15" y2="16" />
    </IconBase>
  ),
  party: (className) => (
    <IconBase className={className}>
      <circle cx="12" cy="6" r="2.25" />
      <path d="M7.25 21v-4.25a4.75 4.75 0 0 1 9.5 0V21" />
      <circle cx="6" cy="11.5" r="1.85" />
      <path d="M3.25 21v-3.25a2.75 2.75 0 0 1 5.5 0" />
      <circle cx="18" cy="11.5" r="1.85" />
      <path d="M15.25 21v-3.25a2.75 2.75 0 0 1 5.5 0" />
    </IconBase>
  ),
  more: (className) => (
    <IconBase className={className}>
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
    </IconBase>
  ),
}

export function ButtonIcon({ label, icon, className = 'h-4 w-4 shrink-0' }) {
  const key = icon ?? resolveIconKey(label)
  const render = icons[key] ?? icons.more
  return render(className)
}
