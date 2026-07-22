"""
SurakshaNet AI — Entity Extractor
====================================

Extracts structured entities from call transcripts that are forensically
relevant to digital-arrest scam investigations:

* **Phone numbers** — Indian format (+91 / 0-prefix / bare 10-digit)
* **UPI IDs** — ``name@bank`` patterns (okaxis, ybl, paytm, …)
* **Bank account numbers** — 9–18 digit strings near "account" keywords
* **Aadhaar numbers** — 12-digit patterns (with / without spaces)
* **Monetary amounts** — ₹ prefix, lakh / crore / thousand, plain numbers
* **Agency names** — CBI, ED, NCB, TRAI, RBI, NIA, customs, police, …
* **Officer names** — "Inspector / DCP / Commissioner + Name" patterns

Usage:
    extractor = EntityExtractor()
    result    = extractor.extract(transcript_text)
    print(result.phones, result.amounts)
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import List, Pattern, Set


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------

@dataclass
class EntityResult:
    """Container for all entities extracted from a transcript."""
    phones: List[str] = field(default_factory=list)
    upis: List[str] = field(default_factory=list)
    bank_accounts: List[str] = field(default_factory=list)
    aadhaar_numbers: List[str] = field(default_factory=list)
    amounts: List[str] = field(default_factory=list)
    agencies: List[str] = field(default_factory=list)
    officer_names: List[str] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Compiled regex patterns
# ---------------------------------------------------------------------------

# Phone: +91-XXXXXXXXXX, 91XXXXXXXXXX, 0XXXXXXXXXX, or bare 10-digit.
_PHONE_RE: Pattern[str] = re.compile(
    r"""
    (?<!\d)                             # no digit before
    (?:
        \+91[\s\-]?                     # +91 prefix
      | 0091[\s\-]?                     # 0091 prefix
      | 91[\s\-]?(?=\d{10}(?!\d))       # 91 prefix (only if followed by exactly 10 digits)
      | 0(?=\d{10}(?!\d))               # 0 prefix
    )?
    ([6-9]\d{9})                        # 10-digit Indian mobile
    (?!\d)                              # no digit after
    """,
    re.VERBOSE,
)

# UPI ID: alphanumeric.dotted@bankhandle
_UPI_RE: Pattern[str] = re.compile(
    r"""
    (?<!\S)                             # preceded by whitespace or start
    (
        [A-Za-z0-9][A-Za-z0-9._\-]{1,48}   # username
        @
        (?:okaxis|okhdfcbank|okicici|oksbi   # known bank handles
        |ybl|ibl|upi|axl|sbi|icici|hdfcbank
        |paytm|gpay|apl|freecharge|phonepe
        |kotak|indus|boi|pnb|unionbank
        |citi|rbl|federal|dbs|hsbc
        |axisbank|airtel|jio|postbank
        |ezeepay|jupiteraxis|slice
        |[a-z]{2,20}                    # fallback — any short handle
        )
    )
    (?!\S)                              # followed by whitespace or end
    """,
    re.VERBOSE | re.IGNORECASE,
)

# Bank account: 9–18 digits near an account-related keyword.
_BANK_ACCOUNT_KEYWORD_RE: Pattern[str] = re.compile(
    r"""
    (?:
        account\s*(?:number|no\.?|num|\#)?
      | a/?c\s*(?:number|no\.?|num|\#)?
      | bank\s*(?:account|a/?c)
      | account\s*:?
      | khata\s*(?:number|no\.?)?       # Hinglish
    )
    \s*[:\-]?\s*
    (\d[\d\s\-]{7,20}\d)                # 9-18 digit number (may have spaces/dashes)
    """,
    re.VERBOSE | re.IGNORECASE,
)

# Aadhaar: 12 digits in groups of 4, optionally separated by spaces/dashes.
_AADHAAR_RE: Pattern[str] = re.compile(
    r"""
    (?<!\d)
    (
        [2-9]\d{3}           # first group (Aadhaar never starts with 0 or 1)
        [\s\-]?
        \d{4}
        [\s\-]?
        \d{4}
    )
    (?!\d)
    """,
    re.VERBOSE,
)

# Amounts: ₹ / Rs / INR followed by digits, or digits followed by lakh/crore/thousand/rupees.
_AMOUNT_RE: Pattern[str] = re.compile(
    r"""
    (?:
        (?:₹|Rs\.?|INR)\s*             # currency prefix
        (\d[\d,]*\.?\d*)               # number with optional commas/decimals
        (?:\s*(?:lakh|lac|crore|cr|thousand|k|lakhs|crores))? # optional multiplier
    |
        (\d[\d,]*\.?\d*)               # number
        \s*
        (?:lakh|lac|crore|cr|thousand|rupees|rupee|rs|lakhs|crores)  # required multiplier
    |
        (?:₹|Rs\.?|INR)\s*
        (\d[\d,]*\.?\d*)               # just prefix + digits
    )
    """,
    re.VERBOSE | re.IGNORECASE,
)

# Agency names — case-insensitive whole-word matches.
_AGENCY_NAMES: List[str] = [
    "CBI",
    "ED",
    "Enforcement Directorate",
    "NCB",
    "Narcotics Control Bureau",
    "TRAI",
    "Telecom Regulatory Authority",
    "RBI",
    "Reserve Bank of India",
    "NIA",
    "National Investigation Agency",
    "Customs",
    "Customs Department",
    "Cyber Crime",
    "Cyber Cell",
    "Cyber Police",
    "Police",
    "Income Tax Department",
    "IT Department",
    "Ministry of Home Affairs",
    "MHA",
    "Supreme Court",
    "High Court",
    "Mumbai Police",
    "Delhi Police",
]

_AGENCY_RE: Pattern[str] = re.compile(
    r"\b(?:" + "|".join(re.escape(a) for a in sorted(_AGENCY_NAMES, key=len, reverse=True)) + r")\b",
    re.IGNORECASE,
)

# Officer names: title followed by a capitalized name.
_OFFICER_RE: Pattern[str] = re.compile(
    r"""
    \b(
        (?:Inspector|Sub[\s\-]?Inspector|SI|ASI
        |DCP|ACP|SP|DSP|SSP|IPS
        |Commissioner|Dy\.?\s*Commissioner|Deputy\s+Commissioner
        |Prosecutor|Public\s+Prosecutor
        |Superintendent|Director|Joint\s+Director
        |Collector|Magistrate|Judge|Officer|Commandant
        )
        \s+
        [A-Z][a-z]+                     # first name
        (?:\s+[A-Z][a-z]+){0,3}        # optional middle / last names
    )
    \b
    """,
    re.VERBOSE,
)


# ---------------------------------------------------------------------------
# Extractor
# ---------------------------------------------------------------------------

class EntityExtractor:
    """Extract forensically relevant entities from scam call transcripts.

    All extraction is performed via pre-compiled regular expressions.
    Results are de-duplicated and returned in a typed ``EntityResult``.
    """

    def extract(self, transcript: str) -> EntityResult:
        """Extract entities from *transcript*.

        Parameters
        ----------
        transcript : str
            Raw transcript text (may span multiple lines).

        Returns
        -------
        EntityResult
            De-duplicated lists of extracted entities.

        Raises
        ------
        TypeError
            If *transcript* is not a string.
        """
        if not isinstance(transcript, str):
            raise TypeError(f"Expected str, got {type(transcript).__name__}")

        if not transcript.strip():
            return EntityResult()

        return EntityResult(
            phones=self._extract_phones(transcript),
            upis=self._extract_upis(transcript),
            bank_accounts=self._extract_bank_accounts(transcript),
            aadhaar_numbers=self._extract_aadhaar(transcript),
            amounts=self._extract_amounts(transcript),
            agencies=self._extract_agencies(transcript),
            officer_names=self._extract_officers(transcript),
        )

    # -- individual extractors ----------------------------------------------

    @staticmethod
    def _extract_phones(text: str) -> List[str]:
        """Extract Indian mobile numbers, normalized to 10-digit form."""
        seen: Set[str] = set()
        results: List[str] = []
        for m in _PHONE_RE.finditer(text):
            number = m.group(1)
            if number and number not in seen:
                seen.add(number)
                results.append(number)
        return results

    @staticmethod
    def _extract_upis(text: str) -> List[str]:
        """Extract UPI IDs."""
        seen: Set[str] = set()
        results: List[str] = []
        for m in _UPI_RE.finditer(text):
            upi = m.group(1).lower()
            if upi not in seen:
                seen.add(upi)
                results.append(upi)
        return results

    @staticmethod
    def _extract_bank_accounts(text: str) -> List[str]:
        """Extract bank account numbers near account-related keywords."""
        seen: Set[str] = set()
        results: List[str] = []
        for m in _BANK_ACCOUNT_KEYWORD_RE.finditer(text):
            raw = m.group(1)
            cleaned = re.sub(r"[\s\-]", "", raw)
            if 9 <= len(cleaned) <= 18 and cleaned not in seen:
                seen.add(cleaned)
                results.append(cleaned)
        return results

    @staticmethod
    def _extract_aadhaar(text: str) -> List[str]:
        """Extract 12-digit Aadhaar numbers."""
        seen: Set[str] = set()
        results: List[str] = []
        for m in _AADHAAR_RE.finditer(text):
            raw = m.group(1)
            cleaned = re.sub(r"[\s\-]", "", raw)
            if len(cleaned) == 12 and cleaned not in seen:
                seen.add(cleaned)
                # Format as XXXX XXXX XXXX for readability.
                formatted = f"{cleaned[:4]} {cleaned[4:8]} {cleaned[8:]}"
                results.append(formatted)
        return results

    @staticmethod
    def _extract_amounts(text: str) -> List[str]:
        """Extract monetary amounts with currency / multiplier context."""
        seen: Set[str] = set()
        results: List[str] = []
        for m in _AMOUNT_RE.finditer(text):
            raw = m.group(0).strip()
            # Normalize whitespace.
            normalized = re.sub(r"\s+", " ", raw)
            if normalized not in seen:
                seen.add(normalized)
                results.append(normalized)
        return results

    @staticmethod
    def _extract_agencies(text: str) -> List[str]:
        """Extract known agency / authority names."""
        seen: Set[str] = set()
        results: List[str] = []
        for m in _AGENCY_RE.finditer(text):
            agency = m.group(0)
            key = agency.upper()
            if key not in seen:
                seen.add(key)
                results.append(agency)
        return results

    @staticmethod
    def _extract_officers(text: str) -> List[str]:
        """Extract officer title + name patterns."""
        seen: Set[str] = set()
        results: List[str] = []
        for m in _OFFICER_RE.finditer(text):
            name = m.group(1).strip()
            key = name.lower()
            if key not in seen:
                seen.add(key)
                results.append(name)
        return results
