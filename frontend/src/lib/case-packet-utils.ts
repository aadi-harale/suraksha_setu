import { EvidencePacket } from './types';

// Use a fixed timestamp for deterministic demo output
const DEMO_TIMESTAMP = "2026-07-22T10:00:00.000Z";

export const mockEvidenceData: EvidencePacket = {
  caseId: "SN-2026-07-8892",
  generatedAt: DEMO_TIMESTAMP,
  caseHeader: {
    title: "Active Digital Arrest Scam",
    riskScore: 92,
    riskCategory: "Active Digital Arrest Scam",
    killChainStage: "Stage 5 (Payment)",
    city: "Mumbai",
    timestamp: DEMO_TIMESTAMP
  },
  transcript: "",
  highlightedPhrases: [
    { phrase: "DCP Sharma from the Central Bureau of Investigation", category: "authority_impersonation", weight: 0.9, position: 0, contextSnippet: "" },
    { phrase: "money laundering", category: "legal_threat", weight: 0.85, position: 0, contextSnippet: "" },
    { phrase: "non-bailable offence", category: "legal_threat", weight: 0.9, position: 0, contextSnippet: "" },
    { phrase: "under digital arrest", category: "isolation", weight: 0.95, position: 0, contextSnippet: "" },
    { phrase: "security deposit of ₹48,000", category: "payment", weight: 0.9, position: 0, contextSnippet: "" }
  ],
  entities: {
    phones: ["+91-9876543210"],
    upis: ["rbi.verify@okaxis"],
    bankAccounts: [],
    aadhaarNumbers: [],
    amounts: ["₹48,000"],
    agencies: [],
    officerNames: []
  },
  riskTimeline: [],
  componentScores: {
    phraseScore: 0.9, coercionScore: 0.9, paymentRiskScore: 0.9, voiceAuthenticityRisk: 0.7, entityHistoryScore: 1.0, llmReasoningScore: 0.5
  },
  killChainAnalysis: {
    currentStage: 5, stageName: "Payment Extraction", stagesCompleted: [1,2,3,4], nextPredictedStage: 6, recommendedAction: ""
  },
  voiceAnalysis: {
    authenticityScore: 0.3, verdict: "High Synthetic Voice Suspicion", features: { pitchVariance: 0, spectralFlatness: 0, zeroCrossingRateVariance: 0, mfccVariance: 0, highFrequencyRatio: 0, pauseRegularity: 0 }, explanation: "Spectral flatness and pitch variance anomalies detected."
  },
  linkedGraphEntities: [],
  recommendedActions: [],
  languageMode: "English",
  hashes: {
    transcript: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    audio: "8a1e2b5b3a6e8f4c8b2a1a4f5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c",
    entities: "5d41402abc4b2a76b9719d911017c592"
  }
};
