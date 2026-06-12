import { bfToneClass } from '../../lib/blackfangNavigation'
import { getRuleChipTone } from '../../lib/ruleChipTones'
import { describeWeaponRule, splitWeaponRules } from '../../lib/weaponRules'

export default function WeaponRulesChips({
  rules,
  compact = false,
  ruleKeyPrefix = 'weapon',
}) {
  const items = splitWeaponRules(rules)

  if (!items.length) {
    return <span className="bf-muted">—</span>
  }

  return (
    <div className="flex flex-wrap gap-1">
      {items.map((rule, index) => (
        <span
          key={`${ruleKeyPrefix}-${index}-${rule}`}
          title={describeWeaponRule(rule)}
          className={`bf-chip cursor-help ${bfToneClass(getRuleChipTone(rule, index))} ${compact ? 'px-1.5 py-px text-[10px]' : 'px-2 py-0.5 text-xs'}`}
        >
          {rule}
        </span>
      ))}
    </div>
  )
}
