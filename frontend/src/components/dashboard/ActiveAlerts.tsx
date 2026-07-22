'use client';
import { useState } from 'react';
import { ShieldAlert, AlertCircle, Clock, MapPin } from 'lucide-react';
import { ACTIVE_ALERTS } from '@/lib/mock-data';
import TakedownModal from './TakedownModal';

export default function ActiveAlerts() {
  const [activeTakedownId, setActiveTakedownId] = useState<string | null>(null);

  return (
    <div className="glass-panel rounded-xl border border-slate-800 flex flex-col shadow-xl h-full">
       <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-slate-200 flex items-center gap-2 text-sm uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" /> Active Threat Feed
          </h3>
          <span className="bg-red-500/20 text-red-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-red-500/30">
            {ACTIVE_ALERTS.length} LIVE
          </span>
       </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[360px]">
          {ACTIVE_ALERTS.map((alert, i) => {
            const timeStr = i === 0 ? '2m ago' : i === 1 ? '15m ago' : '34m ago';
            return (
              <div 
                key={alert.id} 
                className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-lg flex flex-col gap-2 relative overflow-hidden"
              >
                 <div className="flex justify-between items-start mb-1.5">
                   <span className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                     <AlertCircle className="w-3 h-3 text-red-500" />
                     {alert.title}
                   </span>
                   <span className="text-[10px] font-mono text-slate-500 flex items-center gap-0.5">
                     <Clock className="w-2.5 h-2.5" />
                     {timeStr}
                   </span>
                 </div>
                 <p className="text-[11px] text-slate-400 leading-relaxed">{alert.message}</p>
                 <div className="flex items-center justify-between mb-1 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/50 text-red-400 border border-red-500/20 font-mono font-medium">
                      RISK: {alert.riskScore}%
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5 font-mono">
                      <MapPin className="w-3 h-3 text-slate-500" /> {alert.city}
                    </span>
                 </div>
                 
                 {alert.riskScore > 90 && (
                   <button 
                    onClick={() => setActiveTakedownId(alert.id)}
                    className="w-full mt-2 py-1.5 rounded bg-red-600/10 hover:bg-red-600 border border-red-600/30 text-red-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider flex justify-center items-center gap-1.5 shadow-[0_0_15px_rgba(220,38,38,0.15)] hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] group"
                   >
                     <ShieldAlert className="w-3 h-3 group-hover:animate-pulse" /> Prepare Escalation Package
                   </button>
                 )}
              </div>
            );
          })}
       </div>

       <TakedownModal 
         isOpen={!!activeTakedownId}
         onClose={() => setActiveTakedownId(null)}
         caseId={activeTakedownId || ''}
       />
    </div>
  );
}
