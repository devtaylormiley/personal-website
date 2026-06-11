from __future__ import annotations

import json
from pathlib import Path

from schema_bridge.map_rules import normalize_status_rule
from schema_bridge.models import LegacyRow, MappedRecord, MappingDecision


def decisions_dir() -> Path:
    return Path(__file__).resolve().parent / "decisions"


def load_json(name: str) -> dict:
    path = decisions_dir() / name
    return json.loads(path.read_text(encoding="utf-8"))


def apply_status_semantics(
    raw_status: str | None,
    mapped_status: str | None,
) -> tuple[str | None, MappingDecision | None]:
    if mapped_status:
        return mapped_status, None
    if raw_status is None:
        return None, None

    status_map = load_json("status_map.json")
    entry = status_map.get(raw_status.strip()) or status_map.get(raw_status.strip().upper())
    if entry:
        decision = MappingDecision(
            field="status",
            source_value=raw_status,
            target_value=entry["canonical"],
            confidence=entry["confidence"],
            method=entry["method"],
            reason=entry.get("reason", ""),
        )
        return entry["canonical"], decision

    rule = normalize_status_rule(raw_status)
    if rule:
        return rule, MappingDecision(
            field="status",
            source_value=raw_status,
            target_value=rule,
            confidence=1.0,
            method="rule",
            reason="Fallback rule normalization",
        )
    return None, None


def infer_category_from_prose(text: str | None) -> tuple[str | None, str | None, MappingDecision | None]:
    if not text:
        return None, None, None

    data = load_json("prose_extractions.json")
    lowered = text.lower()
    for entry in data["extractions"]:
        needle = entry["match_contains"].lower()
        if needle in lowered:
            category = entry.get("category")
            site = entry.get("site")
            decision = MappingDecision(
                field="category" if category else "notes",
                source_value=text,
                target_value=category or site,
                confidence=entry["confidence"],
                method=entry["method"],
                reason=entry.get("reason", ""),
            )
            return category, site, decision
    return None, None, None


def refine_category_value(value: str | None) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    lowered = text.lower()
    keyword_map = {
        "mechanical": "Mechanical",
        "electrical": "Electrical",
        "safety": "Safety",
        "hvac": "HVAC",
        "fleet": "Fleet",
        "plumbing": "Plumbing",
        "forklift": "Fleet",
        "truck": "Fleet",
    }
    for keyword, category in keyword_map.items():
        if keyword in lowered:
            return category
    for prefix in ("Mechanical", "Electrical", "Safety", "HVAC", "Fleet", "Plumbing"):
        if text.lower().startswith(prefix.lower()):
            return prefix
    return text.split(" - ")[0].split(",")[0].strip() or None


def apply_semantic_mapping(row: LegacyRow, mapped: dict) -> MappedRecord:
    decisions: list[MappingDecision] = []
    raw = row.raw

    raw_status = None
    for key in raw:
        if key.lower() in {"state", "status_code", "wo_status"}:
            raw_status = raw[key]
            break

    status, status_decision = apply_status_semantics(raw_status, mapped.get("status"))
    if status_decision:
        decisions.append(status_decision)
    if status:
        mapped["status"] = status

    prose_source = mapped.get("category")
    category, site_from_prose, prose_decision = infer_category_from_prose(prose_source)
    if prose_decision:
        decisions.append(prose_decision)
    if category:
        mapped["category"] = category
    elif mapped.get("category"):
        refined = refine_category_value(str(mapped["category"]))
        if refined and "duplicate" not in refined.lower():
            mapped["category"] = refined
        else:
            mapped["category"] = None
    if site_from_prose and not mapped.get("site"):
        mapped["site"] = site_from_prose
        decisions.append(
            MappingDecision(
                field="site",
                source_value=prose_source,
                target_value=site_from_prose,
                confidence=prose_decision.confidence if prose_decision else 0.8,
                method="ai",
                reason="Site inferred from prose notes",
            )
        )

    confidence = 1.0
    if decisions:
        confidence = min(decision.confidence for decision in decisions)

    needs_review = confidence < 0.85 or any(
        decision.method == "ai" and decision.confidence < 0.9 for decision in decisions
    )
    review_reason = None
    if needs_review:
        review_reason = "Low-confidence semantic mapping"

    return MappedRecord(
        source=row.source,
        row_index=row.row_index,
        legacy=raw,
        mapped=mapped,
        decisions=decisions,
        confidence=confidence,
        needs_review=needs_review,
        review_reason=review_reason,
    )
