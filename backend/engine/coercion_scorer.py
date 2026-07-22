"""
SurakshaNet AI — Coercion Scoring Engine
==========================================

Analyses a call transcript for three coercion dimensions:

* **Fear**      — threats, legal jargon, references to arrest / jail / seizure.
* **Urgency**   — time pressure, deadlines, "immediately" variants.
* **Isolation** — forced seclusion, camera-on demands, "don't tell" patterns.

A weighted ``combined_score`` is returned along with human-readable
``indicators`` that explain what was detected.

Usage:
    scorer = CoercionScorer()
    result = scorer.score(transcript_text)
    print(result.combined_score, result.indicators)
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Dict, List, Pattern, Tuple


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------

@dataclass
class CoercionResult:
    """Result container for coercion analysis."""
    fear_score: float
    urgency_score: float
    isolation_score: float
    combined_score: float
    indicators: List[str]


# ---------------------------------------------------------------------------
# Pattern banks
# ---------------------------------------------------------------------------

# Each bank is a list of (compiled_regex, severity_weight, indicator_label).

_FEAR_PATTERNS: List[Tuple[Pattern[str], float, str]] = [
    # -- English --
    (re.compile(r"\barrest\s*warrant\b", re.I), 0.18, "Arrest warrant threat"),
    (re.compile(r"\bnon[- ]?bailable\s*warrant\b", re.I), 0.20, "Non-bailable warrant threat"),
    (re.compile(r"\bfir\b.*\bregistered\b", re.I), 0.16, "FIR registered threat"),
    (re.compile(r"\bcase\s+registered\s+against\b", re.I), 0.16, "Case registered against you"),
    (re.compile(r"\bmoney\s*laundering\b", re.I), 0.17, "Money laundering accusation"),
    (re.compile(r"\bsent?\s+to\s+jail\b", re.I), 0.18, "Jail threat"),
    (re.compile(r"\bjail\b", re.I), 0.10, "Mention of jail"),
    (re.compile(r"\bcourt\s+order\b", re.I), 0.14, "Court order reference"),
    (re.compile(r"\bsection\s*420\b", re.I), 0.14, "Section 420 IPC reference"),
    (re.compile(r"\bndps\s+act\b", re.I), 0.15, "NDPS Act reference"),
    (re.compile(r"\bpmla\b", re.I), 0.16, "PMLA Act reference"),
    (re.compile(r"\bdigital\s+arrest\b", re.I), 0.20, "Digital arrest — signature scam term"),
    (re.compile(r"\bfreeze\b.*\baccount\b", re.I), 0.15, "Account freeze threat"),
    (re.compile(r"\bseize\b.*\bproperty\b", re.I), 0.15, "Property seizure threat"),
    (re.compile(r"\bcriminal\s+charges\b", re.I), 0.16, "Criminal charges threat"),
    (re.compile(r"\bterrorist\s+financing\b", re.I), 0.18, "Terrorist financing accusation"),
    (re.compile(r"\bhawala\b", re.I), 0.14, "Hawala transaction reference"),
    (re.compile(r"\bpassport\b.*\bcancel\b", re.I), 0.13, "Passport cancellation threat"),
    (re.compile(r"\blook[- ]?out\s+circular\b", re.I), 0.15, "Look-out circular threat"),
    (re.compile(r"\binterpol\s+red\s+notice\b", re.I), 0.17, "Interpol Red Notice threat"),
    (re.compile(r"\bextradition\b", re.I), 0.14, "Extradition threat"),
    (re.compile(r"\blife\s+imprisonment\b", re.I), 0.19, "Life imprisonment threat"),
    (re.compile(r"\byou\s+are\s+an?\s+accused\b", re.I), 0.14, "Accused designation"),
    (re.compile(r"\bevidence\s+against\s+you\b", re.I), 0.13, "Claims of evidence"),
    (re.compile(r"\barrested\s+within\b", re.I), 0.17, "Imminent arrest threat"),
    (re.compile(r"\bbail\s+will\s+be\s+denied\b", re.I), 0.16, "Bail denial threat"),
    (re.compile(r"\bfamily\b.*\barrested\b", re.I), 0.18, "Threat to arrest family"),
    (re.compile(r"\bcyber\s*terrorism\b", re.I), 0.16, "Cyber terrorism charge"),
    # -- Hinglish --
    (re.compile(r"\barrest\s*warrant\s+nikla\b", re.I), 0.18, "Arrest warrant (Hinglish)"),
    (re.compile(r"\bjail\s+bhej\b", re.I), 0.17, "Jail threat (Hinglish)"),
    (re.compile(r"\baccount\s+freeze\s+ho\b", re.I), 0.15, "Account freeze (Hinglish)"),
    (re.compile(r"\bproperty\s+seize\s+hogi\b", re.I), 0.15, "Property seizure (Hinglish)"),
    (re.compile(r"\bdigital\s+arrest\s+mein\b", re.I), 0.20, "Digital arrest (Hinglish)"),
    (re.compile(r"\bpassport\s+cancel\s+ho\b", re.I), 0.13, "Passport cancel (Hinglish)"),
    (re.compile(r"\bcase\s+darj\b", re.I), 0.15, "Case filed (Hinglish)"),
]

_URGENCY_PATTERNS: List[Tuple[Pattern[str], float, str]] = [
    (re.compile(r"\bimmediately\b", re.I), 0.18, "Immediate action demanded"),
    (re.compile(r"\bright\s+now\b", re.I), 0.16, "Right-now pressure"),
    (re.compile(r"\bwithin\s+\d+\s*hours?\b", re.I), 0.17, "Hard time deadline"),
    (re.compile(r"\bwithin\s+\d+\s*minutes?\b", re.I), 0.18, "Minute-level deadline"),
    (re.compile(r"\burgent\b", re.I), 0.14, "Urgency language"),
    (re.compile(r"\btime\s+is\s+running\s+out\b", re.I), 0.17, "Time running out"),
    (re.compile(r"\bcooperate\s+now\b", re.I), 0.15, "Demand to cooperate now"),
    (re.compile(r"\bdon'?t\s+waste\s+time\b", re.I), 0.14, "Don't waste time"),
    (re.compile(r"\blast\s+chance\b", re.I), 0.16, "Last chance pressure"),
    (re.compile(r"\bdo\s+it\s+now\b", re.I), 0.15, "Do it now"),
    (re.compile(r"\bfinal\s+warning\b", re.I), 0.17, "Final warning"),
    (re.compile(r"\bdeadline\s+is\s+today\b", re.I), 0.16, "Today deadline"),
    (re.compile(r"\byou\s+have\s+\d+\s*minutes?\b", re.I), 0.18, "Minute countdown"),
    (re.compile(r"\bact\s+immediately\b", re.I), 0.17, "Act immediately"),
    (re.compile(r"\bno\s+time\s+to\s+waste\b", re.I), 0.14, "No time to waste"),
    (re.compile(r"\bbefore\s+it\s+is\s+too\s+late\b", re.I), 0.15, "Before too late"),
    (re.compile(r"\bhurry\s+up\b", re.I), 0.13, "Hurry up"),
    (re.compile(r"\bclock\s+is\s+ticking\b", re.I), 0.15, "Clock is ticking"),
    (re.compile(r"\bdelay\b.*\barrest\b", re.I), 0.18, "Delay → arrest threat"),
    (re.compile(r"\bif\s+not\s+done\s+in\b", re.I), 0.16, "Conditional deadline"),
    (re.compile(r"\btime\s+sensitive\b", re.I), 0.13, "Time sensitive"),
    (re.compile(r"\bcannot\s+wait\b", re.I), 0.14, "Cannot wait"),
    (re.compile(r"\blast\s+opportunity\b", re.I), 0.15, "Last opportunity"),
    # -- Hinglish --
    (re.compile(r"\babhi\s+turant\b", re.I), 0.17, "Abhi turant (immediately, Hinglish)"),
    (re.compile(r"\bjaldi\s+karo\b", re.I), 0.15, "Jaldi karo (hurry, Hinglish)"),
    (re.compile(r"\bwaqt\s+nahi\b", re.I), 0.14, "Waqt nahi (no time, Hinglish)"),
    (re.compile(r"\bsamay\s+khatam\b", re.I), 0.15, "Samay khatam (time over, Hinglish)"),
    (re.compile(r"\baakhri\s+mauka\b", re.I), 0.16, "Aakhri mauka (last chance, Hinglish)"),
    (re.compile(r"\bder\s+mat\s+karo\b", re.I), 0.14, "Der mat karo (don't delay, Hinglish)"),
    (re.compile(r"\bfauran\b", re.I), 0.15, "Fauran (immediately, Hinglish)"),
    (re.compile(r"\bturant\s+action\b", re.I), 0.15, "Turant action (Hinglish)"),
]

_ISOLATION_PATTERNS: List[Tuple[Pattern[str], float, str]] = [
    (re.compile(r"\bdo\s+not\s+tell\s+anyone\b", re.I), 0.20, "Do not tell anyone"),
    (re.compile(r"\bdon'?t\s+tell\b.*\bfamily\b", re.I), 0.20, "Don't tell family"),
    (re.compile(r"\bdon'?t\s+tell\b.*\banyone\b", re.I), 0.20, "Don't tell anyone"),
    (re.compile(r"\bconfidential\s+investigation\b", re.I), 0.18, "Confidential investigation claim"),
    (re.compile(r"\bstay\s+on\s+video\s+call\b", re.I), 0.19, "Forced video call"),
    (re.compile(r"\bkeep\s+(?:your\s+)?camera\s+on\b", re.I), 0.19, "Camera-on demand"),
    (re.compile(r"\bdon'?t\s+disconnect\b", re.I), 0.18, "Don't disconnect"),
    (re.compile(r"\bgo\s+to\s+a?\s*separate\s+room\b", re.I), 0.17, "Separate room demand"),
    (re.compile(r"\bdon'?t\s+use\s+other\s+devices?\b", re.I), 0.16, "Device restriction"),
    (re.compile(r"\bdo\s+not\s+use\s+another\s+phone\b", re.I), 0.16, "Phone restriction"),
    (re.compile(r"\bsub\s*judice\b", re.I), 0.15, "Sub judice claim"),
    (re.compile(r"\bevidence\s+tampering\b", re.I), 0.17, "Evidence tampering threat"),
    (re.compile(r"\bthis\s+matter\s+is\s+classified\b", re.I), 0.16, "Classified matter claim"),
    (re.compile(r"\bif\s+you\s+disconnect\b.*\barrested\b", re.I), 0.19, "Arrest on disconnect threat"),
    (re.compile(r"\bcontempt\s+of\s+court\b", re.I), 0.16, "Contempt of court threat"),
    (re.compile(r"\bdo\s+not\s+contact\s+any\s+lawyer\b", re.I), 0.19, "Lawyer contact blocked"),
    (re.compile(r"\bmonitoring\s+you\b", re.I), 0.15, "Surveillance claim"),
    (re.compile(r"\bphone\s+is\s+being\s+tracked\b", re.I), 0.16, "Phone tracking claim"),
    (re.compile(r"\bdo\s+not\s+switch\s+off\b", re.I), 0.15, "Phone must stay on"),
    (re.compile(r"\bremain\s+visible\b", re.I), 0.16, "Remain visible demand"),
    # -- Hinglish --
    (re.compile(r"\bkisi\s+ko\s+mat\s+batana\b", re.I), 0.20, "Kisi ko mat batana (Hinglish)"),
    (re.compile(r"\bfamily\s+ko\s+mat\s+bolna\b", re.I), 0.20, "Family ko mat bolna (Hinglish)"),
    (re.compile(r"\bvideo\s+call\s+pe\s+raho\b", re.I), 0.19, "Video call pe raho (Hinglish)"),
    (re.compile(r"\bcamera\s+on\s+rakhna\b", re.I), 0.19, "Camera on rakhna (Hinglish)"),
    (re.compile(r"\bcall\s+disconnect\s+mat\s+karna\b", re.I), 0.18, "Call disconnect mat karna (Hinglish)"),
    (re.compile(r"\balag\s+kamre\s+mein\s+jao\b", re.I), 0.17, "Alag kamre mein jao (Hinglish)"),
    (re.compile(r"\bdoosra\s+phone\b.*\bmat\b", re.I), 0.16, "Doosra phone restriction (Hinglish)"),
    (re.compile(r"\blawyer\s+se\s+baat\s+mat\b", re.I), 0.19, "Lawyer se baat mat karna (Hinglish)"),
    (re.compile(r"\bmonitor\s+kar\s+rahe\b", re.I), 0.15, "Monitor kar rahe (Hinglish)"),
    (re.compile(r"\bphone\s+band\s+mat\s+karna\b", re.I), 0.15, "Phone band mat karna (Hinglish)"),
]


# ---------------------------------------------------------------------------
# Scorer
# ---------------------------------------------------------------------------

class CoercionScorer:
    """Compute coercion sub-scores from a raw transcript.

    The scorer runs three independent pattern banks over the text and
    produces ``fear_score``, ``urgency_score``, and ``isolation_score``,
    each in [0.0, 1.0].

    The ``combined_score`` is a weighted blend::

        combined = 0.40 * fear + 0.35 * urgency + 0.25 * isolation

    Human-readable ``indicators`` describe every pattern that fired.
    """

    # Blend weights for the combined score.
    _WEIGHT_FEAR: float = 0.40
    _WEIGHT_URGENCY: float = 0.35
    _WEIGHT_ISOLATION: float = 0.25

    def score(self, transcript: str) -> CoercionResult:
        """Analyse *transcript* for coercion signals.

        Parameters
        ----------
        transcript : str
            Raw call transcript.

        Returns
        -------
        CoercionResult

        Raises
        ------
        TypeError
            If *transcript* is not a string.
        """
        if not isinstance(transcript, str):
            raise TypeError(f"Expected str, got {type(transcript).__name__}")

        if not transcript.strip():
            return CoercionResult(
                fear_score=0.0,
                urgency_score=0.0,
                isolation_score=0.0,
                combined_score=0.0,
                indicators=[],
            )

        fear, fear_ind = self._score_dimension(transcript, _FEAR_PATTERNS)
        urgency, urg_ind = self._score_dimension(transcript, _URGENCY_PATTERNS)
        isolation, iso_ind = self._score_dimension(transcript, _ISOLATION_PATTERNS)

        combined = (
            self._WEIGHT_FEAR * fear
            + self._WEIGHT_URGENCY * urgency
            + self._WEIGHT_ISOLATION * isolation
        )

        indicators: List[str] = []
        if fear_ind:
            indicators.append(f"[FEAR] {', '.join(fear_ind)}")
        if urg_ind:
            indicators.append(f"[URGENCY] {', '.join(urg_ind)}")
        if iso_ind:
            indicators.append(f"[ISOLATION] {', '.join(iso_ind)}")

        return CoercionResult(
            fear_score=round(fear, 4),
            urgency_score=round(urgency, 4),
            isolation_score=round(isolation, 4),
            combined_score=round(combined, 4),
            indicators=indicators,
        )

    # -- internals ----------------------------------------------------------

    @staticmethod
    def _score_dimension(
        text: str,
        patterns: List[Tuple[Pattern[str], float, str]],
    ) -> Tuple[float, List[str]]:
        """Score a single coercion dimension.

        Accumulates severity weights for every pattern that fires at least
        once, applying diminishing returns via ``1 - e^(-k * raw_sum)``
        so the score asymptotically approaches 1.0.

        Returns
        -------
        (score, list_of_indicator_labels)
        """
        import math

        raw_total: float = 0.0
        indicators: List[str] = []

        for pattern, severity, label in patterns:
            hits = pattern.findall(text)
            if hits:
                # Give extra weight for repeated occurrences (diminishing).
                count = len(hits)
                effective = severity * (1.0 + 0.3 * (count - 1))
                raw_total += effective
                suffix = f" (×{count})" if count > 1 else ""
                indicators.append(f"{label}{suffix}")

        if raw_total == 0.0:
            return 0.0, []

        score = 1.0 - math.exp(-1.2 * raw_total)
        return min(score, 1.0), indicators
