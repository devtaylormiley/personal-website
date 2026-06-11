from __future__ import annotations

import json
from pathlib import Path

import pytest

from schema_bridge.manifest import run_migration
from schema_bridge.map_rules import (
    normalize_id,
    normalize_owner,
    normalize_priority_rule,
    normalize_status_rule,
    parse_currency,
    parse_date,
)
from schema_bridge.models import WorkOrder


FIXTURES = Path(__file__).resolve().parent / "fixtures"


def test_parse_currency():
    assert parse_currency("$2,847.50") == 2847.50
    assert parse_currency("12990") == 12990.0
    assert parse_currency("") is None


def test_parse_date_formats():
    assert parse_date("2026-05-28") == "2026-05-28"
    assert parse_date("05/28/2026") == "2026-05-28"
    assert parse_date("27/05/2026") == "2026-05-27"
    assert parse_date("28.05.2026") == "2026-05-28"


def test_normalize_id():
    assert normalize_id("10479") == "WO-10479"
    assert normalize_id("WO-10482") == "WO-10482"


def test_normalize_owner_initials():
    assert normalize_owner("JR") == "J. Rivera"
    assert normalize_owner("S. Chen") == "S. Chen"


def test_status_normalization():
    assert normalize_status_rule("In Prog") == "In progress"
    assert normalize_status_rule("WIP") == "In progress"
    assert normalize_status_rule("ON_HOLD") == "Blocked"
    assert normalize_status_rule("DONE") == "Closed"


def test_priority_normalization():
    assert normalize_priority_rule("Med") == "Medium"
    assert normalize_priority_rule("critical") == "Critical"


def test_migration_snapshot(tmp_path: Path):
    output = tmp_path / "out"
    manifest = run_migration(output_dir=output)

    work_orders = json.loads((output / "work_orders.json").read_text(encoding="utf-8"))
    expected_path = FIXTURES / "expected_work_orders.json"

    if not expected_path.exists():
        expected_path.parent.mkdir(parents=True, exist_ok=True)
        expected_path.write_text(json.dumps(work_orders, indent=2), encoding="utf-8")

    expected = json.loads(expected_path.read_text(encoding="utf-8"))
    assert work_orders == expected
    assert manifest.rows_accepted == len(work_orders)
    assert manifest.rows_in >= 60
    assert manifest.ai_assisted_mappings > 0
    assert manifest.rows_review > 0
    assert len(manifest.duplicate_candidates) >= 1

    for record in work_orders:
        WorkOrder.model_validate(record)
