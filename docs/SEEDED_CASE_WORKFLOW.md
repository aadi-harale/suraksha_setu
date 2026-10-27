# Seeded case workflow (fictional data)

## How to use
1. Home: choose **Walk through example** on any featured case, or open the case workspace.
2. Example cases tab: inspect one of eight **hard-coded, fictional** cases (six suspicious examples and two comparison cases).
3. **Run this example through the checker**: navigate to /check?example=... with transcript and source channel prefilled, and run the existing TRACE rules.
4. The result shows matched sources and a heuristic score. The app explicitly states this is **not a calibrated fraud probability**.
5. For a **real personal draft**, return to the check form, enter your own sanitized description and explicitly consent to browser-local storage.
6. On saving a personal draft the app opens /reports?case=... and selects the saved draft in the **My drafts** tab.
7. Review the draft, export a text copy, and independently contact an official reporting channel. The preparation checklist stores self-reported actions only; no government reporting integration exists.

## Data isolation
- Example cases exist only as source-controlled literals in frontend/src/lib/demo-cases.ts, never written into browser localStorage.
- Personal drafts use browser-local, **unencrypted** storage, are opt-in and may be deleted by clearing browser data. No backend user identity or durable encrypted storage exists.
- The case workspace tabs keep example cases and personal drafts visibly separate.
- Demo account/payment identifiers are fictional @demo handles, not contacts to use or pay.
- No sample claim represents a real victim, transaction or official complaint.

## Verification
- Next.js/Vercel preview build is required before merging.
- Optional TypeScript test runner: npx tsx --test src/lib/demo-cases.test.ts
- Acceptance flow: Home → fictional example → check → review explanation → independently create personal draft → personal workspace → export → official reporting link.
- Bank and police connections, live calls and real payment interception are **not implemented**.
