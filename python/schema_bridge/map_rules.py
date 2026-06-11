from __future__ import annotations

import re
from datetime import datetime

COLUMN_ALIASES: dict[str, str] = {
    "wo #": "id",
    "workorderid": "id",
    "order_num": "id",
    "asset tag": "asset",
    "equipment_id": "asset",
    "asset_code": "asset",
    "location": "site",
    "facility": "site",
    "site_name": "site",
    "state": "status",
    "status_code": "status",
    "wo_status": "status",
    "assigned to": "owner",
    "tech_name": "owner",
    "owner_initials": "owner",
    "urgency": "priority",
    "priority_level": "priority",
    "prio": "priority",
    "cost": "price",
    "estimate": "price",
    "amount": "price",
    "last modified": "updated",
    "date_updated": "updated",
    "modified_on": "updated",
    "notes": "category",
    "work_description": "category",
    "comments": "category",
}

OWNER_INITIALS = {
    "JR": "J. Rivera",
    "SC": "S. Chen",
    "MO": "M. Okonkwo",
    "LK": "L. Kim",
    "TN": "T. Nguyen",
    "AP": "A. Patel",
    "KW": "K. Walsh",
}

RULE_STATUS_MAP = {
    "ready": "Ready",
    "open": "Ready",
    "new": "Ready",
    "in progress": "In progress",
    "in_progress": "In progress",
    "in prog": "In progress",
    "wip": "In progress",
    "active": "In progress",
    "blocked": "Blocked",
    "on_hold": "Blocked",
    "on hold": "Blocked",
    "closed": "Closed",
    "complete": "Closed",
    "completed": "Closed",
    "done": "Closed",
}

RULE_PRIORITY_MAP = {
    "critical": "Critical",
    "high": "High",
    "medium": "Medium",
    "med": "Medium",
    "low": "Low",
}


def normalize_column_name(name: str) -> str:
    return name.strip().lower()


def parse_currency(value: str | None) -> float | None:
    if value is None:
        return None
    cleaned = re.sub(r"[^\d.\-]", "", str(value).replace(",", ""))
    if not cleaned:
        return None
    return float(cleaned)


def parse_date(value: str | None) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    formats = ("%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y", "%d.%m.%Y")
    for fmt in formats:
        try:
            return datetime.strptime(text, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None


def normalize_id(value: str | None) -> str | None:
    if value is None:
        return None
    text = str(value).strip().upper()
    if text.startswith("WO-"):
        return text
    digits = "".join(ch for ch in text if ch.isdigit())
    return f"WO-{digits}" if digits else text


def normalize_owner(value: str | None) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    upper = text.upper()
    if upper in OWNER_INITIALS:
        return OWNER_INITIALS[upper]
    if len(text) <= 3 and "." not in text:
        return OWNER_INITIALS.get(upper, text)
    return text


def normalize_status_rule(value: str | None) -> str | None:
    if value is None:
        return None
    key = str(value).strip().lower().replace("-", " ")
    return RULE_STATUS_MAP.get(key.replace(" ", "_")) or RULE_STATUS_MAP.get(key)


def normalize_priority_rule(value: str | None) -> str | None:
    if value is None:
        return None
    return RULE_PRIORITY_MAP.get(str(value).strip().lower())


def map_row_columns(raw: dict[str, str | None]) -> dict[str, str | None]:
    mapped: dict[str, str | None] = {}
    for column, value in raw.items():
        target = COLUMN_ALIASES.get(normalize_column_name(column))
        if target:
            mapped[target] = value
    return mapped


def apply_rule_transforms(mapped: dict[str, str | None]) -> dict[str, str | float | None]:
    return {
        "id": normalize_id(mapped.get("id")),
        "asset": mapped.get("asset"),
        "site": mapped.get("site") or None,
        "status": normalize_status_rule(mapped.get("status")),
        "owner": normalize_owner(mapped.get("owner")),
        "priority": normalize_priority_rule(mapped.get("priority")),
        "price": parse_currency(mapped.get("price")),
        "updated": parse_date(mapped.get("updated")),
        "category": mapped.get("category"),
    }
