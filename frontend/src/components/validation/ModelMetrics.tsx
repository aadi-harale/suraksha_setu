import { VALIDATION_METRICS } from '@/lib/mock-data';

export default function ModelMetrics() {
  return (
    <div className="mb-6">
      <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3 mb-4 flex items-center justify-center text-amber-200/80 text-xs font-mono uppercase tracking-widest text-center">
        Curated Demo Benchmark <span className="mx-2 opacity-50">|</span> Not Production-Scale Validation
      </div>
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col items-center">
            <span className="text-4xl font-bold text-emerald-400 mb-2">20/20</span>
            <span className="text-sm text-slate-400 uppercase tracking-wider text-center">Correct Classifications</span>
            <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">(Curated Demo Set)</span>
         </div>
         <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col items-center">
            <span className="text-4xl font-bold text-emerald-400 mb-2">17/17</span>
            <span className="text-sm text-slate-400 uppercase tracking-wider text-center">Scam Scenarios Caught</span>
            <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">(Curated Demo Set)</span>
         </div>
         <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col items-center">
            <span className="text-4xl font-bold text-blue-400 mb-2">3/3</span>
            <span className="text-sm text-slate-400 uppercase tracking-wider text-center">Legit Calls Ignored</span>
            <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">(Curated Demo Set)</span>
         </div>
         <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col items-center">
            <span className="text-4xl font-bold text-purple-400 mb-2">0</span>
            <span className="text-sm text-slate-400 uppercase tracking-wider text-center">False Positives</span>
            <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">(Curated Demo Set Only)</span>
         </div>
      </div>
    </div>
  );
}
