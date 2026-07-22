"""
SurakshaNet AI — Fraud Graph Router
=====================================
Endpoints for querying, expanding, and clustering the fraud-intelligence
knowledge graph backed by NetworkX and community detection (Louvain).
"""

from __future__ import annotations

import logging
from typing import Any, Optional

import networkx as nx

try:
    import community as community_louvain  # python-louvain
except ImportError:  # pragma: no cover
    community_louvain = None  # type: ignore[assignment]

from fastapi import APIRouter, HTTPException

from backend.models.schemas import GraphData, GraphEdge, GraphNode

logger = logging.getLogger("suraksha.graph")

router = APIRouter(prefix="/api", tags=["Fraud Graph"])

# ─── Module-level graph state ────────────────────────────────────────────────

fraud_graph: Optional[nx.Graph] = None


def get_fraud_graph() -> nx.Graph:
    """Return the current fraud graph, creating an empty one if needed."""
    global fraud_graph
    if fraud_graph is None:
        fraud_graph = nx.Graph()
    return fraud_graph


def set_fraud_graph(graph: nx.Graph) -> None:
    """Replace the module-level fraud graph (called at startup)."""
    global fraud_graph
    fraud_graph = graph


# ─── Helpers ─────────────────────────────────────────────────────────────────


def _graph_to_data(g: nx.Graph) -> GraphData:
    """Serialise a NetworkX graph into the GraphData schema."""
    nodes: list[GraphNode] = []
    for node_id, attrs in g.nodes(data=True):
        nodes.append(
            GraphNode(
                id=str(node_id),
                type=attrs.get("type", "unknown"),
                value=attrs.get("value", str(node_id)),
                risk_level=attrs.get("risk_level", "unknown"),
                cluster=attrs.get("cluster", 0),
                extra={
                    k: v
                    for k, v in attrs.items()
                    if k not in {"type", "value", "risk_level", "cluster"}
                },
            )
        )

    edges: list[GraphEdge] = []
    for src, tgt, attrs in g.edges(data=True):
        edges.append(
            GraphEdge(
                source=str(src),
                target=str(tgt),
                relationship=attrs.get("relationship", "linked"),
            )
        )

    return GraphData(nodes=nodes, edges=edges)


def _run_community_detection(g: nx.Graph) -> dict[str, int]:
    """Run Louvain community detection and tag nodes with cluster IDs."""
    if community_louvain is None:
        logger.warning("python-louvain not installed — skipping community detection")
        return {}

    if g.number_of_nodes() == 0:
        return {}

    partition: dict[str, int] = community_louvain.best_partition(g)

    # Write cluster assignments back into node attributes
    for node_id, cluster_id in partition.items():
        if node_id in g.nodes:
            g.nodes[node_id]["cluster"] = cluster_id

    return partition


# ─── GET /api/graph ──────────────────────────────────────────────────────────


@router.get(
    "/graph",
    response_model=GraphData,
    summary="Retrieve the full fraud-intelligence graph",
)
async def get_graph() -> GraphData:
    """Return every node and edge in the current fraud graph."""
    g = get_fraud_graph()
    return _graph_to_data(g)


# ─── GET /api/graph/clusters ─────────────────────────────────────────────────


