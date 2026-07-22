"""
SurakshaNet AI — Cases & Alerts Router
=======================================
CRUD endpoints for fraud cases, evidence packets, and real-time alerts.
"""

from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select

from backend.models.database import Alert, Case, Entity, get_engine
from backend.models.schemas import (
    AlertData,
    CaseCreate,
    CaseDetail,
    CaseResponse,
    EvidencePacket,
)

logger = logging.getLogger("suraksha.cases")

router = APIRouter(prefix="/api", tags=["Cases & Alerts"])

# ─── Kill-chain stage metadata ───────────────────────────────────────────────

KILL_CHAIN_STAGES = {
    0: {"name": "No Threat", "description": "No scam indicators detected."},
    1: {"name": "Initial Contact", "description": "Unsolicited contact established."},
    2: {"name": "Authority Impersonation", "description": "Caller claims official identity."},
    3: {"name": "Fear Induction", "description": "Victim placed under psychological pressure."},
    4: {"name": "Isolation", "description": "Victim cut off from support network."},
    5: {"name": "Fund Extraction", "description": "Attempt to extract money or credentials."},
}


# ─── GET /api/cases ──────────────────────────────────────────────────────────


@router.get(
    "/cases",
    response_model=list[CaseResponse],
    summary="List all fraud cases",
)
async def list_cases() -> list[CaseResponse]:
    """Return every persisted case ordered by creation time (newest first)."""
    engine = get_engine()
    with Session(engine) as session:
        statement = select(Case).order_by(Case.created_at.desc())  # type: ignore[union-attr]
        cases = session.exec(statement).all()

    return [
        CaseResponse(
            id=c.id,  # type: ignore[arg-type]
            scenario_id=c.scenario_id,
            transcript=c.transcript,
            risk_score=c.risk_score,
            risk_category=c.risk_category,
            kill_chain_stage=c.kill_chain_stage,
            created_at=c.created_at,
        )
        for c in cases
    ]


# ─── GET /api/cases/{case_id} ────────────────────────────────────────────────


@router.get(
    "/cases/{case_id}",
    response_model=CaseDetail,
    summary="Get case details with related alerts",
)
async def get_case(case_id: int) -> CaseDetail:
    """Retrieve a single case by ID, enriched with its alerts."""
    engine = get_engine()
    with Session(engine) as session:
        case = session.get(Case, case_id)
        if case is None:
            raise HTTPException(status_code=404, detail=f"Case {case_id} not found.")

        # Fetch related alerts
        alert_stmt = select(Alert).where(Alert.case_id == case_id)
        alerts = session.exec(alert_stmt).all()

    alert_data = [
        AlertData(
            id=a.id,  # type: ignore[arg-type]
            case_id=a.case_id,
            alert_type=a.alert_type,
            message=a.message,
            created_at=a.created_at,
        )
        for a in alerts
    ]

    return CaseDetail(
        id=case.id,  # type: ignore[arg-type]
        scenario_id=case.scenario_id,
        transcript=case.transcript,
        risk_score=case.risk_score,
        risk_category=case.risk_category,
        kill_chain_stage=case.kill_chain_stage,
        created_at=case.created_at,
        entities_json=case.entities_json,
        alerts=alert_data,
    )


# ─── POST /api/cases ─────────────────────────────────────────────────────────


