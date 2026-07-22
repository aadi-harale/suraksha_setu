"""
SurakshaNet AI — Pydantic Schema Definitions
=============================================
Request / response models consumed by every API router.  Each model carries
rich ``Field`` descriptions so that the auto-generated OpenAPI docs are
immediately useful for front-end developers and hackathon judges.
"""

from __future__ import annotations

from typing import Any, Optional

from pydantic import BaseModel, Field


# ─── Detection ───────────────────────────────────────────────────────────────


class DetectionRequest(BaseModel):
    """Payload sent by the client for real-time scam detection."""

    transcript: str = Field(
        ...,
        min_length=1,
        description="Raw call transcript or text to analyse for scam indicators.",
    )
    audio_path: Optional[str] = Field(
        None,
        description="Optional path to an audio file for voice-stress analysis.",
    )
    scenario_id: Optional[str] = Field(
        None,
        description="Optional ID of a pre-loaded demo scenario to replay.",
    )


class DetectionResponse(BaseModel):
    """Result of the hybrid risk-scoring pipeline."""

    risk_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Composite risk score between 0 (safe) and 1 (critical).",
    )
    risk_category: str = Field(
        ...,
        description="Human-readable risk bucket — safe / low / medium / high / critical.",
    )
    risk_color: str = Field(
        ...,
        description="Hex colour mapped to the risk category for UI rendering.",
    )
    kill_chain_stage: int = Field(
        ...,
        ge=0,
        le=5,
        description="Digital-arrest kill-chain stage (0 = none … 5 = fund transfer).",
    )
    component_scores: dict[str, float] = Field(
        default_factory=dict,
        description="Break-down scores from each scoring sub-engine.",
    )
    highlighted_phrases: list[dict[str, Any]] = Field(
        default_factory=list,
        description="Transcript phrases that triggered risk flags, with offsets.",
    )
    extracted_entities: dict[str, list[str]] = Field(
        default_factory=dict,
        description="Named entities grouped by type (phone, UPI, name …).",
    )
    recommended_actions: list[str] = Field(
        default_factory=list,
        description="Actionable next-steps for the operator / law enforcement.",
    )
    explanation: str = Field(
        "",
        description="Natural-language explanation of why the score was assigned.",
    )


# ─── Cases ───────────────────────────────────────────────────────────────────


class CaseCreate(BaseModel):
    """Payload to persist a new fraud case."""

    scenario_id: Optional[str] = Field(
        None,
        description="Linked demo scenario, if applicable.",
    )
    transcript: str = Field(
        ...,
        description="Full call transcript for the case.",
    )
    risk_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Final risk score assigned by the detection engine.",
    )
    risk_category: str = Field(
        ...,
        description="Risk category label.",
    )
    kill_chain_stage: int = Field(
        0,
        ge=0,
        le=5,
        description="Kill-chain stage at detection time.",
    )
    entities_json: str = Field(
        "{}",
        description="JSON-serialised extracted entities for this case.",
    )


class CaseResponse(BaseModel):
    """Read-only case summary returned by list / create endpoints."""

    id: int = Field(..., description="Auto-generated primary key.")
    scenario_id: Optional[str] = Field(None, description="Linked demo scenario ID.")
    transcript: str = Field(..., description="Full call transcript.")
    risk_score: float = Field(..., description="Risk score at time of creation.")
    risk_category: str = Field(..., description="Risk category label.")
    kill_chain_stage: int = Field(..., description="Kill-chain stage.")
    created_at: str = Field(..., description="ISO-8601 UTC creation timestamp.")


class CaseDetail(CaseResponse):
    """Extended case view including entities and related alerts."""

    entities_json: str = Field(
        "{}",
        description="JSON-serialised extracted entities.",
    )
    alerts: list["AlertData"] = Field(
        default_factory=list,
        description="Alerts generated for this case.",
    )


# ─── Graph ───────────────────────────────────────────────────────────────────


class GraphNode(BaseModel):
    """Single node in the fraud-intelligence graph."""

    id: str = Field(..., description="Unique node identifier.")
    type: str = Field(..., description="Entity type — phone / upi / person / account.")
    value: str = Field(..., description="Display value of the entity.")
    risk_level: str = Field("unknown", description="Risk classification.")
    cluster: int = Field(0, description="Community / cluster assignment.")
    extra: dict[str, Any] = Field(
        default_factory=dict,
        description="Arbitrary metadata attached to the node.",
    )


