import { CheckCircle2, ShieldAlert } from 'lucide-react';

export default function PrototypeScopeCard() {
  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-6 shadow-xl mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-300">
        <ShieldAlert className="w-5 h-5 text-indigo-400" /> Prototype Scope
      </h3>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">Working in Prototype</h4>
          <ul className="text-sm text-slate-300 space-y-2">
            <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Transcript simulation</li>
            <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Hybrid risk scoring</li>
            <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Kill-chain mapping</li>
            <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Entity extraction</li>
            <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Mock suspect lookup</li>
            <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Fraud graph visualization</li>
            <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Geospatial dashboard</li>
            <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Complaint-ready export</li>
            <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> AI triage fallback</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">Simulated for Demo</h4>
          <ul className="text-sm text-slate-400 space-y-2 italic">
            <li className="flex gap-2 items-start"><span className="w-4 h-4 shrink-0 flex items-center justify-center text-amber-500/70 text-xs">◆</span> Bank/NPCI review</li>
            <li className="flex gap-2 items-start"><span className="w-4 h-4 shrink-0 flex items-center justify-center text-amber-500/70 text-xs">◆</span> Telecom escalation</li>
            <li className="flex gap-2 items-start"><span className="w-4 h-4 shrink-0 flex items-center justify-center text-amber-500/70 text-xs">◆</span> Trusted contact SMS</li>
            <li className="flex gap-2 items-start"><span className="w-4 h-4 shrink-0 flex items-center justify-center text-amber-500/70 text-xs">◆</span> NCRP/1930 submission</li>
            <li className="flex gap-2 items-start"><span className="w-4 h-4 shrink-0 flex items-center justify-center text-amber-500/70 text-xs">◆</span> Government repository lookup</li>
            <li className="flex gap-2 items-start"><span className="w-4 h-4 shrink-0 flex items-center justify-center text-amber-500/70 text-xs">◆</span> Multi-agency escalation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
