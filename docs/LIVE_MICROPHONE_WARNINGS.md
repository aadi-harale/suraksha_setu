# Suraksha Setu: Live Microphone Warning Mode (Beta)

## Goal
Turn the PPT's **proposed real-time listening and warning** into a limited but functional browser experience without misrepresenting what a website can do.

## Working entry points
- Home: **Open live warnings**
- Top navigation: **Live warnings**
- Text checker: optional **live microphone warnings** link
- Route: \`/listen\`

## What actually works
1. The user opens the live warning page, reviews browser/third-party processing risk, and explicitly checks a consent box.
2. Clicking **Start microphone listening** uses \`SpeechRecognition\` or \`webkitSpeechRecognition\`, when available. No microphone activation happens on page load. The browser requests permission separately.
3. The browser reports interim and final speech-to-text results. Source text is evaluated against deterministic, inspectable warning cues for digital-arrest pressure, isolation, demands for payment, OTP disclosure and remote access.
4. The app displays an **on-screen safety warning** with matching source excerpt, TRACE evidence ID and revision, plus actionable advice. Risk score is neither independently calibrated nor a probability.
5. Users may separately permit **desktop notification warnings**. Alerts contain only generic text and are only sent for final high/critical cues; interim phrases are flagged provisional in the page.
6. The user can **Stop**, **Clear**, or **Continue to case review**. Continuing explicitly copies the transcript to **temporary same-tab session storage** and the text checker immediately consumes/deletes it; saving a case still requires a second opt-in for unencrypted browser-local storage.
7. A completely separate **fictional demo** can show warning output when the browser does not support speech recognition. It does not activate the microphone.

## What is *not* implemented
- Tapping into live PSTN, WhatsApp or other phone-call audio using OS call APIs.
- Guaranteeing that microphone sound contains both parties on a phone call (OS/browser routing may prevent it). External speakerphone on a separate device may help, with everyone's consent.
- Recording or uploading original audio to an application-controlled backend.
- Guaranteed local transcription. On some browsers, speech is sent to a **browser vendor/cloud recognition service**; check each browser's privacy policy.
- Background listening while the page is hidden. The app explicitly aborts listening when hidden.
- Fraud-proof classification, calibrated alerts, accurate multilingual decoding, bank transaction interception or payment reversal.
- Sending SMS to trusted contacts or integrating with cybercrime/government systems.
- Cryptographically authenticated third-party intervention receipts; the TRACE proof-of-intervention design still needs a real integration.

## Threat and privacy notes
Speech transcripts are maintained in browser memory during an active session. The application does not persist them without user action, but the browser speech service may transmit audio or process it externally. Browser desktop notifications are opt-in, generic, and never contain transcript details. The user should avoid sharing OTPs, passwords and bank identifiers through any untrusted channel.

## Verification
- \`cd frontend && npm ci && npm run build\`
- Optional pattern tests with a TypeScript-capable test runner: \`npx tsx --test src/lib/live-warnings.test.ts\`.
- Manual acceptance test in a speech-enabled desktop browser: explicitly grant mic access, say “You are under digital arrest. Do not tell your family. Transfer fifty thousand rupees”, observe warnings and text; stop; continue to review; verify the report is not saved unless consented; clear browser.
- Unsupported browser: check for a clear explanation and functioning text-check fallback.
- Confirm that the original /shield and /trace routes still work.

## Patent and presentation
The **single proposed novelty** remains TRACE: evidence-dependent correction and verifiable intervention-state accountability. Microphone listening and early-warning banners are **application features**, not a separate patent claim of novelty. This release supplies a beta live microphone pathway; it does **not** implement call interception or validated prevention.
