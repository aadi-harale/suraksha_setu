// ============================================================
// SurakshaNet AI — Core Type Definitions
// ============================================================

export type RiskCategory = 'Safe' | 'Suspicious' | 'High Risk' | 'Active Digital Arrest Scam';

export type ScamType =
  | 'digital_arrest'
  | 'customs_parcel'
  | 'bank_kyc'
  | 'investment'
  | 'lottery'
  | 'legitimate';

export type PhraseCategory =
  | 'authority_impersonation'
  | 'legal_threat'
  | 'isolation'
  | 'payment'
  | 'remote_access'
  | 'urgency';

export interface PhraseMatch {
  phrase: string;
  category: PhraseCategory;
  weight: number;
  position: number;
  contextSnippet: string;
}

export interface ComponentScores {
  phraseScore: number;
  coercionScore: number;
  paymentRiskScore: number;
  voiceAuthenticityRisk: number;
  entityHistoryScore: number;
  llmReasoningScore: number;
}

export interface CoercionBreakdown {
  fearScore: number;
  urgencyScore: number;
  isolationScore: number;
  combinedScore: number;
  indicators: string[];
}

export interface KillChainStage {
  currentStage: number; // 1-6
  stageName: string;
  stagesCompleted: number[];
  nextPredictedStage: number | null;
  predictionConfidence?: number;
  recommendedAction: string;
  intervention?: string;
}

export interface ExtractedEntities {
  phones: string[];
  upis: string[];
  bankAccounts: string[];
  aadhaarNumbers: string[];
  amounts: string[];
  agencies: string[];
  officerNames: string[];
}

export type VoiceVerdict = 'Likely Human Voice' | 'Suspicious Audio Patterns' | 'High Synthetic Voice Suspicion';

export interface VoiceAnalysis {
  authenticityScore: number; // 0.0 (AI) to 1.0 (human)
  verdict: VoiceVerdict;
  features: {
    pitchVariance: number;
    spectralFlatness: number;
    zeroCrossingRateVariance: number;
    mfccVariance: number;
    highFrequencyRatio: number;
    pauseRegularity: number;
  };
  explanation: string;
}

export interface RiskAssessment {
  riskScore: number;
  riskCategory: RiskCategory;
  killChainStage: KillChainStage;
  componentScores: ComponentScores;
  highlightedPhrases: PhraseMatch[];
  extractedEntities: ExtractedEntities;
  coercionBreakdown: CoercionBreakdown;
  recommendedActions: string[];
  explanation: string;
}

export interface DemoScenario {
  id: string;
  title: string;
  type: ScamType;
  isScam: boolean;
  transcript: string;
  riskProgression: number[];
  killChainStagesAt: Record<string, number>;
  expectedRiskScore: number;
  expectedCategory: RiskCategory;
  voiceAuthenticity: number;
  entities: ExtractedEntities;
  city: string;
  callerDescription: string;
  languageMode?: string;
  hashes?: {
    transcript: string;
    audio: string;
    entities: string;
  };
}

export type GraphNodeType =
  | 'phone'
  | 'upi'
  | 'bank_account'
  | 'victim'
  | 'complaint'
  | 'device'
  | 'officer_name'
  | 'script_pattern'
  | 'location'
  | 'case';

export type GraphEdgeType =
  | 'called_victim'
  | 'asked_payment_to'
  | 'linked_to_account'
  | 'shared_upi'
  | 'same_script'
  | 'same_region'
  | 'same_mule_account'
  | 'same_device'
  | 'called'
  | 'requested_payment'
  | 'linked_to_mule'
  | 'impersonated'
  | 'used_script'
  | 'seen_in_case'
  | 'same_pattern'
  | 'location'
  | 'atm_withdrawal';

export interface FraudGraphNode extends Record<string, unknown> {
  id: string;
  type: GraphNodeType;
  value: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  cluster: number;
  city?: string;
  bank?: string;
  metadata?: Record<string, unknown>;
}

export interface FraudGraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: GraphEdgeType;
  weight?: number;
  timestamp?: string;
}

export interface FraudGraphData {
  nodes: FraudGraphNode[];
  edges: FraudGraphEdge[];
}

export interface ClusterInfo {
  id: number;
  name: string;
  nodeCount: number;
  primaryScamType: string;
  hubNode: string;
  cities: string[];
  riskLevel: 'medium' | 'high' | 'critical';
}

export interface CaseData {
  id: string;
  scenarioId: string;
  title: string;
  transcript: string;
  riskScore: number;
  riskCategory: RiskCategory;
  killChainStage: number;
  entities: ExtractedEntities;
  highlightedPhrases: PhraseMatch[];
  componentScores: ComponentScores;
  riskProgression: number[];
  voiceAnalysis: VoiceAnalysis;
  city: string;
  createdAt: string;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
}

export interface AlertData {
  id: string;
  caseId: string;
  type: 'scam_detected' | 'high_risk' | 'payment_attempt' | 'new_entity';
  title: string;
  message: string;
  riskScore: number;
  riskCategory: RiskCategory;
  city: string;
  timestamp: string;
}

export interface EvidencePacket {
  caseId: string;
  generatedAt: string;
  caseHeader: {
    title: string;
    riskScore: number;
    riskCategory: RiskCategory;
    killChainStage: string;
    city: string;
    timestamp: string;
  };
  transcript: string;
  highlightedPhrases: PhraseMatch[];
  entities: ExtractedEntities;
  riskTimeline: number[];
  componentScores: ComponentScores;
  killChainAnalysis: KillChainStage;
  voiceAnalysis: VoiceAnalysis;
  linkedGraphEntities: FraudGraphNode[];
  recommendedActions: string[];
  languageMode?: string;
  hashes?: {
    transcript: string;
    audio: string;
    entities: string;
  };
  decisionLog?: string[];
}

export interface GraphIntelligenceMetrics {
  centralityScore: number;
  linkedCases: number;
  citiesAffected: string[];
  scriptSimilarity: number;
  campaignStatus: 'Active' | 'Dormant';
}

export interface ScenarioValidation {
  scenarioId: string;
  title: string;
  isScam: boolean;
  predictedScam: boolean;
  expectedScore: number;
  actualScore: number;
  correct: boolean;
  category: RiskCategory;
}

export interface ValidationMetrics {
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number;
  truePositives: number;
  trueNegatives: number;
  falsePositives: number;
  falseNegatives: number;
  totalScenarios: number;
  scenarioResults: ScenarioValidation[];
}

export interface CityScamData {
  city: string;
  state: string;
  lat: number;
  lng: number;
  scamCount: number;
  activeAlerts: number;
  primaryScamType: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