class GraphEdge(BaseModel):
    """Directed relationship between two graph nodes."""

    source: str = Field(..., description="Source node ID.")
    target: str = Field(..., description="Target node ID.")
    relationship: str = Field(..., description="Edge label — called / sent_money / …")


class GraphData(BaseModel):
    """Complete serialised fraud graph for the front-end visualisation."""

    nodes: list[GraphNode] = Field(default_factory=list, description="Graph nodes.")
    edges: list[GraphEdge] = Field(default_factory=list, description="Graph edges.")
    clusters: Optional[list[dict[str, Any]]] = Field(
        None,
        description="Optional community-detection cluster metadata.",
    )


# ─── Alerts ──────────────────────────────────────────────────────────────────


class AlertData(BaseModel):
    """Real-time alert raised by the detection pipeline."""

    id: int = Field(..., description="Alert primary key.")
    case_id: int = Field(..., description="Owning case ID.")
    alert_type: str = Field(..., description="Alert category — high_risk / entity_match / …")
    message: str = Field(..., description="Human-readable alert message.")
    created_at: str = Field(..., description="ISO-8601 UTC timestamp.")


# ─── Evidence ────────────────────────────────────────────────────────────────


class EvidencePacket(BaseModel):
    """Structured evidence bundle for law-enforcement hand-off."""

    case_id: int = Field(..., description="Originating case ID.")
    scenario_id: Optional[str] = Field(None, description="Linked scenario.")
    transcript: str = Field(..., description="Full transcript.")
    risk_assessment: dict[str, Any] = Field(
        default_factory=dict,
        description="Detailed risk breakdown.",
    )
    entities: dict[str, Any] = Field(
        default_factory=dict,
        description="Extracted entity map.",
    )
    kill_chain: dict[str, Any] = Field(
        default_factory=dict,
        description="Kill-chain stage analysis.",
    )
    timeline: list[dict[str, Any]] = Field(
        default_factory=list,
        description="Chronological event timeline.",
    )
    generated_at: str = Field(..., description="ISO-8601 UTC generation timestamp.")


# ─── Validation / Metrics ────────────────────────────────────────────────────


class ValidationMetrics(BaseModel):
    """Aggregate accuracy metrics from the validation suite."""

    total_scenarios: int = Field(..., description="Number of scenarios evaluated.")
    correctly_classified: int = Field(..., description="Correct classifications.")
    accuracy: float = Field(..., ge=0.0, le=1.0, description="Overall accuracy ratio.")
    false_positives: int = Field(0, description="Legitimate calls flagged as scam.")
    false_negatives: int = Field(0, description="Scam calls missed.")
    avg_risk_score_scam: float = Field(
        0.0,
        description="Mean risk score across known scam scenarios.",
    )
    avg_risk_score_legit: float = Field(
        0.0,
        description="Mean risk score across known legitimate scenarios.",
    )


# ─── Scenarios ───────────────────────────────────────────────────────────────


class ScenarioSummary(BaseModel):
    """Compact representation of a demo scenario for list views."""

    id: str = Field(..., description="Unique scenario identifier.")
    title: str = Field(..., description="Short scenario title.")
    type: str = Field(..., description="Category — digital_arrest / phishing / …")
    is_scam: bool = Field(..., description="Ground-truth scam label.")
    expected_risk_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Expected risk score for validation.",
    )
    city: str = Field("", description="City associated with the scenario.")


class ScenarioDetail(ScenarioSummary):
    """Full scenario payload including transcript and analysis data."""

    transcript: str = Field("", description="Complete transcript text.")
    risk_progression: list[dict[str, Any]] = Field(
        default_factory=list,
        description="Ordered risk-score snapshots as the call progresses.",
    )
    entities: dict[str, Any] = Field(
        default_factory=dict,
        description="Pre-extracted entities for the scenario.",
    )
    kill_chain_stages: list[dict[str, Any]] = Field(
        default_factory=list,
        description="Kill-chain stage transitions.",
    )
    notes: str = Field("", description="Analyst notes or metadata.")


# Resolve forward references for CaseDetail.alerts
CaseDetail.model_rebuild()
