# Judging Rubric Alignment

This document outlines how SurakshaNet AI meets and exceeds standard hackathon judging criteria.

## 1. Innovation / Originality
**The Status Quo:** Cybercrime tools rely on victims reporting the crime *after* the money is gone. Banks rely on slow, manual dispute resolutions.
**Our Innovation:** SurakshaNet AI shifts the paradigm from reactive reporting to proactive interception. By mapping the exact psychological kill-chain of a scam (Impersonation -> Isolation -> Payment) in real-time, it intervenes *before* the victim transfers funds.

## 2. Technical Complexity & Execution
- **Hybrid Risk Engine:** Combines deterministic NLP (phrase weighting) with entity extraction rather than relying solely on a slow, unpredictable LLM.
- **Robustness:** Includes a seamless fallback layer if the AI triage API fails, guaranteeing the demo will not crash during the pitch.
- **Data Visualization:** Utilizes WebGL (deck.gl) for performant 3D geospatial rendering of threat clusters, and complex graph logic to visualize the mule account network.
- **Client-Side Document Generation:** Generates complex, heavily formatted PDFs (FIR Drafts) entirely on the client, demonstrating advanced frontend capabilities.

## 3. Real-World Feasibility
The architecture is designed to integrate cleanly into existing infrastructures:
- **Telecom Integration:** The risk engine could run as an opt-in network-level scan or on-device app (Citizen Shield).
- **Banking API:** The payment block simulation mimics standard API calls to NPCI / Bank risk engines (e.g., placing a temporary 4-hour hold on an anomalous transaction).
- **Law Enforcement:** The complaint-ready export precisely matches the data requirements for the National Cyber Crime Reporting Portal (NCRP), drastically reducing the administrative burden on Duty Officers.

## 4. UI/UX & Design
- **Premium Dark Aesthetic:** Utilizes glassmorphism, precise typography, and dynamic gradients to communicate urgency and high-tech authority.
- **Information Hierarchy:** The dashboard separates tactical intervention (Risk Meter, Kill-Chain) from strategic intelligence (Scam Script DNA, Threat Clusters).
- **Accessibility of Complex Data:** The Fraud Graph uses color-coding and edge routing to make complex criminal networks easily understandable at a glance.
