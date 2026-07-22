import { ArrowRight, Wallet, Clock, SearchX, CheckCircle, Shield, FileText, Zap } from 'lucide-react';

export default function BusinessImpact() {
  return (
    <div className="bg-slate-900/80 rounded-xl border border-emerald-500/30 p-5 shadow-[0_0_20px_rgba(16,185,129,0.05)] h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="font-semibold text-emerald-400 flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5" />
            Before/After Intervention Impact
          </h3>
          <p className="text-xs text-slate-400 mt-1">Comparing traditional workflows vs SurakshaNet active interception</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1 relative z-10">
        {/* Before */}
        <div className="bg-slate-950 rounded-lg p-4 border border-red-900/30 flex flex-col opacity-80">
          <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3 pb-2 border-b border-red-900/50 flex items-center gap-1.5">
            <SearchX className="w-3.5 h-3.5" /> Traditional Workflow
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
              <p className="text-xs text-slate-400 leading-tight">Victim realizes scam <span className="text-red-400 font-semibold">after</span> payment is made.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
              <p className="text-xs text-slate-400 leading-tight">Delayed reporting leads to drained accounts.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
              <p className="text-xs text-slate-400 leading-tight">Weak evidence relies entirely on victim memory.</p>
            </div>
          </div>
        </div>

        {/* After */}
        <div className="bg-emerald-950/20 rounded-lg p-4 border border-emerald-500/30 flex flex-col shadow-[inset_0_0_15px_rgba(16,185,129,0.05)]">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 pb-2 border-b border-emerald-500/30 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> SurakshaNet Workflow
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
              <p className="text-xs text-slate-300 leading-tight"><span className="text-emerald-400 font-semibold">Live detection</span> blocks payment simulation.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
              <p className="text-xs text-slate-300 leading-tight">Automated alert sent to trusted contact.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
              <p className="text-xs text-slate-300 leading-tight">Tamper-evident complaint drafted in <span className="text-emerald-400">&lt;10s</span>.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-4 gap-2 relative z-10">
        <div className="bg-slate-900 rounded p-2 text-center border border-slate-800">
          <span className="block text-[9px] text-slate-500 uppercase">Loss Prevented</span>
          <span className="block text-sm font-bold text-emerald-400">₹48,000</span>
        </div>
        <div className="bg-slate-900 rounded p-2 text-center border border-slate-800">
          <span className="block text-[9px] text-slate-500 uppercase">Complaint Draft</span>
          <span className="block text-sm font-bold text-blue-400">&lt; 10s</span>
        </div>
        <div className="bg-slate-900 rounded p-2 text-center border border-slate-800">
          <span className="block text-[9px] text-slate-500 uppercase">Lead Time</span>
          <span className="block text-sm font-bold text-indigo-400">3 cases</span>
        </div>
        <div className="bg-slate-900 rounded p-2 text-center border border-slate-800">
          <span className="block text-[9px] text-slate-500 uppercase">False Positives</span>
          <span className="block text-sm font-bold text-slate-300">0%</span>
        </div>
      </div>
    </div>
  );
}
