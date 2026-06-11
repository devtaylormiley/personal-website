import WeaponRulesChips from '../WeaponRulesChips'
import {
  OperativeCardTableColgroup,
  operativeCardTableAlignedClass,
} from '../operativeCard/operativeCardTableColumns'

const weaponTableClass = `${operativeCardTableAlignedClass} bf-weapon-dataslate-table text-xs`

export function WeaponProfileColumnsHead() {
  return (
    <div className="bf-weapon-dataslate bf-weapon-dataslate-columns-head overflow-x-auto">
      <table className={weaponTableClass}>
        <OperativeCardTableColgroup />
        <thead>
          <tr className="operative-card-table-head border-b border-[var(--bf-border)]">
            <th className="px-3 py-2">Weapon</th>
            <th className="px-2 py-2 operative-card-col-stat-cell">ATK</th>
            <th className="px-2 py-2 operative-card-col-stat-cell">HIT</th>
            <th className="px-2 py-2 operative-card-col-stat-cell">DMG</th>
            <th className="px-2 py-2">Rules</th>
          </tr>
        </thead>
      </table>
    </div>
  )
}

export default function WeaponProfilePanel({ weapon, showHeader = false }) {
  if (!weapon) return null

  return (
    <article className="bf-weapon-dataslate">
      <div className="overflow-x-auto">
        <table className={weaponTableClass}>
          <OperativeCardTableColgroup />
          {showHeader ? (
            <thead>
              <tr className="operative-card-table-head border-b border-[var(--bf-border)]">
                <th className="px-3 py-2">Weapon</th>
                <th className="px-2 py-2 operative-card-col-stat-cell">ATK</th>
                <th className="px-2 py-2 operative-card-col-stat-cell">HIT</th>
                <th className="px-2 py-2 operative-card-col-stat-cell">DMG</th>
                <th className="px-2 py-2">Rules</th>
              </tr>
            </thead>
          ) : null}
          <tbody>
            <tr>
              <td className="px-3 py-2.5 font-medium text-[var(--bf-text-bright)]">{weapon.name}</td>
              <td className="px-2 py-2.5 text-[var(--bf-field)] operative-card-col-stat-cell">
                {weapon.atk}
              </td>
              <td className="px-2 py-2.5 text-[var(--bf-field)] operative-card-col-stat-cell">
                {weapon.hit}
              </td>
              <td className="px-2 py-2.5 text-[var(--bf-field)] operative-card-col-stat-cell">
                {weapon.dmg}
              </td>
              <td className="px-2 py-2.5">
                <WeaponRulesChips rules={weapon.rules} ruleKeyPrefix={weapon.name} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  )
}
