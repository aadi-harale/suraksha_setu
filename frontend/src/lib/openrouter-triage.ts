export interface TriageRequest {
  transcript: string;
  entities: any;
  riskScore: number;
  killChainStage: string;
  scenarioType: string;
}

export interface TriageResponse {
  summary: string;
  riskIndicators: string[];
  citizenAction: string;
  investigatorAction: string;
  uncertainties: string;
  isSimulated: boolean;
}

export function getFallbackTriage(req: TriageRequest): TriageResponse {
  const isScam = req.riskScore >= 55;

  if (isScam) {
    return {
      summary: "The call shows a high-risk digital arrest pattern involving authority impersonation, legal intimidation, isolation, and a payment request.",
      riskIndicators: [
        "Authority impersonation (Police/CBI/ED)",
        "Legal threat or mention of FIR/Arrest",
        "Isolation instruction (Do not tell family)",
        "Demand for immediate payment or 'security deposit'",
        "Complaint repository match"
      ],
      citizenAction: "Disconnect immediately. Do not pay. Contact trusted family member and call 1930.",
      investigatorAction: "Review suspect UPI and phone number. Link to existing cluster DA-MH-0726-A. Preserve transcript and hashes.",
      uncertainties: "Audio authenticity is a supporting signal only. Complaint repository match is not proof of guilt.",
      isSimulated: true
    };
  }

  return {
    summary: "Routine customer support or delivery verification call. No coercive or fraudulent patterns detected.",
    riskIndicators: [
      "None detected"
    ],
    citizenAction: "Proceed normally. No critical intervention required.",
    investigatorAction: "No action required. Logged for false-positive defense benchmarking.",
    uncertainties: "None.",
    isSimulated: true
  };
}
