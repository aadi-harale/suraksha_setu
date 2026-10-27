# TRACE research implementation

This branch adds an evidence-bound, reversible analysis demonstrator at /trace.

## Supported workflow
- Add synthetic evidence, assess source-linked indicators, and see tentative case correlations.
- Revise or withdraw a source using optimistic revision checks.
- Recompute case links and identify removed or added relationships.
- Mark earlier evidence packets superseded and earlier interventions as requiring review.
- Generate SHA-256 snapshot digests (not signatures, legal evidence certification, or notarization).
- Record recommended/requested/acknowledged/confirmed/failed/expired intervention states in the domain engine.

## Scope and safety
The interface does not monitor calls or block money transfers. It holds unsaved, fictional case data in browser memory. The engine is a deterministic heuristic and the numerical score is NOT a calibrated probability of fraud. Shared UPI IDs or script indicators are tentative hypotheses and are not proof of misconduct. Payment or telecom action cannot be confirmed without an externally supplied verified provider receipt, and no such provider adapter is connected. A SHA-256 digest alone does not establish provenance or legal admissibility. An exported copy is not remotely revocable when the in-memory validity marker changes.

## Local verification

Run a production Next.js build after installing dependencies:

    cd frontend
    npm ci
    npm run build

A production integration requires authenticated storage, privacy review, real signed receipt validation, transaction binding, independent detection benchmarking, persisted audit history, and reviewed notification delivery. Patent claims should distinguish implemented functionality from proposed enhancements.
