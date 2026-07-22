# System Architecture

## Overview
SurakshaNet AI uses a decoupled frontend-backend architecture designed for rapid deployment, reliable offline mock-data presentations, and scalable API expansion.

## 1. Frontend (Next.js 16)
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Glassmorphism UI
- **State Management:** React Hooks
- **Visualization:** Deck.gl / Maplibre GL (Geospatial), @xyflow/react (Fraud Graph)
- **PDF Generation:** @react-pdf/renderer (Client-side execution)
- **Role:** Handles all UI rendering, demo state machines, and visual representations. The frontend is designed to run completely standalone during the demo using deterministic mock data to ensure 100% reliability.

## 2. Backend (FastAPI - Optional for Demo)
- **Framework:** FastAPI
- **Database:** SQLite + SQLModel
- **Risk Engine:** A hybrid deterministic scorer (Phrase matching + regex entity extraction) rather than a pure black-box LLM. This ensures explainability and consistent scoring.
- **Graph Analysis:** NetworkX for computing centrality and clustering in the fraud network.

## 3. The Hybrid Risk Engine Pipeline
1. **Input:** Simulated Audio / Transcript Stream
2. **Phrase Detector:** Regex matches against 200+ categorized scam phrases (English/Hinglish).
3. **Coercion Scorer:** Analyzes the density of fear, urgency, and isolation tactics.
4. **Kill-Chain Mapper:** Determines if the scam has progressed from Impersonation -> Payment.
5. **Entity Extraction:** Pulls UPI IDs, phone numbers, and amounts.
6. **Risk Aggregation:** Computes a final deterministic 0-100 score based on weighted inputs.

## 4. AI Triage Layer (Optional)
- **Provider:** OpenRouter (GPT-4o-mini)
- **Function:** Reads the raw transcript and JSON entities to draft a concise, human-readable summary.
- **Fail-safe:** If the API key is missing, times out, or fails, the system instantly falls back to a deterministic, rule-based text summary generator so the UI never breaks.
