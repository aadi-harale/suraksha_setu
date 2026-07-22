import json
import os
import networkx as nx
from pathlib import Path
from sqlmodel import Session

# Absolute path to data directory
DATA_DIR = Path(__file__).parent

def load_demo_scenarios():
    """Load scenarios from demo_scenarios.json"""
    path = DATA_DIR / "demo_scenarios.json"
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_synthetic_graph():
    """Load graph data from synthetic_graph.json"""
    path = DATA_DIR / "synthetic_graph.json"
    if not path.exists():
        return {"nodes": [], "edges": []}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def build_fraud_graph(graph_data: dict) -> nx.Graph:
    """Build a networkx Graph from the synthetic_graph.json data"""
    G = nx.Graph()
    
    for node in graph_data.get("nodes", []):
        G.add_node(
            node["id"],
            type=node.get("type"),
            value=node.get("value"),
            risk_level=node.get("riskLevel"),
            cluster=node.get("cluster"),
            city=node.get("city", ""),
            bank=node.get("bank", "")
        )
        
    for edge in graph_data.get("edges", []):
        G.add_edge(
            edge["source"], 
            edge["target"], 
            relationship=edge.get("relationship"),
            id=edge.get("id")
        )
        
    return G

def seed_database(engine):
    """Seed the SQLite database with cases, entities, and alerts if empty"""
    from backend.models.database import Case, Entity, Alert
    
    with Session(engine) as session:
        # Check if already seeded
        existing_cases = session.query(Case).first()
        if existing_cases:
            return
            
        # Add basic seed data for demo purposes
        scenarios = load_demo_scenarios()
        for s in scenarios:
            case = Case(
                scenario_id=s["id"],
                transcript=s["transcript"],
                risk_score=s["expected_score"],
                risk_category="Active Digital Arrest Scam" if s.get("is_scam") else "Safe",
                kill_chain_stage=5 if s.get("is_scam") else 0,
                entities_json="{}"
            )
            session.add(case)
            
        session.commit()
