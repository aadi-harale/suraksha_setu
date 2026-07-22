// ============================================================
// SurakshaNet AI — Constants & Configuration
// ============================================================

export const RISK_THRESHOLDS = {
  SAFE_MAX: 25,
  SUSPICIOUS_MAX: 50,
  HIGH_RISK_MAX: 75,
  WARNING_TRIGGER: 75,
  FULL_ALERT_TRIGGER: 85,
} as const;

export const RISK_COLORS = {
  safe: { primary: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)' },
  suspicious: { primary: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)' },
  highRisk: { primary: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.4)' },
  activeScam: { primary: '#dc2626', bg: 'rgba(220, 38, 38, 0.15)', border: 'rgba(220, 38, 38, 0.4)' },
} as const;

export const RISK_CATEGORY_COLORS: Record<string, { primary: string; bg: string; border: string }> = {
  'Safe': RISK_COLORS.safe,
  'Suspicious': RISK_COLORS.suspicious,
  'High Risk': RISK_COLORS.highRisk,
  'Active Digital Arrest Scam': RISK_COLORS.activeScam,
};

export const PHRASE_CATEGORY_COLORS: Record<string, string> = {
  authority_impersonation: '#8b5cf6', // purple
  legal_threat: '#ef4444',            // red
  isolation: '#f97316',               // orange
  payment: '#dc2626',                 // dark red
  remote_access: '#ec4899',           // pink
  urgency: '#f59e0b',                 // amber
};

export const PHRASE_CATEGORY_LABELS: Record<string, string> = {
  authority_impersonation: 'Authority Impersonation',
  legal_threat: 'Legal Threat',
  isolation: 'Isolation Tactic',
  payment: 'Payment Demand',
  remote_access: 'Remote Access',
  urgency: 'Urgency Pressure',
};

export const GRAPH_NODE_COLORS: Record<string, string> = {
  phone: '#3b82f6',        // blue
  upi: '#8b5cf6',          // purple
  bank_account: '#f59e0b', // amber
  victim: '#10b981',       // green
  complaint: '#6366f1',    // indigo
  device: '#64748b',       // slate
  officer_name: '#ec4899', // pink
  script_pattern: '#14b8a6', // teal
  location: '#eab308', // yellow
  case: '#f43f5e', // rose
};

export const GRAPH_NODE_ICONS: Record<string, string> = {
  phone: '📞',
  upi: '💳',
  bank_account: '🏦',
  victim: '👤',
  complaint: '📋',
  device: '📱',
  officer_name: '👮',
  script_pattern: '🧬',
  location: '📍',
  case: '📁',
};

export const VOICE_THRESHOLDS = {
  HUMAN_MIN: 0.7,       // >= 0.7 = Likely Human
  SUSPICIOUS_MIN: 0.4,  // 0.4-0.7 = Suspicious
} as const;

export const VOICE_COLORS = {
  human: '#10b981',
  suspicious: '#f59e0b',
  ai: '#ef4444',
} as const;

export const RISK_WEIGHTS = {
  phraseScore: 0.30,
  coercionScore: 0.20,
  paymentRiskScore: 0.18,
  voiceAuthenticityRisk: 0.12,
  entityHistoryScore: 0.10,
  llmReasoningScore: 0.10,
} as const;

export const INDIA_CITIES: Record<string, { lat: number; lng: number; state: string }> = {
  'Mumbai': { lat: 19.076, lng: 72.877, state: 'Maharashtra' },
  'Delhi': { lat: 28.613, lng: 77.209, state: 'Delhi' },
  'Bangalore': { lat: 12.972, lng: 77.594, state: 'Karnataka' },
  'Hyderabad': { lat: 17.385, lng: 78.486, state: 'Telangana' },
  'Chennai': { lat: 13.083, lng: 80.270, state: 'Tamil Nadu' },
  'Pune': { lat: 18.520, lng: 73.856, state: 'Maharashtra' },
  'Kolkata': { lat: 22.572, lng: 88.363, state: 'West Bengal' },
  'Ahmedabad': { lat: 23.022, lng: 72.571, state: 'Gujarat' },
  'Jaipur': { lat: 26.912, lng: 75.787, state: 'Rajasthan' },
  'Lucknow': { lat: 26.846, lng: 80.946, state: 'Uttar Pradesh' },
  'Chandigarh': { lat: 30.733, lng: 76.779, state: 'Punjab' },
  'Kochi': { lat: 9.931, lng: 76.267, state: 'Kerala' },
  'Bhopal': { lat: 23.259, lng: 77.412, state: 'Madhya Pradesh' },
  'Patna': { lat: 25.612, lng: 85.144, state: 'Bihar' },
  'Guwahati': { lat: 26.144, lng: 91.736, state: 'Assam' },
  'Noida': { lat: 28.535, lng: 77.391, state: 'Uttar Pradesh' },
  'Gurugram': { lat: 28.459, lng: 77.026, state: 'Haryana' },
  'Indore': { lat: 22.719, lng: 75.857, state: 'Madhya Pradesh' },
  'Nagpur': { lat: 21.145, lng: 79.088, state: 'Maharashtra' },
  'Visakhapatnam': { lat: 17.686, lng: 83.218, state: 'Andhra Pradesh' },
};

export const HELPLINE = {
  CYBERCRIME: '1930',
  CYBERCRIME_URL: 'https://cybercrime.gov.in',
  POLICE: '100',
  WOMEN: '1091',
  SANCHAR_SAATHI: 'https://sancharsaathi.gov.in',
} as const;

export const ANIMATION = {
  TRANSCRIPT_WORD_DELAY: 80,    
  RISK_GAUGE_TRANSITION: 800,   
  WARNING_PULSE_INTERVAL: 1500, 
  KILL_CHAIN_STEP_DELAY: 200,   
  GRAPH_NODE_SPRING: 300,       
} as const;

export const KILL_CHAIN_ACTIONS: Record<number, { action: string; severity: 'info' | 'warning' | 'danger' | 'critical' }> = {
  1: { action: 'Verify caller identity independently. Real officers don\'t cold-call.', severity: 'info' },
  2: { action: 'This sounds like a scam. Real officers don\'t threaten arrest over phone.', severity: 'warning' },
  3: { action: 'Alert your family immediately. Call 1930 cybercrime helpline.', severity: 'danger' },
  4: { action: 'Hang up NOW. "Digital arrest" is NOT a legal concept. You are NOT under arrest.', severity: 'critical' },
  5: { action: 'DO NOT transfer any money. No government agency asks for money over call. Call 1930.', severity: 'critical' },
  6: { action: 'Report all account details to cybercrime.gov.in immediately.', severity: 'critical' },
};

export const DEMO_PRIMARY_SCENARIO = 'scenario_01';
