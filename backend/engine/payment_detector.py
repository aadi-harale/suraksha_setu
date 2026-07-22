from typing import Optional

class PaymentResult:
    def __init__(self, score: float, methods: list, pretexts: list, risk_level: str, total_amount_requested: Optional[float] = None):
        self.score = score
        self.methods = methods
        self.pretexts = pretexts
        self.risk_level = risk_level
        self.total_amount_requested = total_amount_requested

class PaymentDetector:
    def __init__(self):
        self.high_risk_methods = ["upi", "bank transfer", "neft", "rtgs", "cryptocurrency", "bitcoin", "usdt"]
        self.critical_risk_methods = ["otp", "anydesk", "teamviewer", "screen share", "quicksupport"]
        self.medium_risk_methods = ["gift card", "amazon card"]
        
        self.pretexts_list = [
            "verification deposit", "security deposit", "bail amount", 
            "court fees", "safe account", "refundable", "fine", "processing fee"
        ]

    def detect(self, transcript: str, entities: any) -> PaymentResult:
        transcript_lower = transcript.lower()
        methods_found = []
        pretexts_found = []
        score = 0.0
        risk_level = "low"
        
        for method in self.critical_risk_methods:
            if method in transcript_lower:
                methods_found.append(method)
                score = max(score, 1.0)
                risk_level = "critical"
                
        for method in self.high_risk_methods:
            if method in transcript_lower:
                methods_found.append(method)
                score = max(score, 0.8)
                if risk_level != "critical":
                    risk_level = "high"
                    
        for method in self.medium_risk_methods:
            if method in transcript_lower:
                methods_found.append(method)
                score = max(score, 0.5)
                if risk_level not in ["critical", "high"]:
                    risk_level = "medium"

        for pretext in self.pretexts_list:
            if pretext in transcript_lower:
                pretexts_found.append(pretext)
                score = min(score + 0.2, 1.0)
                
        # Also check if any amounts or upis were found in entities
        if hasattr(entities, 'amounts') and entities.amounts:
            score = min(score + 0.1, 1.0)
            if not methods_found:
                risk_level = "medium" if risk_level == "low" else risk_level

        if hasattr(entities, 'upis') and entities.upis:
            methods_found.append("upi")
            score = max(score, 0.85)
            risk_level = "high" if risk_level != "critical" else risk_level

        return PaymentResult(
            score=score,
            methods=list(set(methods_found)),
            pretexts=pretexts_found,
            risk_level=risk_level,
            total_amount_requested=None 
        )
