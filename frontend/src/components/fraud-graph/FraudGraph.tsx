'use client';

import React, { useMemo, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls,
  MarkerType,
  Handle,
  Position,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { GRAPH_NODE_COLORS, GRAPH_NODE_ICONS } from '@/lib/constants';
import { FraudGraphNode } from '@/lib/types';
// We'll import data from mock-data
import { FRAUD_GRAPH_DATA as MOCK_DATA } from '@/lib/mock-data';

// Custom Node Component
const CustomNode = ({ data }: { data: FraudGraphNode }) => {
  const color = GRAPH_NODE_COLORS[data.type] || '#94a3b8';
  const icon = GRAPH_NODE_ICONS[data.type] || '❔';

  return (
    <div 
      className="px-4 py-2 shadow-xl rounded-xl border-2 glass-panel flex flex-col items-center justify-center min-w-[120px] transition-transform duration-300 hover:scale-[1.05]"
      style={{ borderColor: color, boxShadow: `0 0 15px ${color}40` }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#475569' }} />
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-bold text-slate-100 text-xs text-center">{data.value}</div>
      <div className="text-[10px] text-slate-400 uppercase tracking-wider">{data.type}</div>
      
      {data.riskLevel === 'critical' && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: '#475569' }} />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export default function FraudGraph() {
  // Generate initial nodes with positions
  const initialNodes: Node[] = useMemo(() => {
    // Basic layout approximation for 11 nodes (center outward)
    const positions = [
      { x: 300, y: 150 }, // victim (center)
      { x: 150, y: 150 }, // phone (left)
      { x: 150, y: 250 }, // upi (bottom left)
      { x: 150, y: 350 }, // account (far bottom left)
      { x: 150, y: 50 },  // officer (top left)
      { x: 450, y: 150 }, // script (right)
      { x: 300, y: 300 }, // case1
      { x: 450, y: 300 }, // case2
      { x: 300, y: 400 }, // mumbai
      { x: 450, y: 400 }, // pune
      { x: 150, y: 450 }, // jaipur
    ];
    
    return MOCK_DATA.nodes.map((n, i) => ({
      id: n.id,
      type: 'custom',
      position: positions[i % positions.length],
      data: n,
    }));
  }, []);

  // Generate initial edges
  const initialEdges: Edge[] = useMemo(() => {
    return MOCK_DATA.edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.relationship,
      labelStyle: { fill: '#94a3b8', fontSize: 10, fontWeight: 500 },
      labelBgStyle: { fill: '#1e293b', fillOpacity: 0.8 },
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2, filter: 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.8))' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#10b981',
      },
    }));
  }, []);

  return (
    <div className="w-full h-[400px]">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
        className="bg-transparent"
      >
        {/* We use transparent background because layout.tsx has the cyber grid */}
        <Background color="#334155" gap={20} size={2} />
        <Controls className="bg-slate-800 border-slate-700 text-slate-200 fill-slate-200" />
      </ReactFlow>
    </div>
  );
}
