"""
SurakshaNet AI — Database Models & Engine Factory
==================================================
SQLModel table definitions backed by SQLite.  The database file lives at
``backend/data/suraksha.db`` so that it sits alongside seed-data assets.
"""

from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel, create_engine


# ─── Helpers ─────────────────────────────────────────────────────────────────


def _utc_now_iso() -> str:
    """Return the current UTC time as an ISO-8601 string."""
    return datetime.now(timezone.utc).isoformat()


# ─── Table: Case ─────────────────────────────────────────────────────────────


class Case(SQLModel, table=True):
    """Persisted fraud case created after a detection run."""

    __tablename__ = "case"  # type: ignore[assignment]

    id: Optional[int] = Field(default=None, primary_key=True)
    scenario_id: Optional[str] = Field(
        default=None,
        index=True,
        description="Linked demo-scenario identifier.",
    )
    transcript: str = Field(
        ...,
        description="Full call transcript.",
    )
    risk_score: float = Field(
        ...,
        description="Composite risk score (0–1).",
    )
    risk_category: str = Field(
        ...,
        description="Risk category label.",
    )
    kill_chain_stage: int = Field(
        default=0,
        description="Kill-chain stage at detection.",
    )
    entities_json: str = Field(
        default="{}",
        description="JSON-serialised extracted entities.",
    )
    created_at: str = Field(
        default_factory=_utc_now_iso,
        description="ISO-8601 UTC creation timestamp.",
    )


# ─── Table: Entity ───────────────────────────────────────────────────────────


class Entity(SQLModel, table=True):
    """Known entity (phone number, UPI ID, person …) tracked across cases."""

    __tablename__ = "entity"  # type: ignore[assignment]

    id: Optional[int] = Field(default=None, primary_key=True)
    entity_type: str = Field(
        ...,
        index=True,
        description="Type category — phone / upi / person / account.",
    )
    value: str = Field(
        ...,
        index=True,
        description="Canonical entity value.",
    )
    risk_level: str = Field(
        default="unknown",
        description="Risk classification — unknown / low / medium / high.",
    )
    linked_cases: str = Field(
        default="[]",
        description="JSON array of case IDs this entity appears in.",
    )


# ─── Table: Alert ────────────────────────────────────────────────────────────


class Alert(SQLModel, table=True):
    """Real-time alert generated during detection or post-analysis."""

    __tablename__ = "alert"  # type: ignore[assignment]

    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: int = Field(
        ...,
        index=True,
        description="Owning case ID.",
    )
    alert_type: str = Field(
        ...,
        description="Alert category — high_risk / entity_match / kill_chain_advance.",
    )
    message: str = Field(
        ...,
        description="Human-readable alert message.",
    )
    created_at: str = Field(
        default_factory=_utc_now_iso,
        description="ISO-8601 UTC timestamp.",
    )


# ─── Engine Factory ──────────────────────────────────────────────────────────

_engine = None


def get_engine():
    """
    Return a singleton SQLite engine.

    The database file is placed at ``backend/data/suraksha.db``.  The
    directory is created automatically if it does not exist.
    """
    global _engine
    if _engine is not None:
        return _engine

    # Resolve DB path relative to *this* file → backend/models/../data/
    db_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    db_dir = os.path.abspath(db_dir)
    os.makedirs(db_dir, exist_ok=True)

    db_path = os.path.join(db_dir, "suraksha.db")
    db_url = f"sqlite:///{db_path}"

    _engine = create_engine(
        db_url,
        echo=False,
        connect_args={"check_same_thread": False},
    )
    return _engine


def create_db_and_tables(engine=None):
    """Create all SQLModel tables if they do not already exist."""
    if engine is None:
        engine = get_engine()
    SQLModel.metadata.create_all(engine)
