# Suraksha Setu — Product journey redesign

## Goal
Start with the citizen's decision rather than a fraud investigation dashboard.

## Public journey
1. **Home** (/): one explanation and three starting choices.
2. **Get help** (/help): urgent guidance by situation (threatened, sent money, account access exposed, uncertain). Direct links to 1930, 112 and the official NCRP.
3. **Check** (/check): enter the minimum safe text, choose channel and whether money was sent; browser-side rule matching via the existing TRACE engine; plain-language indicators, limitations and relevant next actions.
4. **My reports** (/reports): optional opt-in browser-only drafts, searchable; download text summaries or delete all local drafts.
5. **Explore prototype** (/lab): technical demonstrations separated from the citizen task flow.

## Legacy technical routes preserved
- /shield — synthetic transcript replay
- /trace — evidence correction and inter-case relationship research
- /dashboard — synthetic network/map views
- /evidence — fictional benchmark and sample report generation

## Product integrity
- No live call interception.
- No actual payment blocking, bank/telecom escalation or official complaint filing.
- The score is a deterministic indicator, **not** a fraud probability.
- Browser storage is explicitly opt-in, local and **unencrypted**.
- The service does not require account registration for the main experience.
- Never enter passwords, OTPs or other financial secrets in the text form.
- The application's guidance links to India's official reporting channels; this is not itself a government service.

## Acceptance checklist
- Navigation works on mobile and desktop.
- A person who already sent money can reach 1930 directly without using the scanner.
- A suspicious transcript yields source-linked signs and clear next steps.
- A user can save a draft only after affirming the browser privacy warning.
- Draft persists across refresh on the same browser, can be downloaded and deleted.
- No-result copy avoids declaring the caller "safe".
- Advanced simulations are visibly labelled and remain accessible.
- `npm ci && npm run build` succeeds within frontend.

## Next production work
Before handling real incidents: secure authenticated data storage, consent and retention controls, PII minimisation and masking, independent multilingual detection validation, accessibility testing with users, verified transaction receipts, authorised agency integrations and end-to-end tests.
