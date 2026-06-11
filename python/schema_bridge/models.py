from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator

CANONICAL_STATUSES = frozenset({"Ready", "In progress", "Blocked", "Closed"})
CANONICAL_PRIORITIES = frozenset({"Critical", "High", "Medium", "Low"})
CANONICAL_CATEGORIES = frozenset(
    {"Mechanical", "Electrical", "Safety", "HVAC", "Fleet", "Plumbing"}
)


class WorkOrder(BaseModel):
    id: str
    asset: str
    site: str | None = None
    status: Literal["Ready", "In progress", "Blocked", "Closed"]
    owner: str | None = None
    priority: Literal["Critical", "High", "Medium", "Low"]
    price: float | None = None
    updated: str
    category: str

    @field_validator("id")
    @classmethod
    def normalize_id(cls, value: str) -> str:
        cleaned = value.strip().upper()
        if not cleaned.startswith("WO-"):
            digits = "".join(ch for ch in cleaned if ch.isdigit())
            if digits:
                return f"WO-{digits}"
        return cleaned


class LegacyRow(BaseModel):
    source: str
    row_index: int
    raw: dict[str, Any]


class MappingDecision(BaseModel):
    field: str
    source_value: str | None = None
    target_value: str | None = None
    confidence: float = Field(ge=0.0, le=1.0)
    method: Literal["rule", "ai", "fuzzy"]
    reason: str = ""


class MappedRecord(BaseModel):
    source: str
    row_index: int
    legacy: dict[str, Any]
    mapped: dict[str, Any]
    decisions: list[MappingDecision] = Field(default_factory=list)
    confidence: float = 1.0
    needs_review: bool = False
    review_reason: str | None = None


class ReviewQueueItem(BaseModel):
    source: str
    row_index: int
    legacy: dict[str, Any]
    suggested: dict[str, Any]
    confidence: float
    reason: str
    decisions: list[MappingDecision] = Field(default_factory=list)


class MigrationManifest(BaseModel):
    version: str = "1.0"
    sources: list[str]
    rows_in: int
    rows_accepted: int
    rows_review: int
    rows_rejected: int
    ai_assisted_mappings: int
    rule_mappings: int
    fuzzy_mappings: int
    field_inferences: list[dict[str, Any]]
    status_normalizations: list[dict[str, Any]]
    duplicate_candidates: list[dict[str, Any]]
    runtime_ms: int
