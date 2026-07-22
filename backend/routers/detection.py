"""
SurakshaNet AI — Detection Router
==================================
Endpoints for real-time scam detection, SSE streaming, and scenario replay.
"""

from __future__ import annotations

import asyncio
import json
import logging
from typing import Any

from fastapi import APIRouter, HTTPException
from starlette.responses import StreamingResponse

from backend.engine.risk_scorer import HybridRiskScorer
from backend.models.schemas import (
    DetectionRequest,
    DetectionResponse,
    ScenarioDetail,
    ScenarioSummary,
)
from backend.data.seed_data import load_demo_scenarios

logger = logging.getLogger("suraksha.detection")

router = APIRouter(prefix="/api", tags=["Detection"])

# Module-level scorer — initialised once, reused across requests.
_scorer: HybridRiskScorer | None = None


def get_scorer() -> HybridRiskScorer:
    """Return (and lazily create) the shared HybridRiskScorer instance."""
    global _scorer
    if _scorer is None:
        _scorer = HybridRiskScorer()
    return _scorer


def set_scorer(scorer: HybridRiskScorer) -> None:
    """Allow main.py to inject a pre-configured scorer at startup."""
    global _scorer
    _scorer = scorer


# ─── Helpers ─────────────────────────────────────────────────────────────────


def _risk_assessment_to_response(result: dict[str, Any]) -> DetectionResponse:
    """Map a RiskAssessment dict to the API response schema."""
    return DetectionResponse(
        risk_score=result.get("risk_score", 0.0),
        risk_category=result.get("risk_category", "unknown"),
        risk_color=result.get("risk_color", "#808080"),
        kill_chain_stage=result.get("kill_chain_stage", 0),
        component_scores=result.get("component_scores", {}),
        highlighted_phrases=result.get("highlighted_phrases", []),
        extracted_entities=result.get("extracted_entities", {}),
        recommended_actions=result.get("recommended_actions", []),
        explanation=result.get("explanation", ""),
    )


def _get_scenario_or_404(scenario_id: str) -> dict[str, Any]:
    """Fetch a scenario by ID or raise 404."""
    scenarios = load_demo_scenarios()
    for s in scenarios:
        if s.get("id") == scenario_id:
            return s
    raise HTTPException(status_code=404, detail=f"Scenario '{scenario_id}' not found.")


# ─── POST /api/detect ────────────────────────────────────────────────────────


@router.post(
    "/detect",
    response_model=DetectionResponse,
    summary="Analyse a transcript for scam indicators",
    description=(
        "Runs the hybrid risk-scoring pipeline on the supplied transcript and "
        "returns a comprehensive risk assessment with entity extraction, "
        "kill-chain staging, and recommended actions."
    ),
)
async def detect_scam(request: DetectionRequest) -> DetectionResponse:
    """Full single-shot detection endpoint."""
    scorer = get_scorer()
    try:
        if request.scenario_id:
            scenario = _get_scenario_or_404(request.scenario_id)
            result = scorer.score_with_scenario(
                request.transcript,
                scenario,
                audio_path=request.audio_path,
            )
        else:
            result = scorer.score(
                request.transcript,
                audio_path=request.audio_path,
            )

        return _risk_assessment_to_response(result)

    except Exception as exc:
        logger.exception("Detection failed")
        raise HTTPException(
            status_code=500,
            detail=f"Detection pipeline error: {exc}",
        ) from exc


# ─── POST /api/detect/stream ─────────────────────────────────────────────────


@router.post(
    "/detect/stream",
    summary="Stream real-time risk updates via SSE",
    description=(
        "Simulates live call monitoring by processing the transcript word-by-word "
        "and emitting Server-Sent Events with partial risk scores."
    ),
)
async def detect_stream(request: DetectionRequest):
    """SSE endpoint that yields incremental risk snapshots."""
    scorer = get_scorer()

    async def _event_generator():
        words = request.transcript.split()
        accumulated: list[str] = []

        for idx, word in enumerate(words):
            accumulated.append(word)
            partial_text = " ".join(accumulated)

            try:
                result = scorer.score(partial_text)
                payload = {
                    "word_index": idx,
                    "word": word,
                    "progress": round((idx + 1) / len(words), 4),
                    "risk_score": result.get("risk_score", 0.0),
                    "risk_category": result.get("risk_category", "safe"),
                    "risk_color": result.get("risk_color", "#22c55e"),
                    "kill_chain_stage": result.get("kill_chain_stage", 0),
                }
                yield f"data: {json.dumps(payload)}\n\n"
            except Exception as exc:
                error_payload = {"error": str(exc), "word_index": idx}
                yield f"data: {json.dumps(error_payload)}\n\n"

            # Small delay to simulate real-time pacing
            await asyncio.sleep(0.05)

        # Signal stream completion
        yield f"data: {json.dumps({'done': True, 'total_words': len(words)})}\n\n"

    return StreamingResponse(
        _event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


# ─── GET /api/scenarios ──────────────────────────────────────────────────────


@router.get(
    "/scenarios",
    response_model=list[ScenarioSummary],
    summary="List all demo scenarios",
)
async def list_scenarios() -> list[ScenarioSummary]:
    """Return lightweight summaries for every loaded demo scenario."""
    scenarios = load_demo_scenarios()
    return [
        ScenarioSummary(
            id=s.get("id", ""),
            title=s.get("title", "Untitled"),
            type=s.get("type", "unknown"),
            is_scam=s.get("is_scam", False),
            expected_risk_score=s.get("expected_risk_score", 0.0),
            city=s.get("city", ""),
        )
        for s in scenarios
    ]


# ─── GET /api/scenarios/{scenario_id} ────────────────────────────────────────


@router.get(
    "/scenarios/{scenario_id}",
    response_model=ScenarioDetail,
    summary="Get full scenario details",
)
async def get_scenario(scenario_id: str) -> ScenarioDetail:
    """Return the complete scenario payload including transcript and analysis."""
    s = _get_scenario_or_404(scenario_id)
    return ScenarioDetail(
        id=s.get("id", ""),
        title=s.get("title", "Untitled"),
        type=s.get("type", "unknown"),
        is_scam=s.get("is_scam", False),
        expected_risk_score=s.get("expected_risk_score", 0.0),
        city=s.get("city", ""),
        transcript=s.get("transcript", ""),
        risk_progression=s.get("risk_progression", []),
        entities=s.get("entities", {}),
        kill_chain_stages=s.get("kill_chain_stages", []),
        notes=s.get("notes", ""),
    )
