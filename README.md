# Suraksha Setu AI — Guided Scam Safety & TRACE

**Permission-based live microphone warning beta · Evidence-linked TRACE research · Citizen case preparation**

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![OpenRouter](https://img.shields.io/badge/OpenRouter-Fallback-blue?style=for-the-badge)
![Hackathon Prototype](https://img.shields.io/badge/Hackathon-Prototype-orange?style=for-the-badge)

- **Live Demo:** [https://suraksha-setu-indol.vercel.app/](https://suraksha-setu-indol.vercel.app/)
- **GitHub Repository:** [https://github.com/aadi-harale/suraksha_setu](https://github.com/aadi-harale/suraksha_setu)
- **Demo Video:** [https://drive.google.com/file/d/1_T2kYNGLl739bIoA0bKhXFWXWVkulMsD/view?usp=drive_link](https://drive.google.com/file/d/1_T2kYNGLl739bIoA0bKhXFWXWVkulMsD/view?usp=drive_link)


Suraksha Setu is a cyber-fraud safety prototype with guided text checks, a **browser microphone listening beta**, fictional case walkthroughs and evidence-linked TRACE analysis. With explicit permission, supported browsers convert nearby speech to text and the application shows immediate on-screen warning messages for configured coercion/payment patterns. The application does **not** directly intercept PSTN or WhatsApp calls or block real payments. Browser speech recognition may send audio to the browser vendor's transcription service. Results are rule-based indicators, not calibrated fraud probabilities.

---

## 1. Problem
Fraudsters impersonate police, CBI, ED, customs, banks, or cybercrime officials. They create fear, isolate victims, force them to stay on calls or video calls, and pressure them into transferring money for “verification” or “security deposit.” 

The key challenge is not only detecting scams after complaints, but intervening before payment.

## 2. Solution
The primary citizen journey is **Home → permission-based live listening (optional) or text check → source-linked warning explanations → opt-in personal case draft → independent official reporting**. Advanced tools include fictional call replay, TRACE evidence correction, graph correlations, and synthetic investigation dashboards.

## 3. Key Features
- Opt-in browser microphone speech-to-text and immediate on-screen scam warnings (`/listen`, beta)
- Optional browser desktop notification messages for high/critical cues
- Evidence-referenced warning snippets and transcript-to-case handoff
- Fictional prerecorded Citizen Shield replay (`/shield`)
- Digital arrest kill-chain mapping
- 5-tier risk meter
- Reality Check panel: “Digital arrest does not exist”
- Simulated payment-blocking scenario (no real transaction is affected)
- Trusted contact alert simulation
- Mock suspect repository check
- Fraud network graph
- Geospatial threat dashboard
- Scam Script DNA
- Campaign lead-time intelligence
- False-positive defense layer
- Personal text report draft and links to official NCRP/1930 reporting (no direct filing)
- SHA-256 demonstration packet digest (not a legal signature or third-party attestation)
- Optional OpenRouter AI triage with fallback

## 4. Citizen Workflow
1. Select **Live warnings** or **Text check** from the homepage.
2. Live mode: read the disclosure, consent, explicitly start speech recognition and observe warning messages as speech is transcribed. Browser support varies.
3. Choose **Continue to case review** to transfer the transcript through a temporary, consumed session-storage handoff.
4. Review why the rules fired and select safer actions. A lower score is **not** proof a caller is legitimate.
5. Save a personal draft only with separate opt-in; drafts use unencrypted browser storage and can be exported or deleted.
6. Open official guidance and independently contact 1930 or cybercrime.gov.in if required.

The historical `/shield` fictional call-replay and `/trace` investigation demonstrator remain available under `/lab`.

## 5. Architecture
**Live beta:** explicit consent → browser microphone recognition (potentially vendor-hosted) → interim/final transcript → deterministic pressure/credential/payment cues → on-screen warning with source excerpt and TRACE evidence revision → optional generic desktop notification → user-initiated case-review handoff → opt-in draft / external reporting.

**TRACE research:** evidence source and revision → heuristic assessment → tentative fraud relationship → correction/withdrawal → dependent-link recomputation → mark prior packet superseded → maintain separate intervention request/acknowledgment/verification states.

**Single proposed novelty:** evidence-bound correction propagation combined with verifiable intervention accountability. The microphone mode is a product feature rather than a standalone novelty claim.

## 6. Tech Stack
**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- lucide-react
- React Flow / @xyflow/react
- Deck.gl / MapLibre / react-map-gl
- Recharts
- React PDF

**Backend:**
- Python
- FastAPI
- SQLModel / SQLite
- NetworkX
- Regex-based entity extraction
- Hybrid scoring engine

**AI:**
- OpenRouter API for optional case triage
- Deterministic fallback if API key is missing
- LLM is used only for summarization and complaint drafting
- Final risk score is produced by the hybrid signal engine, not the LLM

## 7. Setup Instructions

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

## 8. Optional AI Setup
To enable live AI triage summaries, create `.env.local` in the `frontend` directory:
```
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
```
*Note: The app works perfectly without OpenRouter using a deterministic fallback output.*

## 9. Prototype Scope
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

## 10. Disclaimer
This is a hackathon prototype designed to showcase a theoretical proactive defense system. It is not connected to real police, banks, telecom providers, or government systems. All generated documents are drafts and require review by authorized personnel.
