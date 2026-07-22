import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DEMO_SCENARIOS } from '@/lib/mock-data';

export default function FalsePositiveQueue() {
  const legitScenarios = DEMO_SCENARIOS.filter(s => !s.isScam);

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-6 shadow-xl mt-6">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-500" /> Legitimate Call Review Queue
      </h3>
      <p className="text-xs text-slate-400 mb-4 italic">
        Demonstrating low false-positive rates. Official and benign calls are evaluated and allowed without unnecessary escalation.
      </p>

      <div className="space-y-3">
        {legitScenarios.slice(0, 3).map((scenario, index) => (
          <div key={scenario.id} className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm font-medium text-slate-200">{scenario.title}</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Risk Score:</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {scenario.expectedRiskScore}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-400 font-medium">Decision: Not escalated</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Why allowed:</span>
                <span className="text-slate-300">No coercion, legal threats, or suspicious payment patterns detected.</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">False positive avoided:</span>
                <span className="text-slate-300">Routine service/support calls are not blocked.</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
