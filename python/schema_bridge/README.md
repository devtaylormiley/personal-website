# Schema Bridge

Hybrid Python ETL pipeline for the portfolio **Schema Bridge** project. Migrates synthetic legacy operations exports into a normalized work-order schema.

## Setup

```bash
cd python
pip install -r requirements.txt
```

Requires Python 3.10+.

## Run migration

From the `python/` directory:

```bash
python -m schema_bridge migrate
```

Or from the repo root:

```bash
npm run migrate:schema-bridge
```

Outputs are written to `public/data/schema-bridge/`:

- `work_orders.json` — validated records
- `review_queue.json` — low-confidence rows for human review
- `manifest.json` — migration metrics and AI decision summary

## Tests

```bash
cd python
python -m pytest schema_bridge/tests -q
```

Golden-file tests lock the accepted work-order output.

## Architecture

1. **Extract** — read legacy CSVs with pandas
2. **Map (rules)** — column aliases, dates, currency, owner initials
3. **Map (semantic)** — cached AI decision logs for status enums and prose extraction
4. **Validate** — Pydantic schema + review queue split
5. **Load** — emit static JSON artifacts for the React showcase

Decision logs live in `schema_bridge/decisions/`. Prompts used to generate them are in `schema_bridge/prompts/`.

## Sample data

Legacy exports in `schema_bridge/samples/legacy/`:

- `crm_export.csv`
- `maintenance_dump.csv`
- `spreadsheet_export.csv`

These are synthetic files for demonstration only.
