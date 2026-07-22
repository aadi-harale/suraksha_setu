# Hackathon Submission: SurakshaNet AI

## One-Line Pitch
Real-time digital arrest scam intervention, fraud-network intelligence, and complaint-ready reporting.

## Problem Statement Alignment
Digital arrest scams have become an epidemic, utilizing fear, isolation, and sophisticated authority impersonation. Current solutions are purely reactive. SurakshaNet AI addresses this by providing a simulated proactive layer that analyzes live scam signals, disrupts the kill-chain before payment extraction, and links isolated cases into a unified fraud intelligence graph.

## What Makes It Different
1. **Kill-Chain Disruption:** Instead of just flagging a call, it maps the exact psychological stage of the scam (Impersonation -> Isolation -> Payment) to provide contextual warnings (e.g., "Digital arrest does not exist").
2. **Actionable Intelligence:** It doesn't just block a number; it visualizes the scam campaign (Scam Script DNA) and tracks associated entities (UPIs, phones) in a fraud graph.
3. **Complaint-Ready Automation:** It drastically reduces investigative friction by structuring raw scam transcripts into a legally-structured, tamper-evident draft ready for officer review.

## Demo Instructions
1. Start the frontend server (`cd frontend && npm run dev`).
2. Navigate to `http://localhost:3000`.
3. Click the **"3-Minute Judge Demo"** button on the bottom left.
4. Watch the live transcript simulation trigger the risk meter and kill-chain stages.
5. Observe the simulated payment block and trusted contact SMS intervention.
6. Navigate to the **Dashboard** to view the Fraud Graph and Geospatial threat map.
7. Navigate to the **Evidence** page to generate a Complaint-Ready PDF draft.

## Judging Rubric Mapping
- **Innovation:** Proactive kill-chain mapping rather than reactive blocking.
- **Feasibility:** Built using scalable, modern tech (Next.js, FastAPI, deterministic ML heuristics) designed to integrate into existing telecommunications and banking pipelines as an API layer.
- **Impact:** Direct disruption of the final payment extraction stage, potentially saving millions in citizen funds.
- **Technical Execution:** Clean architecture, responsive 3D dashboard, strict typing, and robust fallback handling for unreliable LLMs.

## Prototype Scope
Please note the boundary between working code and simulated integrations:
**Working:** Hybrid risk engine scoring, kill-chain mapping, graph visualization, dashboard analytics, complaint draft generation, deterministic triage fallback.
**Simulated for Pitch:** Direct API connections to banks/telecoms (impossible in a hackathon), real-time live audio interception (requires OS-level hooks).

## Safe Disclaimer
This is a hackathon prototype designed to showcase a theoretical proactive defense system. It is not connected to real police, banks, telecom providers, or government systems. All generated documents are drafts and require review by authorized personnel.
