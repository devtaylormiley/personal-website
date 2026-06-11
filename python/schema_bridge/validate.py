from __future__ import annotations

from rapidfuzz import fuzz

from schema_bridge.models import MappedRecord, ReviewQueueItem, WorkOrder


def validate_mapped_record(record: MappedRecord) -> tuple[WorkOrder | None, ReviewQueueItem | None]:
    try:
        work_order = WorkOrder.model_validate(record.mapped)
    except Exception as exc:
        return None, ReviewQueueItem(
            source=record.source,
            row_index=record.row_index,
            legacy=record.legacy,
            suggested=record.mapped,
            confidence=record.confidence,
            reason=f"Validation failed: {exc}",
            decisions=record.decisions,
        )

    if record.needs_review:
        return None, ReviewQueueItem(
            source=record.source,
            row_index=record.row_index,
            legacy=record.legacy,
            suggested=work_order.model_dump(),
            confidence=record.confidence,
            reason=record.review_reason or "Requires human review",
            decisions=record.decisions,
        )

    return work_order, None


def find_duplicate_candidates(
    work_orders: list[WorkOrder],
    review_items: list[ReviewQueueItem] | None = None,
) -> list[dict]:
    candidates: list[dict] = []
    seen_pairs: set[tuple[str, str]] = set()
    by_asset: dict[str, WorkOrder] = {order.asset: order for order in work_orders}

    if not review_items:
        return candidates

    for item in review_items:
        suggested = item.suggested
        asset = suggested.get("asset")
        order_id = suggested.get("id")
        if not asset or not order_id:
            continue
        existing = by_asset.get(asset)
        if not existing or existing.id == order_id:
            continue
        pair = tuple(sorted([existing.id, order_id]))
        if pair in seen_pairs:
            continue
        seen_pairs.add(pair)
        score = fuzz.token_sort_ratio(existing.id, order_id)
        candidates.append(
            {
                "asset": asset,
                "left_id": existing.id,
                "right_id": order_id,
                "updated": existing.updated,
                "similarity": round(score / 100, 2),
                "reason": "Possible duplicate work order for same asset",
            }
        )
    return candidates
