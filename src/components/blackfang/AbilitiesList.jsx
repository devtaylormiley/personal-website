import OperativeAbilitiesTable from './OperativeAbilitiesTable'

export default function AbilitiesList({ abilities, compact = false, operativeId = 'operative' }) {
  return (
    <OperativeAbilitiesTable
      abilitiesText={abilities}
      operativeId={operativeId}
      compact={compact}
      editable={false}
    />
  )
}
