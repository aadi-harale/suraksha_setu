import re
import traceback

def test_regex():
    patterns = {
        "_PHONE_RE": r"""
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
        "_UPI_RE": r"""
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
        "_BANK_ACCOUNT_KEYWORD_RE": r"""
    (?:
        account\s*(?:number|no\.?|num|#)?
      | a/?c\s*(?:number|no\.?|num|#)?
      | bank\s*(?:account|a/?c)
      | account\s*:?
      | khata\s*(?:number|no\.?)?       # Hinglish
    )
    \s*[:\-]?\s*
    (\d[\d\s\-]{7,20}\d)                # 9-18 digit number (may have spaces/dashes)
    """,
        "_AADHAAR_RE": r"""
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
        "_AMOUNT_RE": r"""
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
        "_OFFICER_RE": r"""
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
    """
    }

    for name, pat in patterns.items():
        try:
            re.compile(pat, re.VERBOSE | re.IGNORECASE)
            print(f"{name}: OK")
        except Exception as e:
            print(f"{name}: ERROR - {e}")

if __name__ == "__main__":
    test_regex()
