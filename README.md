# SurakshaNet AI 🛡️

**Real-Time Digital Arrest Scam Interception & Fraud Network Intelligence**

SurakshaNet AI is an evidence-grade AI interception layer that detects active digital arrest scams *before* payment, alerts victims and trusted contacts, maps fraud networks, and creates legally usable investigation packets for law enforcement.

## Why SurakshaNet AI?

Most solutions try to block scam calls *after* the fact or rely on simple blacklists. SurakshaNet AI operates **during the call**, detecting the exact psychological stages of a "Digital Arrest" scam and intercepting the transaction before the victim loses their life savings.

### The 6-Stage Scam "Kill Chain"

Our hybrid AI engine doesn't just return a binary "scam/safe". It tracks the exact progression of a digital arrest:
1. **Authority Impersonation** (CBI, ED, Customs)
2. **Fear Creation** (Arrest warrants, FIRs)
3. **Victim Isolation** ("Don't tell anyone", "Stay on video")
4. **Continuous Control** (Surveillance and psychological breakdown)
5. **Payment Extraction** ("Verification deposit", "Security amount")
6. **Mule Account Laundering**

## Core Modules

### 1. Citizen Shield (Live Interception)
Monitors live audio/text, detecting high-risk phrase patterns, urgency markers, and isolation tactics in real-time. When risk hits critical thresholds, a full-screen interception warning activates, blocking payment flows and alerting trusted contacts.

### 2. Voice Authenticity Engine
Analyzes spectral flatness, pitch variance, and zero-crossing rates to determine if the caller's voice is human or AI-generated, catching sophisticated voice clones.

### 3. Geospatial Threat Dashboard
Law enforcement dashboard displaying real-time scam clusters across India, highlighting hotspots and active operations.

### 4. Fraud Network Graph
Links phones, UPI IDs, bank accounts, and victim profiles into actionable network graphs, exposing the mule accounts connecting different scam rings.

### 5. Evidence Generation
Automatically compiles transcripts, extracted entities, risk timelines, and voice analysis into a structured PDF evidence packet for immediate FIR filing.

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, shadcn/ui, React Flow (Graphs), Recharts
- **Backend Core**: Python, FastAPI, SQLite (Dev)
- **AI/ML Engine**: 
  - Hybrid rules + NLP Coercion scoring
  - `librosa` (Spectral voice feature extraction)
  - HuggingFace `Wav2Vec2` (Audio deepfake detection)

## Getting Started

### 1. Frontend (Standalone Demo Mode)
The frontend ships with a comprehensive mock data engine containing 20 pre-analyzed demo scenarios (both scams and legitimate calls). 

```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000`

### 2. Backend API
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Hackathon Pitch Strategy
Do not frame this as a "scam chatbot". Position it as an **interception and intelligence platform**. Emphasize the "Kill Chain" stage detection and the Evidence PDF generation — these address the exact legal and technical realities of cybercrime that most competitors ignore.
