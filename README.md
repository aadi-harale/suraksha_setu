# SurakshaNet AI — Digital Scam War Room

## One-Line Pitch
Real-time digital arrest scam intervention, fraud-network intelligence, and complaint-ready reporting.

## Problem
Fraudsters impersonate police, CBI, ED, customs, or banks to create fear. They isolate victims, keep them on continuous audio/video calls, and pressure them into transferring "security deposits" or "bail amounts" to mule accounts. This is known as a "Digital Arrest" scam.

## Solution
SurakshaNet AI detects coercive scam patterns during a simulated live call, maps the scam kill-chain, warns the victim before payment, links suspicious entities through fraud graph intelligence, and generates complaint-ready, tamper-evident case packets.

## Key Features
- Citizen Shield live interception demo
- Digital arrest kill-chain mapping
- 5-tier risk meter
- Reality Check: "Digital arrest does not exist"
- Payment block simulation
- Trusted contact alert simulation
- Mock suspect repository check
- Fraud network graph
- Geospatial threat dashboard
- Scam Script DNA
- Campaign lead-time intelligence
- False-positive defense layer
- Complaint-ready NCRP/1930 export
- Tamper-evident investigation packet
- Optional OpenRouter AI triage with deterministic fallback

## Tech Stack
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- lucide-react
- @xyflow/react
- deck.gl / maplibre-gl / react-map-gl
- @react-pdf/renderer
- FastAPI
- SQLModel / SQLite
- NetworkX
- Optional OpenRouter API

## Architecture
Input transcript/audio simulation → hybrid risk engine → kill-chain mapper → entity extraction → suspect repository mock lookup → citizen intervention → fraud graph/dashboard → complaint-ready packet.

## Demo Flow
1. Start 3-Minute Judge Demo
2. Transcript appears
3. Risk rises
4. Kill-chain progresses
5. Reality Check appears
6. Suspect UPI is flagged
7. Payment block simulation triggers
8. Trusted contact alert simulation appears
9. Dashboard shows campaign intelligence
10. Evidence page generates complaint-ready packet

## Setup Instructions

**Frontend (Standalone Demo - Recommended)**
```bash
cd frontend
npm install
npm run dev
```

**Backend (Optional API)**
```bash
cd backend
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

*Note: The frontend demo runs standalone with mock data. The backend API is optional for advanced testing.*

## Optional AI Setup
To enable live AI triage summaries, create `.env.local` in the `frontend` directory:
```
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
```
*Note: The app works perfectly without OpenRouter using a deterministic fallback output.*

## Prototype Scope
**Working in prototype:**
- Transcript simulation
- Risk scoring
- Kill-chain mapping
- Entity extraction
- Mock suspect lookup
- Fraud graph visualization
- Geospatial dashboard
- Complaint-ready export
- AI triage fallback

**Simulated for Demo:**
- Bank review escalation
- Telecom escalation
- Trusted contact SMS
- NCRP/1930 submission
- Government repository lookup
- Multi-agency escalation

## Disclaimer
This is a hackathon prototype. It is not connected to real police, banks, telecom providers, or government systems. All generated documents are drafts and require review by authorized personnel. Audio anomaly scores are supporting signals only and do not constitute absolute proof of synthetic voice.
