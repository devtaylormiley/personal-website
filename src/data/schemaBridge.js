export const schemaBridge = {
  title: 'Schema Bridge',
  subtitle: 'Human-in-the-loop data migration',
  intro:
    'Three legacy systems exported work orders with different column names and messy notes. A Python pipeline maps them into one schema; uncertain rows land in the review workbench below.',
  sections: {
    migration: {
      title: 'How the migration works',
      body:
        'Legacy CSVs are extracted, mapped with rules and AI-assisted semantics, validated against a Pydantic schema, then split into auto-accepted records and a human review queue.',
    },
    schemaUi: {
      title: 'How the schema powers the review form',
      body:
        'The target work-order schema defines every field, type, and allowed enum. Each review-queue row ships a `suggested` object already shaped to that schema, plus `decisions` that explain what the AI changed. The workbench does not hard-code forms per source system—it reads the schema-shaped payload and renders the right inputs in minutes.',
    },
  },
  pipelineSteps: [
    { id: 'extract', title: 'Extract', detail: 'Read legacy CSV exports.' },
    { id: 'map', title: 'Map', detail: 'Rules for columns; AI for status and prose.' },
    { id: 'validate', title: 'Validate', detail: 'Schema check; low confidence → review queue.' },
    { id: 'load', title: 'Load', detail: 'Emit work orders, queue, and manifest JSON.' },
  ],
  targetSchemaFields: [
    { name: 'id', type: 'string', note: 'Normalized WO-#####' },
    { name: 'asset', type: 'string', note: 'Equipment identifier' },
    { name: 'site', type: 'string | null', note: 'Facility or plant' },
    { name: 'status', type: 'enum', note: 'Ready · In progress · Blocked · Closed' },
    { name: 'category', type: 'enum', note: 'Mechanical · Electrical · Safety · …' },
    { name: 'owner', type: 'string | null', note: 'Assigned technician' },
    { name: 'priority', type: 'enum', note: 'Critical · High · Medium · Low' },
    { name: 'price', type: 'number | null', note: 'Estimate or cost' },
    { name: 'updated', type: 'date', note: 'ISO last-modified' },
  ],
  focusTags: [
    'Human-in-the-loop',
    'Python',
    'Pydantic',
    'Hybrid ETL',
    'AI-assisted mapping',
    'Review queue',
  ],
  featuredExampleId: 'prose-pump-seal',
  repoPath: 'python/schema_bridge/',
  cliCommand: 'python -m schema_bridge migrate',
}