@router.get(
    "/graph/clusters",
    summary="Run community detection and return cluster analysis",
)
async def get_clusters() -> dict[str, Any]:
    """
    Perform Louvain community detection on the fraud graph and return a
    structured breakdown of clusters, their member nodes, and inter-cluster
    edges.
    """
    g = get_fraud_graph()

    if g.number_of_nodes() == 0:
        return {"clusters": [], "inter_cluster_edges": [], "modularity": 0.0}

    partition = _run_community_detection(g)

    if not partition:
        return {"clusters": [], "inter_cluster_edges": [], "modularity": 0.0}

    # Build per-cluster summaries
    cluster_map: dict[int, list[dict[str, Any]]] = {}
    for node_id, cluster_id in partition.items():
        attrs = g.nodes.get(node_id, {})
        entry = {
            "id": str(node_id),
            "type": attrs.get("type", "unknown"),
            "value": attrs.get("value", str(node_id)),
            "risk_level": attrs.get("risk_level", "unknown"),
        }
        cluster_map.setdefault(cluster_id, []).append(entry)

    clusters = [
        {"cluster_id": cid, "size": len(members), "nodes": members}
        for cid, members in sorted(cluster_map.items())
    ]

    # Identify inter-cluster edges
    inter_cluster_edges: list[dict[str, Any]] = []
    for src, tgt, attrs in g.edges(data=True):
        src_cluster = partition.get(src, -1)
        tgt_cluster = partition.get(tgt, -1)
        if src_cluster != tgt_cluster:
            inter_cluster_edges.append(
                {
                    "source": str(src),
                    "target": str(tgt),
                    "relationship": attrs.get("relationship", "linked"),
                    "source_cluster": src_cluster,
                    "target_cluster": tgt_cluster,
                }
            )

    # Compute modularity
    try:
        modularity = community_louvain.modularity(partition, g)
    except Exception:
        modularity = 0.0

    return {
        "clusters": clusters,
        "inter_cluster_edges": inter_cluster_edges,
        "modularity": round(modularity, 4),
    }


# ─── POST /api/graph/add-case ────────────────────────────────────────────────


@router.post(
    "/graph/add-case",
    summary="Ingest case entities into the fraud graph",
)
async def add_case_to_graph(entities: dict[str, list[str]]) -> dict[str, Any]:
    """
    Accept a dict of ``{entity_type: [values …]}`` from a detection result,
    create or merge nodes and edges, and return updated graph statistics.
    """
    g = get_fraud_graph()

    new_nodes: list[str] = []
    new_edges: list[tuple[str, str]] = []

    # Flatten all entity values
    all_entity_ids: list[str] = []

    for entity_type, values in entities.items():
        for value in values:
            node_id = f"{entity_type}:{value}"
            all_entity_ids.append(node_id)

            if node_id not in g.nodes:
                g.add_node(
                    node_id,
                    type=entity_type,
                    value=value,
                    risk_level="unknown",
                    cluster=0,
                )
                new_nodes.append(node_id)

    # Create edges between co-occurring entities (fully connected within case)
    for i, src in enumerate(all_entity_ids):
        for tgt in all_entity_ids[i + 1 :]:
            if not g.has_edge(src, tgt):
                g.add_edge(src, tgt, relationship="co_occurred", weight=1)
                new_edges.append((src, tgt))
            else:
                # Strengthen existing edge
                g[src][tgt]["weight"] = g[src][tgt].get("weight", 1) + 1

    return {
        "new_nodes": len(new_nodes),
        "new_edges": len(new_edges),
        "total_nodes": g.number_of_nodes(),
        "total_edges": g.number_of_edges(),
    }


# ─── GET /api/graph/entity/{entity_id} ──────────────────────────────────────


@router.get(
    "/graph/entity/{entity_id}",
    summary="Retrieve entity details and connections",
)
async def get_entity(entity_id: str) -> dict[str, Any]:
    """
    Return the attributes and immediate neighbours of a specific graph node.
    The ``entity_id`` is expected in ``type:value`` format.
    """
    g = get_fraud_graph()

    if entity_id not in g.nodes:
        raise HTTPException(
            status_code=404,
            detail=f"Entity '{entity_id}' not found in graph.",
        )

    attrs = dict(g.nodes[entity_id])
    neighbours: list[dict[str, Any]] = []

    for neighbour_id in g.neighbors(entity_id):
        edge_data = g[entity_id][neighbour_id]
        neighbour_attrs = g.nodes[neighbour_id]
        neighbours.append(
            {
                "id": str(neighbour_id),
                "type": neighbour_attrs.get("type", "unknown"),
                "value": neighbour_attrs.get("value", str(neighbour_id)),
                "risk_level": neighbour_attrs.get("risk_level", "unknown"),
                "relationship": edge_data.get("relationship", "linked"),
                "weight": edge_data.get("weight", 1),
            }
        )

    return {
        "entity_id": entity_id,
        "attributes": attrs,
        "connections": neighbours,
        "degree": g.degree(entity_id),
    }
