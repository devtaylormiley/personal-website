from __future__ import annotations

from pathlib import Path

import pandas as pd

from schema_bridge.models import LegacyRow

SOURCE_FILES = {
    "crm_export": "crm_export.csv",
    "maintenance_dump": "maintenance_dump.csv",
    "spreadsheet_export": "spreadsheet_export.csv",
}


def default_samples_dir() -> Path:
    return Path(__file__).resolve().parent / "samples" / "legacy"


def extract_legacy_rows(sources_dir: Path | None = None) -> list[LegacyRow]:
    base = sources_dir or default_samples_dir()
    rows: list[LegacyRow] = []

    for source, filename in SOURCE_FILES.items():
        path = base / filename
        frame = pd.read_csv(path, dtype=str, keep_default_na=False)
        for index, record in frame.iterrows():
            raw = {column: (value if value != "" else None) for column, value in record.items()}
            rows.append(LegacyRow(source=source, row_index=int(index), raw=raw))

    return rows
