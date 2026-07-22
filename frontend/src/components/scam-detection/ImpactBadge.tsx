'use client';

import { ShieldCheck, Clock, TrendingDown } from 'lucide-react';

export default function ImpactBadge({ currentRiskScore }: { currentRiskScore: number }) {
  if (currentRiskScore < 75) return null;

  return (
    <div className="glass-panel rounded-xl border border-emerald-500/30 p-5 shadow-lg bg-emerald-950/20">
      <h3 className="text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wider flex items-center gap-2">
        <ShieldCheck className="w-4 h-4" /> Interception Impact
      </h3>
      
      <div className="space-y-3">
        <div>
          <p className="text-xs text-slate-400">Detection Stage</p>
          <p className="text-sm font-medium text-white">Stage 3 — Victim Isolation</p>
          <p className="text-[10px] text-emerald-500 mt-0.5">Predicted Payment Stage Before It Happened</p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1 bg-black/40 rounded p-2 border border-emerald-500/20">
            <p className="text-[10px] text-slate-400 flex items-center gap-1"><TrendingDown className="w-3 h-3 text-emerald-500" /> Loss Prevented</p>
            <p className="text-lg font-bold text-emerald-400">₹48,000</p>
          </div>
          <div className="flex-1 bg-black/40 rounded p-2 border border-emerald-500/20">
            <p className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-500" /> Intervention Time</p>
            <p className="text-lg font-bold text-emerald-400">42s</p>
          </div>
        </div>
      </div>
    </div>
  );
}
