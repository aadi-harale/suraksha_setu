from typing import Optional, List, Dict, Any
from .phrase_detector import PhraseDetector
from .coercion_scorer import CoercionScorer
from .kill_chain import KillChainDetector
from .entity_extractor import EntityExtractor
from .payment_detector import PaymentDetector
from .voice_analyzer import VoiceAnalyzer

class RiskAssessment:
    def __init__(
        self,
        risk_score: int,
        risk_category: str,
        kill_chain_stage: int,
        component_scores: dict,
        highlighted_phrases: list,
        extracted_entities: dict,
        coercion_breakdown: dict,
        recommended_actions: list,
        explanation: str,
        kill_chain_details: dict,
        voice_analysis: dict
    ):
        self.risk_score = risk_score
        self.risk_category = risk_category
        self.kill_chain_stage = kill_chain_stage
        self.component_scores = component_scores
        self.highlighted_phrases = highlighted_phrases
        self.extracted_entities = extracted_entities
        self.coercion_breakdown = coercion_breakdown
        self.recommended_actions = recommended_actions
        self.explanation = explanation
        self.kill_chain_details = kill_chain_details
        self.voice_analysis = voice_analysis

class HybridRiskScorer:
    def __init__(self):
        self.phrase_detector = PhraseDetector()
        self.coercion_scorer = CoercionScorer()
        self.kill_chain_detector = KillChainDetector()
        self.entity_extractor = EntityExtractor()
        self.payment_detector = PaymentDetector()
        self.voice_analyzer = VoiceAnalyzer()
        
        self.known_bad_entities = {
            "rbi.verify@okaxis",
            "+91-9876543210"
        }

    def _get_category(self, score: int) -> str:
        if score <= 25: return "Safe"
        if score <= 50: return "Suspicious"
        if score <= 75: return "High Risk"
        return "Active Digital Arrest Scam"

    def score(self, transcript: str, audio_path: Optional[str] = None, precomputed_voice_score: Optional[float] = None) -> RiskAssessment:
        phrase_result = self.phrase_detector.detect(transcript)
        coercion_result = self.coercion_scorer.score(transcript)
        entity_result = self.entity_extractor.extract(transcript)
        payment_result = self.payment_detector.detect(transcript, entity_result)
        
        if audio_path:
            voice_result = self.voice_analyzer.analyze(audio_path)
        elif precomputed_voice_score is not None:
            voice_result = self.voice_analyzer.analyze_precomputed(precomputed_voice_score)
        else:
            voice_result = self.voice_analyzer.analyze_precomputed(0.8) # Default lean human
            
        voice_risk = max(0.0, 1.0 - voice_result.authenticity_score)
        
        # Check against known bad entities
        entity_history_score = 0.0
        all_entities = entity_result.phones + entity_result.upis + entity_result.bank_accounts
        for entity in all_entities:
            if entity in self.known_bad_entities:
                entity_history_score = 1.0
                break
                
        llm_reasoning_score = 0.5 # Placeholder
        
        final_score_float = (
            0.30 * phrase_result.score +
            0.20 * coercion_result.combined_score +
            0.18 * payment_result.score +
            0.12 * voice_risk +
            0.10 * entity_history_score +
            0.10 * llm_reasoning_score
        )
        
        risk_score = min(100, max(0, int(final_score_float * 100)))
        risk_category = self._get_category(risk_score)
        
        kill_chain_result = self.kill_chain_detector.detect_stage(phrase_result.matches, coercion_result)
        
        explanation = f"Detected {len(phrase_result.matches)} suspicious phrases. "
        if coercion_result.combined_score > 0.6:
            explanation += "High levels of fear and urgency detected. "
        if payment_result.score > 0.5:
            explanation += f"Risky payment methods requested: {', '.join(payment_result.methods)}. "
            
        return RiskAssessment(
            risk_score=risk_score,
            risk_category=risk_category,
            kill_chain_stage=kill_chain_result.current_stage,
            component_scores={
                "phraseScore": phrase_result.score,
                "coercionScore": coercion_result.combined_score,
                "paymentRiskScore": payment_result.score,
                "voiceAuthenticityRisk": voice_risk,
                "entityHistoryScore": entity_history_score,
                "llmReasoningScore": llm_reasoning_score
            },
            highlighted_phrases=[
                {
                    "phrase": m.phrase,
                    "category": m.category,
                    "weight": m.weight,
                    "position": m.position,
                    "contextSnippet": m.context_snippet
                } for m in phrase_result.matches
            ],
            extracted_entities={
                "phones": entity_result.phones,
                "upis": entity_result.upis,
                "bankAccounts": entity_result.bank_accounts,
                "aadhaarNumbers": entity_result.aadhaar_numbers,
                "amounts": entity_result.amounts,
                "agencies": entity_result.agencies,
                "officerNames": entity_result.officer_names
            },
            coercion_breakdown={
                "fearScore": coercion_result.fear_score,
                "urgencyScore": coercion_result.urgency_score,
                "isolationScore": coercion_result.isolation_score,
                "combinedScore": coercion_result.combined_score,
                "indicators": coercion_result.indicators
            },
            recommended_actions=[kill_chain_result.recommended_action],
            explanation=explanation,
            kill_chain_details={
                "currentStage": kill_chain_result.current_stage,
                "stageName": kill_chain_result.stage_name,
                "stagesCompleted": kill_chain_result.stages_completed,
                "nextPredictedStage": kill_chain_result.next_predicted_stage,
                "recommendedAction": kill_chain_result.recommended_action
            },
            voice_analysis={
                "authenticityScore": voice_result.authenticity_score,
                "verdict": voice_result.verdict,
                "features": voice_result.features,
                "explanation": voice_result.explanation
            }
        )
