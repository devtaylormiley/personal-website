from __future__ import annotations

import json
import time
from pathlib import Path

from schema_bridge.extract import SOURCE_FILES, extract_legacy_rows
from schema_bridge.map_rules import apply_rule_transforms, map_row_columns
from schema_bridge.map_semantic import apply_semantic_mapping, load_json
from schema_bridge.models import MigrationManifest, ReviewQueueItem, WorkOrder
from schema_bridge.validate import find_duplicate_candidates, validate_mapped_record


def repo_public_output_dir() -> Path:
    return Path(__file__).resolve().parents[2] / "public" / "data" / "schema-bridge"


def run_migration(sources_dir: Path | None = None, output_dir: Path | None = None) -> MigrationManifest:
    started = time.perf_counter()
    out = output_dir or repo_public_output_dir()
    out.mkdir(parents=True, exist_ok=True)

    legacy_rows = extract_legacy_rows(sources_dir)
    accepted: list[WorkOrder] = []
    review_queue: list[ReviewQueueItem] = []
    rejected = 0
    ai_assisted = 0
    rule_mappings = 0
    fuzzy_mappings = 0
    field_inferences: list[dict] = []
    status_normalizations: list[dict] = []

    field_map = load_json("field_map.json")
    for entry in field_map["column_mappings"]:
        if entry["method"] == "ai":
            field_inferences.append(entry)
        elif entry["method"] == "rule":
            rule_mappings += 1

    status_map = load_json("status_map.json")
    for raw, entry in status_map.items():
        if entry["method"] == "ai":
            status_normalizations.append({"raw": raw, **entry})

    for row in legacy_rows:
        column_mapped = map_row_columns(row.raw)
        rule_mapped = apply_rule_transforms(column_mapped)
        semantic = apply_semantic_mapping(row, rule_mapped)
        for decision in semantic.decisions:
            if decision.method == "ai":
                ai_assisted += 1
            elif decision.method == "rule":
                rule_mappings += 1
            elif decision.method == "fuzzy":
                fuzzy_mappings += 1

        work_order, review_item = validate_mapped_record(semantic)
        if work_order:
            accepted.append(work_order)
        elif review_item:
            review_queue.append(review_item)
        else:
            rejected += 1

    deduped: dict[str, WorkOrder] = {}
    for order in accepted:
        existing = deduped.get(order.id)
        if existing is None or order.updated >= existing.updated:
            deduped[order.id] = order

    final_orders = sorted(deduped.values(), key=lambda item: item.id)
    duplicate_candidates = find_duplicate_candidates(final_orders, review_queue)

    runtime_ms = int((time.perf_counter() - started) * 1000)
    manifest = MigrationManifest(
        sources=list(SOURCE_FILES.keys()),
        rows_in=len(legacy_rows),
        rows_accepted=len(final_orders),
        rows_review=len(review_queue),
        rows_rejected=rejected,
        ai_assisted_mappings=ai_assisted,
        rule_mappings=rule_mappings,
        fuzzy_mappings=fuzzy_mappings,
        field_inferences=field_inferences,
        status_normalizations=status_normalizations,
        duplicate_candidates=duplicate_candidates,
        runtime_ms=runtime_ms,
    )

    (out / "work_orders.json").write_text(
        json.dumps([order.model_dump() for order in final_orders], indent=2),
        encoding="utf-8",
    )
    (out / "review_queue.json").write_text(
        json.dumps([item.model_dump() for item in review_queue], indent=2),
        encoding="utf-8",
    )
    (out / "manifest.json").write_text(
        json.dumps(manifest.model_dump(), indent=2),
        encoding="utf-8",
    )

    return manifest
