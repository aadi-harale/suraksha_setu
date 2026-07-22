"""
SurakshaNet AI — Scam Phrase Pattern Matching Engine
=====================================================

Core component that detects known scam phrases and Hinglish variants
in call transcripts. Phrases are organized into six tactical categories
that map directly to the digital-arrest kill chain.

Categories & weights:
    1. authority_impersonation  (0.90)
    2. legal_threat             (0.85)
    3. isolation                (0.80)
    4. payment                  (0.90)
    5. remote_access            (0.75)
    6. urgency                  (0.70)

Usage:
    detector = PhraseDetector()
    result   = detector.detect(transcript_text)
    print(result.score, result.categories_triggered)
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple


# ---------------------------------------------------------------------------
# Data models
# ---------------------------------------------------------------------------

@dataclass(frozen=True)
class PhraseEntry:
    """Single phrase stored in the detection dictionary."""
    text: str
    category: str
    weight: float
    is_hinglish: bool


@dataclass(frozen=True)
class PhraseMatch:
    """A single detected phrase occurrence inside a transcript."""
    phrase: str
    category: str
    weight: float
    position: int
    context_snippet: str


@dataclass
class PhraseDetectionResult:
    """Aggregated result returned by ``PhraseDetector.detect``."""
    score: float
    matches: List[PhraseMatch]
    categories_triggered: List[str]


# ---------------------------------------------------------------------------
# Category configuration
# ---------------------------------------------------------------------------

CATEGORY_WEIGHTS: Dict[str, float] = {
    "authority_impersonation": 0.90,
    "legal_threat":           0.85,
    "isolation":              0.80,
    "payment":                0.90,
    "remote_access":          0.75,
    "urgency":                0.70,
}


# ---------------------------------------------------------------------------
# Phrase corpus — 200+ entries
# ---------------------------------------------------------------------------

def _build_phrase_corpus() -> List[PhraseEntry]:
    """Return the full scam-phrase corpus.

    Each category contains at least 30 phrases mixing English and Hinglish
    variants commonly observed in Indian digital-arrest scams.
    """

    entries: List[PhraseEntry] = []

    def _add(category: str, phrases: List[Tuple[str, bool]]) -> None:
        w = CATEGORY_WEIGHTS[category]
        for text, hinglish in phrases:
            entries.append(PhraseEntry(
                text=text.lower(),
                category=category,
                weight=w,
                is_hinglish=hinglish,
            ))

    # ── 1. Authority Impersonation ─────────────────────────────────────
    _add("authority_impersonation", [
        ("CBI Prosecutor speaking", False),
        ("this is from enforcement directorate", False),
        ("this call is from CBI", False),
        ("I am calling from NCB", False),
        ("Narcotics Control Bureau", False),
        ("National Investigation Agency", False),
        ("your Aadhaar is linked to money laundering", False),
        ("your SIM will be blocked", False),
        ("your mobile number is being used for illegal activities", False),
        ("parcel intercepted by customs", False),
        ("parcel intercepted", False),
        ("NCB has found drugs in your name", False),
        ("we are from cyber crime police", False),
        ("Reserve Bank of India investigation", False),
        ("TRAI compliance department", False),
        ("I am Inspector from Mumbai Cyber Cell", False),
        ("Commissioner of Police office", False),
        ("Supreme Court has issued notice", False),
        ("customs department has intercepted", False),
        ("senior officer will speak to you", False),
        ("I am connecting you to CBI officer", False),
        ("this is a government verified call", False),
        ("verification from Ministry of Home Affairs", False),
        ("RBI has flagged your account", False),
        ("we have your Aadhaar details", False),
        ("your PAN card is misused", False),
        ("Aapke khilaf warrant nikla hai", True),
        ("yeh CBI headquarters se bol rahe hain", True),
        ("hum Enforcement Directorate se baat kar rahe hain", True),
        ("aapka Aadhaar money laundering mein link hai", True),
        ("aapki SIM block hone wali hai", True),
        ("police station se call aa rahi hai", True),
        ("customs ne aapka parcel pakda hai", True),
        ("NCB ke paas aapke naam pe drugs mili hain", True),
        ("hum NIA se bol rahe hain", True),
        ("yeh TRAI ka notice hai", True),
        ("DCP sahab baat karenge", True),
        ("mukhya nyayadhish ka order hai", True),
        ("aapke naam se FIR darj hui hai", True),
        ("yeh government authorized call hai", True),
    ])

    # ── 2. Legal Threats ───────────────────────────────────────────────
    _add("legal_threat", [
        ("arrest warrant has been issued", False),
        ("FIR has been registered", False),
        ("case registered against you", False),
        ("money laundering case", False),
        ("you will be sent to jail", False),
        ("non-bailable warrant", False),
        ("court order against you", False),
        ("Section 420 IPC", False),
        ("Section 420", False),
        ("NDPS Act violation", False),
        ("PMLA Act", False),
        ("digital arrest", False),
        ("freeze your bank account", False),
        ("seize your property", False),
        ("criminal charges will be filed", False),
        ("terrorist financing", False),
        ("hawala transaction", False),
        ("your passport will be cancelled", False),
        ("look-out circular issued", False),
        ("Interpol red notice", False),
        ("extradition proceedings", False),
        ("cyber terrorism charges", False),
        ("you are an accused", False),
        ("evidence against you is strong", False),
        ("you will be arrested within 24 hours", False),
        ("bail will be denied", False),
        ("your family will also be arrested", False),
        ("life imprisonment", False),
        ("aapke khilaf arrest warrant hai", True),
        ("aap par case darj hoga", True),
        ("aapko jail bhej denge", True),
        ("non-bailable warrant nikla hai", True),
        ("court ka order hai aapke khilaf", True),
        ("PMLA ke tahat case hai", True),
        ("digital arrest mein hain aap", True),
        ("aapka account freeze ho jayega", True),
        ("aapki property seize hogi", True),
        ("criminal case darj hoga", True),
        ("hawala mein aapka naam aaya hai", True),
        ("passport cancel ho jayega", True),
    ])

    # ── 3. Isolation ───────────────────────────────────────────────────
    _add("isolation", [
        ("do not tell anyone", False),
        ("don't tell your family", False),
        ("don't tell family", False),
        ("this is a confidential investigation", False),
        ("confidential investigation", False),
        ("stay on video call", False),
        ("keep camera on", False),
        ("keep your camera on", False),
        ("don't disconnect the call", False),
        ("don't disconnect", False),
        ("go to a separate room", False),
        ("don't use other devices", False),
        ("do not use another phone", False),
        ("sub judice matter", False),
        ("sub judice", False),
        ("evidence tampering if you tell anyone", False),
        ("evidence tampering if you tell", False),
        ("you must stay on this call", False),
        ("this matter is classified", False),
        ("do not leave the video call", False),
        ("if you disconnect you will be arrested", False),
        ("talking to anyone will be contempt of court", False),
        ("do not contact any lawyer", False),
        ("we are monitoring you", False),
        ("your phone is being tracked", False),
        ("do not switch off your phone", False),
        ("remain visible on camera", False),
        ("kisi ko mat batana", True),
        ("apne family ko mat bolna", True),
        ("yeh confidential investigation hai", True),
        ("video call pe raho", True),
        ("camera on rakhna", True),
        ("call disconnect mat karna", True),
        ("alag kamre mein jao", True),
        ("doosra phone use mat karna", True),
        ("sub judice mamla hai", True),
        ("agar kisi ko bataya toh evidence tampering hogi", True),
        ("phone band mat karna", True),
        ("hum aapko monitor kar rahe hain", True),
        ("lawyer se baat mat karna", True),
        ("video call se bahar mat jaana", True),
    ])

    # ── 4. Payment ─────────────────────────────────────────────────────
    _add("payment", [
        ("transfer money to this account", False),
        ("transfer money", False),
        ("UPI transfer", False),
        ("send via UPI", False),
        ("bank transfer required", False),
        ("bank transfer", False),
        ("verification deposit", False),
        ("security deposit required", False),
        ("security deposit", False),
        ("pay the court fees", False),
        ("court fees", False),
        ("send money to safe account", False),
        ("send to safe account", False),
        ("pay immediately", False),
        ("NEFT transfer", False),
        ("NEFT", False),
        ("RTGS transfer", False),
        ("RTGS", False),
        ("refundable amount", False),
        ("bail amount", False),
        ("pay the fine", False),
        ("fine amount", False),
        ("deposit for clearance", False),
        ("GST clearance fee", False),
        ("pay to avoid arrest", False),
        ("send to RBI safe vault", False),
        ("temporary hold amount", False),
        ("compliance fee", False),
        ("legal settlement amount", False),
        ("fixed deposit required for verification", False),
        ("paise transfer karo", True),
        ("UPI se bhejo", True),
        ("bank mein transfer karo", True),
        ("verification ke liye deposit karo", True),
        ("security deposit dena hoga", True),
        ("court ki fees bharo", True),
        ("safe account mein bhejo", True),
        ("abhi turant payment karo", True),
        ("NEFT se bhejo", True),
        ("RTGS se bhejo", True),
        ("refundable hai yeh amount", True),
        ("bail ke paise bhejo", True),
        ("fine bharna padega", True),
        ("arrest se bachne ke liye pay karo", True),
    ])

    # ── 5. Remote Access ──────────────────────────────────────────────
    _add("remote_access", [
        ("install AnyDesk", False),
        ("download AnyDesk", False),
        ("AnyDesk", False),
        ("TeamViewer", False),
        ("install TeamViewer", False),
        ("screen share", False),
        ("share your screen", False),
        ("QuickSupport", False),
        ("install QuickSupport", False),
        ("remote access", False),
        ("share OTP", False),
        ("share the OTP", False),
        ("tell me the OTP", False),
        ("give me OTP", False),
        ("share your screen with me", False),
        ("download this app for verification", False),
        ("install this application", False),
        ("screen sharing for investigation", False),
        ("give remote access", False),
        ("allow remote control", False),
        ("connect via remote desktop", False),
        ("share 6 digit code", False),
        ("share 9 digit code", False),
        ("I need your OTP for verification", False),
        ("send me the code you received", False),
        ("AnyDesk install karo", True),
        ("TeamViewer download karo", True),
        ("screen share karo", True),
        ("apna screen dikhao", True),
        ("OTP batao", True),
        ("OTP share karo", True),
        ("yeh app install karo", True),
        ("remote access do", True),
        ("6 digit code batao", True),
        ("jo code aaya hai woh batao", True),
    ])

    # ── 6. Urgency ─────────────────────────────────────────────────────
    _add("urgency", [
        ("immediately", False),
        ("right now", False),
        ("within 2 hours", False),
        ("within one hour", False),
        ("urgent matter", False),
        ("urgent", False),
        ("time is running out", False),
        ("cooperate now", False),
        ("don't waste time", False),
        ("last chance", False),
        ("do it now", False),
        ("final warning", False),
        ("deadline is today", False),
        ("you have 30 minutes", False),
        ("act immediately", False),
        ("no time to waste", False),
        ("before it is too late", False),
        ("this is your last opportunity", False),
        ("hurry up", False),
        ("clock is ticking", False),
        ("delay will result in arrest", False),
        ("if not done in 1 hour", False),
        ("time sensitive", False),
        ("execute now", False),
        ("cannot wait any longer", False),
        ("abhi turant", True),
        ("abhi karo", True),
        ("jaldi karo", True),
        ("waqt nahi hai", True),
        ("samay khatam ho raha hai", True),
        ("aakhri mauka", True),
        ("der mat karo", True),
        ("jaldi se jaldi", True),
        ("fauran", True),
        ("turant action lo", True),
    ])

    return entries


# ---------------------------------------------------------------------------
# Detector
# ---------------------------------------------------------------------------

class PhraseDetector:
    """Scam phrase pattern matching engine.

    Builds an internal lookup from the phrase corpus and scans transcripts
    for case-insensitive matches.  Returns structured ``PhraseDetectionResult``
    with per-match context snippets and an aggregate risk score.

    Parameters
    ----------
    context_window : int
        Number of characters on each side of a match to include in the
        ``context_snippet``.  Defaults to 60.
    """

    # Number of chars of surrounding context to include per match.
    DEFAULT_CONTEXT_WINDOW: int = 60

    def __init__(self, context_window: int = DEFAULT_CONTEXT_WINDOW) -> None:
        self._context_window = context_window
        self._corpus: List[PhraseEntry] = _build_phrase_corpus()

        # Pre-compile a single regex alternation ordered longest-first so
        # that longer phrases are matched before their sub-strings.
        sorted_entries = sorted(self._corpus, key=lambda e: len(e.text), reverse=True)
        self._entry_map: Dict[str, PhraseEntry] = {}
        escaped: List[str] = []
        for entry in sorted_entries:
            key = entry.text  # already lowered during construction
            if key not in self._entry_map:
                self._entry_map[key] = entry
                escaped.append(re.escape(key))

        # Use word boundaries where possible for cleaner matching.  Some
        # Hinglish phrases contain characters that sit next to \b nicely.
        pattern = r"(?:" + "|".join(escaped) + r")"
        self._regex = re.compile(pattern, re.IGNORECASE)

    # -- public API ---------------------------------------------------------

    @property
    def corpus_size(self) -> int:
        """Total number of distinct phrases in the corpus."""
        return len(self._entry_map)

    def detect(self, transcript: str) -> PhraseDetectionResult:
        """Scan *transcript* for scam phrases.

        Parameters
        ----------
        transcript : str
            Raw transcript text (may span multiple lines).

        Returns
        -------
        PhraseDetectionResult
            Aggregated result containing the risk ``score`` (0.0–1.0),
            a list of ``PhraseMatch`` objects, and the list of triggered
            category names.

        Raises
        ------
        TypeError
            If *transcript* is not a string.
        """
        if not isinstance(transcript, str):
            raise TypeError(f"Expected str, got {type(transcript).__name__}")

        if not transcript.strip():
            return PhraseDetectionResult(score=0.0, matches=[], categories_triggered=[])

        transcript_lower = transcript.lower()
        matches: List[PhraseMatch] = []
        categories_hit: Dict[str, float] = {}

        for m in self._regex.finditer(transcript_lower):
            matched_text = m.group(0).lower()
            entry = self._entry_map.get(matched_text)
            if entry is None:
                continue

            pos = m.start()
            snippet = self._extract_snippet(transcript, pos, len(matched_text))

            matches.append(PhraseMatch(
                phrase=entry.text,
                category=entry.category,
                weight=entry.weight,
                position=pos,
                context_snippet=snippet,
            ))

            # Track maximum weight per category for scoring.
            prev = categories_hit.get(entry.category, 0.0)
            categories_hit[entry.category] = max(prev, entry.weight)

        score = self._compute_score(matches, categories_hit)
        categories_triggered = sorted(categories_hit.keys())

        return PhraseDetectionResult(
            score=round(score, 4),
            matches=matches,
            categories_triggered=categories_triggered,
        )

    # -- internal helpers ---------------------------------------------------

    def _extract_snippet(self, text: str, start: int, length: int) -> str:
        """Return a context window around the match."""
        snippet_start = max(0, start - self._context_window)
        snippet_end = min(len(text), start + length + self._context_window)
        snippet = text[snippet_start:snippet_end].replace("\n", " ").strip()
        if snippet_start > 0:
            snippet = "…" + snippet
        if snippet_end < len(text):
            snippet = snippet + "…"
        return snippet

    @staticmethod
    def _compute_score(
        matches: List[PhraseMatch],
        categories_hit: Dict[str, float],
    ) -> float:
        """Compute aggregate risk score in [0.0, 1.0].

        The score blends two signals:
        1. **Category coverage** — fraction of the 6 categories triggered,
           weighted by each category's max observed weight.
        2. **Match density** — diminishing-return accumulation of individual
           match weights (capped at 1.0).

        The final score is ``0.6 * coverage + 0.4 * density``.
        """
        if not matches:
            return 0.0

        total_categories = len(CATEGORY_WEIGHTS)

        # Weighted category coverage.
        coverage_sum = sum(categories_hit.values())
        max_possible = sum(CATEGORY_WEIGHTS.values())
        coverage = coverage_sum / max_possible if max_possible else 0.0

        # Density with diminishing returns (1 - e^(-k * sum)).
        raw = sum(m.weight for m in matches)
        import math
        density = 1.0 - math.exp(-0.15 * raw)

        score = 0.6 * coverage + 0.4 * density
        return min(score, 1.0)
