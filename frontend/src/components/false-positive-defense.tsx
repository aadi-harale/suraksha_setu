import { ShieldCheck, Info } from 'lucide-react';
import { DemoScenario } from '@/lib/types';

interface FalsePositiveDefenseProps {
  scenario: DemoScenario;
}

export default function FalsePositiveDefense({ scenario }: FalsePositiveDefenseProps) {
  if (scenario.isScam) return null;

  return (
    <div className="bg-slate-900/80 rounded-xl border border-emerald-500/30 p-6 shadow-[0_0_15px_rgba(16,185,129,0.1)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            False Positive Defense Layer
          </h3>
          <p className="text-sm text-slate-400 mt-1">Legitimate call detected. No escalation required.</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-mono flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Status: Allowed
        </div>
      </div>

      <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
        <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-400" />
          Why this call was not escalated:
        </h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">✓</span> No legal threat detected
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">✓</span> No isolation instruction detected
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">✓</span> No "stay on video call" control pattern
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">✓</span> No suspicious UPI/payment request
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">✓</span> No OTP/password request
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">✓</span> No coercive urgency pattern
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">✓</span> No linked complaint repository match
          </li>
        </ul>
      </div>

      <div className="mt-4 flex gap-3 text-xs">
        <div className="bg-slate-800/50 text-slate-300 px-3 py-1.5 rounded-md border border-slate-700">
          Soft monitoring only
        </div>
        <div className="bg-slate-800/50 text-slate-300 px-3 py-1.5 rounded-md border border-slate-700">
          No trusted contact alert
        </div>
        <div className="bg-slate-800/50 text-slate-300 px-3 py-1.5 rounded-md border border-slate-700">
          No payment block
        </div>
      </div>
      
      <p className="text-[10px] text-slate-500 mt-4 italic">
        * Demonstrated capability: Ensuring citizen-facing tools maintain low false-positive rates to avoid unnecessary panic.
      </p>
    </div>
  );
}
