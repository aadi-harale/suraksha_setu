"""
SurakshaNet AI — Application Entry Point
==========================================
FastAPI application with CORS, lifespan management, and router registration.

Run with:
    uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.models.database import create_db_and_tables, get_engine
from backend.routers import cases, detection, graph
from backend.routers.graph import set_fraud_graph

# ─── Logging ─────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(name)-24s  %(levelname)-7s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("suraksha.main")


# ─── Lifespan (startup / shutdown) ───────────────────────────────────────────


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup sequence:
      1. Initialise the SQLite database and tables.
      2. Load demo scenarios into memory.
      3. Build the initial fraud graph from synthetic seed data.
      4. Seed known-bad entities into the risk scorer.
    """
    logger.info("🚀  SurakshaNet AI starting up …")

    # 1. Database
    engine = get_engine()
    create_db_and_tables(engine)
    logger.info("✅  Database initialised")

    # 2–4. Seed data (imported lazily to avoid circular deps if modules
    #       are not yet present during early development).
    try:
        from backend.data.seed_data import (
            build_fraud_graph,
            load_demo_scenarios,
            seed_database,
            load_synthetic_graph,
        )

        # Load scenarios
        scenarios = load_demo_scenarios()
        logger.info("✅  Loaded %d demo scenarios", len(scenarios))

        # Seed DB with sample cases / entities / alerts
        seed_database(engine)
        logger.info("✅  Database seeded")

        # Build and install fraud graph
        graph_data = load_synthetic_graph()
        fraud_g = build_fraud_graph(graph_data)
        set_fraud_graph(fraud_g)
        logger.info(
            "✅  Fraud graph built — %d nodes, %d edges",
            fraud_g.number_of_nodes(),
            fraud_g.number_of_edges(),
        )

    except ImportError as exc:
        logger.warning(
            "⚠️  Seed-data module not available yet — skipping seeding (%s)", exc
        )
    except Exception as exc:
        logger.warning(
            "⚠️  Seed-data loading failed — the API will still start (%s)", exc
        )

    # Initialise risk scorer with known-bad entities
    try:
        from backend.engine.risk_scorer import HybridRiskScorer
        from backend.routers.detection import set_scorer

        scorer = HybridRiskScorer()
        try:
            from backend.data.seed_data import load_demo_scenarios

            scenarios = load_demo_scenarios()
            bad_entities: dict[str, list[str]] = {}
            for s in scenarios:
                if s.get("is_scam"):
                    for etype, values in s.get("entities", {}).items():
                        bad_entities.setdefault(etype, []).extend(values)

            if hasattr(scorer, "seed_known_entities"):
                scorer.seed_known_entities(bad_entities)
                logger.info("✅  Seeded %d entity types into risk scorer",
                            len(bad_entities))
        except Exception:
            pass

        set_scorer(scorer)
        logger.info("✅  HybridRiskScorer ready")

    except ImportError as exc:
        logger.warning(
            "⚠️  Risk scorer not available yet — detection endpoints will fail (%s)",
            exc,
        )

    logger.info("🟢  SurakshaNet AI is ready to serve requests")

    yield  # ← application runs here

    logger.info("🔴  SurakshaNet AI shutting down …")


# ─── App Instance ────────────────────────────────────────────────────────────

app = FastAPI(
    title="SurakshaNet AI API",
    description=(
        "Digital Arrest Scam Detection & Fraud Intelligence Platform.\n\n"
        "SurakshaNet AI intercepts digital-arrest scams in real time using "
        "hybrid NLP risk scoring, kill-chain stage modelling, and fraud "
        "network graph intelligence.  This API powers the analyst dashboard "
        "and provides law-enforcement evidence packets."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS (allow all origins during development) ─────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────

app.include_router(detection.router)
app.include_router(graph.router)
app.include_router(cases.router)


# ─── Root & Health ───────────────────────────────────────────────────────────


@app.get("/", tags=["Meta"], summary="Welcome")
async def root():
    """Landing page with API overview."""
    return {
        "service": "SurakshaNet AI",
        "version": "1.0.0",
        "description": "Digital Arrest Scam Detection & Fraud Intelligence Platform",
        "docs": "/docs",
        "health": "/api/health",
    }


@app.get("/api/health", tags=["Meta"], summary="Health check")
async def health():
    """Lightweight liveness probe."""
    return {"status": "healthy", "service": "suraksha-ai", "version": "1.0.0"}
