import { splitWeaponRules } from '../../../lib/weaponRules'

export const EMPTY_WEAPON_FILTERS = {
  name: '',
  atk: '',
  hit: '',
  dmg: '',
  rules: [],
}

function matchesText(value, filter) {
  const query = filter.trim().toLowerCase()
  if (!query) return true
  return String(value ?? '').toLowerCase().includes(query)
}

function matchesRules(rulesRaw, selectedRules) {
  if (!selectedRules.length) return true
  const weaponRules = splitWeaponRules(rulesRaw).map((rule) => rule.toLowerCase())
  return selectedRules.some((selected) => weaponRules.includes(selected.toLowerCase()))
}

export function filterWeaponsRows(rows, filters) {
  return rows.filter((row) => {
    if (!matchesText(row.name, filters.name)) return false
    if (!matchesText(row.atk, filters.atk)) return false
    if (!matchesText(row.hit, filters.hit)) return false
    if (!matchesText(row.dmg, filters.dmg)) return false
    if (!matchesRules(row.rules, filters.rules)) return false
    return true
  })
}

export function collectWeaponRuleOptions(weapons) {
  const rules = new Set()
  for (const weapon of weapons) {
    for (const rule of splitWeaponRules(weapon.rules)) {
      rules.add(rule)
    }
  }
  return [...rules].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
}
