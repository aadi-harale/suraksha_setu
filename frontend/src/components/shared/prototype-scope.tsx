import { Info, Code, PlaySquare } from 'lucide-react';

export default function PrototypeScope() {
  return (
    <div className="absolute bottom-4 left-4 z-50 w-72 bg-slate-900/95 border border-slate-700 rounded-lg shadow-2xl overflow-hidden group">
      <div className="p-2 bg-slate-800/80 border-b border-slate-700 flex items-center gap-2 cursor-help">
        <Info className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-300">Hackathon Prototype Scope</span>
      </div>
      
      {/* Expands on hover */}
      <div className="h-0 group-hover:h-auto group-hover:max-h-96 opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
        <div className="p-4 space-y-4">
          <p className="text-[10px] text-slate-400 italic border-b border-slate-800 pb-2">
            Simulated workflow for hackathon prototype demonstrating UX and business logic.
          </p>

          <div>
            <h4 className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">
              <Code className="w-3.5 h-3.5" /> Working in Prototype
            </h4>
            <ul className="text-[10px] text-slate-300 space-y-1 list-disc ml-4 marker:text-emerald-500/50">
              <li>Hybrid risk scoring engine</li>
              <li>Transcript word-by-word simulation</li>
              <li>Live kill-chain mapping</li>
              <li>Suspect repository mock lookup</li>
              <li>Interactive fraud network graph</li>
              <li>Complaint-ready export (clipboard)</li>
              <li>AI triage logic (with fallback)</li>
              <li>Tamper-evident packet generation</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5 mb-1.5">
              <PlaySquare className="w-3.5 h-3.5" /> Simulated for Demo
            </h4>
            <ul className="text-[10px] text-slate-300 space-y-1 list-disc ml-4 marker:text-indigo-500/50">
              <li>Actual bank review API calls</li>
              <li>Actual telecom escalation API</li>
              <li>Live trusted contact SMS dispatch</li>
              <li>Live NCRP/1930 submission</li>
              <li>Live government repository integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
