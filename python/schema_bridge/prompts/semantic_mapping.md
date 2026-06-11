# Semantic mapping prompts (portfolio reference)

These prompts were used once to generate the committed `decisions/` JSON files.
The static site and CI pipeline read cached decisions — no live LLM calls at runtime.

## Column alias reconciliation

Given CSV headers from three legacy systems (CRM, maintenance CMMS, spreadsheet export),
propose a unified mapping to target fields: id, asset, site, status, owner, priority, price, updated, category.

Return JSON with confidence scores. Flag columns where notes/descriptions mix structured and prose data.

## Status enum normalization

Map raw status strings to canonical values: Ready, In progress, Blocked, Closed.
Prefer rule matches when exact; use semantic reasoning for abbreviations (In Prog, WIP, ACTIVE, ON_HOLD).

## Prose extraction

From free-text notes/comments, extract:
- category (Mechanical, Electrical, Safety, HVAC, Fleet, Plumbing)
- site when embedded in prose (e.g. "North Plant" at end of sentence)

Return confidence; omit fields when ambiguous.
