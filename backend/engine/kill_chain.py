"""
SurakshaNet AI — Kill Chain Stage Detector
=============================================

Models the six-stage progression of a digital-arrest scam:

1. **Authority Impersonation** — caller claims to be CBI / ED / police.
2. **Fear Creation** — legal threats, FIR, warrant references.
3. **Victim Isolation** — "don't tell anyone", forced video call.
4. **Continuous Control** — ongoing camera / call control.
5. **Payment Extraction** — demand for money transfer.
6. **Mule Account Laundering** — references to multiple accounts.

Stage transitions are **cumulative**: a call cannot be at Stage 4 unless
Stages 1–3 have already been detected.

Usage:
    from backend.engine.phrase_detector import PhraseDetector
    from backend.engine.coercion_scorer import CoercionScorer

    detector    = PhraseDetector()
    scorer      = CoercionScorer()
    kill_chain  = KillChainDetector()

    pd_result = detector.detect(transcript)
    co_result = scorer.score(transcript)
    kc_result = kill_chain.detect_stage(pd_result.matches, co_result)
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Set


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------

@dataclass
class StageInfo:
    """Metadata for a single kill-chain stage."""
    number: int
    name: str
    description: str
    recommended_action: str


@dataclass
class KillChainResult:
    """Result of kill-chain stage detection."""
    current_stage: int
    stages_completed: List[int]
    next_predicted_stage: Optional[int]
    recommended_action: str
    stage_details: Dict[int, StageInfo]
    evidence_summary: Dict[int, List[str]]


# ---------------------------------------------------------------------------
# Stage definitions
# ---------------------------------------------------------------------------

_STAGES: List[StageInfo] = [
    StageInfo(
        number=1,
        name="Authority Impersonation",
        description="Caller impersonates government officials (CBI, ED, police, customs, TRAI, etc.).",
        recommended_action="Verify caller identity independently",
    ),
    StageInfo(
        number=2,
        name="Fear Creation",
        description="Legal threats deployed — FIR, warrant, PMLA, arrest, jail references.",
        recommended_action="This sounds like a scam. Real officers don't call and threaten.",
    ),
    StageInfo(
        number=3,
        name="Victim Isolation",
        description="Victim instructed not to tell anyone, forced into secrecy.",
        recommended_action="Alert family immediately. Call 1930.",
    ),
    StageInfo(
        number=4,
        name="Continuous Control",
        description="Ongoing call control — video call, camera on, don't disconnect.",
        recommended_action="Hang up now. You are NOT under digital arrest.",
    ),
    StageInfo(
        number=5,
        name="Payment Extraction",
        description="Demand for money transfer via UPI, NEFT, RTGS, or other means.",
        recommended_action="DO NOT transfer any money. Call 1930 immediately.",
    ),
    StageInfo(
        number=6,
        name="Mule Account Laundering",
        description="Victim directed to send money to multiple / mule accounts.",
        recommended_action="Report all account details to cybercrime.gov.in",
    ),
]

_STAGE_MAP: Dict[int, StageInfo] = {s.number: s for s in _STAGES}


# ---------------------------------------------------------------------------
# Stage detection rules
# ---------------------------------------------------------------------------

# Categories from PhraseDetector that map to each stage.
_STAGE_CATEGORY_MAP: Dict[int, Set[str]] = {
    1: {"authority_impersonation"},
    2: {"legal_threat"},
    3: {"isolation"},
    4: {"isolation"},  # subset — continuous control indicators
    5: {"payment"},
    6: {"payment"},    # elevated — multiple-account patterns
}

# Phrases / keywords that specifically indicate continuous-control (Stage 4)
# beyond generic isolation.
_CONTINUOUS_CONTROL_KEYWORDS: Set[str] = {
    "stay on video call",
    "keep camera on",
    "keep your camera on",
    "don't disconnect",
    "don't disconnect the call",
    "do not leave the video call",
    "you must stay on this call",
    "remain visible on camera",
    "video call pe raho",
    "camera on rakhna",
    "call disconnect mat karna",
    "video call se bahar mat jaana",
    "if you disconnect you will be arrested",
}

# Phrases / keywords indicating mule-account laundering (Stage 6).
_MULE_ACCOUNT_KEYWORDS: Set[str] = {
    "another account",
    "second account",
    "different account",
    "multiple accounts",
    "mule account",
    "safe account",
    "send to safe account",
    "rbi safe vault",
    "send to rbi safe vault",
    "doosre account",
    "alag account",
}


class KillChainDetector:
    """Detect which stage of the digital-arrest kill chain a call is in.

    Parameters
    ----------
    coercion_threshold : float
        Minimum coercion sub-score required to count as *detected* for
        stages that lean on the ``CoercionResult``.  Defaults to 0.20.
    """

    def __init__(self, coercion_threshold: float = 0.20) -> None:
        self._coercion_threshold = coercion_threshold

    # -- public API ---------------------------------------------------------

    def detect_stage(
        self,
        phrase_matches: List[Any],
        coercion_result: Any,
    ) -> KillChainResult:
        """Determine kill-chain stage from engine outputs.

        Parameters
        ----------
        phrase_matches : list[PhraseMatch]
            Matches returned by ``PhraseDetector.detect().matches``.
            Each element must have ``phrase``, ``category``, ``weight``,
            ``position``, and ``context_snippet`` attributes.
        coercion_result : CoercionResult
            Result from ``CoercionScorer.score()``.  Must have
            ``fear_score``, ``urgency_score``, ``isolation_score``,
            ``combined_score``, and ``indicators`` attributes.

        Returns
        -------
        KillChainResult
        """
        # Gather categories & phrases that fired.
        categories_present: Set[str] = set()
        phrases_present: Set[str] = set()
        category_evidence: Dict[str, List[str]] = {}

        for pm in phrase_matches:
            cat = pm.category
            categories_present.add(cat)
            phrases_present.add(pm.phrase.lower())
            category_evidence.setdefault(cat, []).append(pm.phrase)

        # Evaluate each stage.
        evidence_summary: Dict[int, List[str]] = {}
        stage_detected: Dict[int, bool] = {}

        # Stage 1 — Authority Impersonation
        stage_detected[1] = "authority_impersonation" in categories_present
        if stage_detected[1]:
            evidence_summary[1] = category_evidence.get("authority_impersonation", [])

        # Stage 2 — Fear Creation
        fear_from_phrases = "legal_threat" in categories_present
        fear_from_coercion = coercion_result.fear_score >= self._coercion_threshold
        stage_detected[2] = fear_from_phrases or fear_from_coercion
        if stage_detected[2]:
            ev: List[str] = category_evidence.get("legal_threat", [])
            if fear_from_coercion:
                ev.append(f"fear_score={coercion_result.fear_score:.2f}")
            evidence_summary[2] = ev

        # Stage 3 — Victim Isolation
        isolation_from_phrases = "isolation" in categories_present
        isolation_from_coercion = coercion_result.isolation_score >= self._coercion_threshold
        stage_detected[3] = isolation_from_phrases or isolation_from_coercion
        if stage_detected[3]:
            ev = category_evidence.get("isolation", [])
            if isolation_from_coercion:
                ev.append(f"isolation_score={coercion_result.isolation_score:.2f}")
            evidence_summary[3] = ev

        # Stage 4 — Continuous Control (needs specific control phrases)
        control_phrases = phrases_present & _CONTINUOUS_CONTROL_KEYWORDS
        stage_detected[4] = len(control_phrases) > 0
        if stage_detected[4]:
            evidence_summary[4] = list(control_phrases)

        # Stage 5 — Payment Extraction
        stage_detected[5] = "payment" in categories_present
        if stage_detected[5]:
            evidence_summary[5] = category_evidence.get("payment", [])

        # Stage 6 — Mule Account Laundering (multiple account references)
        mule_phrases = phrases_present & _MULE_ACCOUNT_KEYWORDS
        # Also count if there are 2+ distinct payment phrases (heuristic
        # for multiple-account references in natural language).
        payment_phrases = category_evidence.get("payment", [])
        multiple_payment_refs = len(set(payment_phrases)) >= 3
        stage_detected[6] = len(mule_phrases) > 0 or multiple_payment_refs
        if stage_detected[6]:
            ev = list(mule_phrases) if mule_phrases else []
            if multiple_payment_refs:
                ev.append(f"Multiple payment references ({len(set(payment_phrases))} distinct)")
            evidence_summary[6] = ev

        # Apply cumulative constraint: stage N requires stages 1..(N-1).
        stages_completed: List[int] = []
        for stage_num in range(1, 7):
            if stage_detected.get(stage_num, False):
                stages_completed.append(stage_num)
            else:
                break  # cumulative — stop at first missing stage

        current_stage = stages_completed[-1] if stages_completed else 0

        # Determine next predicted stage.
        next_predicted: Optional[int] = None
        if 0 < current_stage < 6:
            next_predicted = current_stage + 1

        # Pick recommended action for the current stage.
        if current_stage == 0:
            recommended_action = "No scam indicators detected. Continue monitoring."
        else:
            recommended_action = _STAGE_MAP[current_stage].recommended_action

        return KillChainResult(
            current_stage=current_stage,
            stages_completed=stages_completed,
            next_predicted_stage=next_predicted,
            recommended_action=recommended_action,
            stage_details=_STAGE_MAP,
            evidence_summary=evidence_summary,
        )