@router.post(
    "/cases",
    response_model=CaseResponse,
    status_code=201,
    summary="Create a new fraud case",
)
async def create_case(body: CaseCreate) -> CaseResponse:
    """Persist a new fraud case and auto-generate alerts if warranted."""
    engine = get_engine()
    case = Case(
        scenario_id=body.scenario_id,
        transcript=body.transcript,
        risk_score=body.risk_score,
        risk_category=body.risk_category,
        kill_chain_stage=body.kill_chain_stage,
        entities_json=body.entities_json,
    )

    with Session(engine) as session:
        session.add(case)
        session.commit()
        session.refresh(case)

        # ── Auto-generate alerts based on risk thresholds ──
        generated_alerts: list[Alert] = []

        if body.risk_score >= 0.8:
            generated_alerts.append(
                Alert(
                    case_id=case.id,  # type: ignore[arg-type]
                    alert_type="high_risk",
                    message=f"Critical risk detected (score: {body.risk_score:.2f}). Immediate review recommended.",
                )
            )

        if body.kill_chain_stage >= 4:
            generated_alerts.append(
                Alert(
                    case_id=case.id,  # type: ignore[arg-type]
                    alert_type="kill_chain_advance",
                    message=f"Kill-chain stage {body.kill_chain_stage} reached — possible fund extraction imminent.",
                )
            )

        # Check for known bad entities
        try:
            entities: dict[str, Any] = json.loads(body.entities_json)
            for etype, values in entities.items():
                if isinstance(values, list):
                    for val in values:
                        stmt = select(Entity).where(
                            Entity.entity_type == etype,
                            Entity.value == val,
                            Entity.risk_level == "high",
                        )
                        match = session.exec(stmt).first()
                        if match:
                            generated_alerts.append(
                                Alert(
                                    case_id=case.id,  # type: ignore[arg-type]
                                    alert_type="entity_match",
                                    message=f"Known high-risk {etype} detected: {val}",
                                )
                            )
        except (json.JSONDecodeError, TypeError):
            logger.warning("Failed to parse entities_json for alert generation")

        for alert in generated_alerts:
            session.add(alert)

        if generated_alerts:
            session.commit()

    logger.info("Case %s created (risk=%.2f, stage=%d, alerts=%d)",
                case.id, body.risk_score, body.kill_chain_stage, len(generated_alerts))

    return CaseResponse(
        id=case.id,  # type: ignore[arg-type]
        scenario_id=case.scenario_id,
        transcript=case.transcript,
        risk_score=case.risk_score,
        risk_category=case.risk_category,
        kill_chain_stage=case.kill_chain_stage,
        created_at=case.created_at,
    )


# ─── GET /api/cases/{case_id}/evidence ────────────────────────────────────────


@router.get(
    "/cases/{case_id}/evidence",
    response_model=EvidencePacket,
    summary="Generate an evidence packet for law enforcement",
)
async def get_evidence_packet(case_id: int) -> EvidencePacket:
    """
    Assemble a structured evidence bundle from the persisted case data,
    suitable for hand-off to law enforcement or internal review.
    """
    engine = get_engine()
    with Session(engine) as session:
        case = session.get(Case, case_id)
        if case is None:
            raise HTTPException(status_code=404, detail=f"Case {case_id} not found.")

        # Fetch related alerts for timeline
        alert_stmt = select(Alert).where(Alert.case_id == case_id).order_by(Alert.created_at)
        alerts = session.exec(alert_stmt).all()

    # Parse entities
    try:
        entities = json.loads(case.entities_json)
    except (json.JSONDecodeError, TypeError):
        entities = {}

    # Build timeline from alerts
    timeline = [
        {
            "timestamp": a.created_at,
            "event": a.alert_type,
            "detail": a.message,
        }
        for a in alerts
    ]
    # Prepend case creation event
    timeline.insert(0, {
        "timestamp": case.created_at,
        "event": "case_created",
        "detail": f"Case opened with risk score {case.risk_score:.2f}",
    })

    # Kill-chain detail
    stage_info = KILL_CHAIN_STAGES.get(case.kill_chain_stage, KILL_CHAIN_STAGES[0])
    kill_chain = {
        "current_stage": case.kill_chain_stage,
        "stage_name": stage_info["name"],
        "stage_description": stage_info["description"],
        "all_stages": KILL_CHAIN_STAGES,
    }

    return EvidencePacket(
        case_id=case.id,  # type: ignore[arg-type]
        scenario_id=case.scenario_id,
        transcript=case.transcript,
        risk_assessment={
            "risk_score": case.risk_score,
            "risk_category": case.risk_category,
            "kill_chain_stage": case.kill_chain_stage,
        },
        entities=entities,
        kill_chain=kill_chain,
        timeline=timeline,
        generated_at=datetime.now(timezone.utc).isoformat(),
    )


# ─── GET /api/alerts ─────────────────────────────────────────────────────────


@router.get(
    "/alerts",
    response_model=list[AlertData],
    summary="List active alerts",
)
async def list_alerts() -> list[AlertData]:
    """Return all alerts ordered by creation time (newest first)."""
    engine = get_engine()
    with Session(engine) as session:
        statement = select(Alert).order_by(Alert.created_at.desc())  # type: ignore[union-attr]
        alerts = session.exec(statement).all()

    return [
        AlertData(
            id=a.id,  # type: ignore[arg-type]
            case_id=a.case_id,
            alert_type=a.alert_type,
            message=a.message,
            created_at=a.created_at,
        )
        for a in alerts
    ]
