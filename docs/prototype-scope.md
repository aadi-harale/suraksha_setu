# Prototype Scope & Limitations

SurakshaNet AI was built as a proof-of-concept for a hackathon. To ensure a reliable demonstration and to respect technical/legal boundaries, certain features are fully functional while others are simulated.

## Working (Implemented Logic)
- **Risk Scoring Engine:** The 0-100 risk score is dynamically calculated based on transcript parsing, keyword weights, and psychological coercion markers (fear, urgency, isolation).
- **Kill-Chain Mapping:** The logic to determine if a call has progressed from Impersonation to Payment Extraction is fully functional based on the text inputs.
- **Fraud Graph Visualization:** The 3D and 2D node visualization dynamically renders relationships between entities (Phone -> Case -> UPI).
- **Geospatial Dashboard:** Renders geospatial threat clusters.
- **Complaint-Ready Export:** Generates an actual PDF document on the client-side using `@react-pdf/renderer` formatted as an investigation packet.
- **AI Triage Fallback:** The deterministic fallback engine accurately parses the case data if the LLM API is unavailable.

## Simulated (Demo Only)
- **Live Audio Interception:** OS-level audio interception of phone calls is restricted by mobile OS sandboxing (iOS/Android). The demo uses a pre-recorded transcript simulation to represent this capability.
- **Bank / Telecom Escalation:** The platform simulates the UI flow of blocking a payment or suspending a number. It is not connected to NPCI, RBI, or any TSP backend.
- **Trusted Contact SMS:** The UI notification of an SMS sent to a relative is simulated.
- **Government Repository Lookup:** The "Suspect Repository Check" queries a local mock database (`mock-data.ts`) rather than the real NCRP (National Cyber Crime Reporting Portal).
- **Audio Deepfake Detection:** The "Synthetic Voice Suspicion" score is a supporting signal placeholder. Production-grade deepfake detection requires advanced neural network processing (e.g., Wav2Vec2) which is out of scope for the live presentation.
