import DataslateTextSection from './DataslateTextSection'

export default function AbilitiesList({ abilities, compact = false }) {
  return (
    <DataslateTextSection
      content={abilities}
      parseNamedEntries
      compact={compact}
    />
  )
}
