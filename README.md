# SurakshaNet AI — Digital Scam War Room

**Real-Time Digital Arrest Scam Intervention & Fraud Network Intelligence**

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![OpenRouter](https://img.shields.io/badge/OpenRouter-Fallback-blue?style=for-the-badge)
![Hackathon Prototype](https://img.shields.io/badge/Hackathon-Prototype-orange?style=for-the-badge)

- **Live Demo:** [https://suraksha-setu-indol.vercel.app/](https://suraksha-setu-indol.vercel.app/)
- **GitHub Repository:** [https://github.com/aadi-harale/suraksha_setu](https://github.com/aadi-harale/suraksha_setu)
- **Demo Video:** [https://drive.google.com/file/d/1_T2kYNGLl739bIoA0bKhXFWXWVkulMsD/view?usp=drive_link](https://drive.google.com/file/d/1_T2kYNGLl739bIoA0bKhXFWXWVkulMsD/view?usp=drive_link)


SurakshaNet AI is a real-time digital arrest scam intervention and fraud intelligence platform that detects coercive scam patterns during calls, warns victims before payment, links suspicious entities through fraud graph intelligence, and generates complaint-ready, tamper-evident case packets for cybercrime triage.

---

## 1. Problem
Fraudsters impersonate police, CBI, ED, customs, banks, or cybercrime officials. They create fear, isolate victims, force them to stay on calls or video calls, and pressure them into transferring money for “verification” or “security deposit.” 

The key challenge is not only detecting scams after complaints, but intervening before payment.

## 2. Solution
SurakshaNet AI simulates real-time scam-call monitoring, detects coercive patterns, maps the scam kill-chain, warns the victim, blocks a simulated payment, checks suspicious entities against a mock complaint repository, links fraud networks, and creates complaint-ready reports.

## 3. Key Features
- Citizen Shield live interception demo
- Digital arrest kill-chain mapping
- 5-tier risk meter
- Reality Check panel: “Digital arrest does not exist”
- Simulated UPI payment block
- Trusted contact alert simulation
- Mock suspect repository check
- Fraud network graph
- Geospatial threat dashboard
- Scam Script DNA
- Campaign lead-time intelligence
- False-positive defense layer
- Complaint-ready NCRP/1930 export
- Tamper-evident investigation packet
- Optional OpenRouter AI triage with fallback

## 4. Demo Flow
1. Start 3-Minute Judge Demo
2. Scam transcript appears line by line
3. Risk score rises
4. Kill-chain progresses
5. Reality Check appears
6. Suspicious UPI is flagged
7. Simulated payment attempt appears
8. Payment block triggers
9. Trusted contact alert simulation appears
10. Investigator dashboard shows fraud cluster
11. Evidence page generates complaint-ready packet

## 5. Architecture
Input Transcript / Audio Simulation 
→ Hybrid Risk Engine 
→ Phrase + Coercion Detection 
→ Kill-Chain Mapper 
→ Entity Extraction 
→ Mock Suspect Repository Check 
→ Citizen Intervention 
→ Fraud Graph + Geospatial Dashboard 
→ Complaint-Ready Evidence Packet

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
