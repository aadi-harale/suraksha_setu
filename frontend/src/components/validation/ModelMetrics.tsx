import { VALIDATION_METRICS } from '@/lib/mock-data';

export default function ModelMetrics() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
       <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col items-center">
          <span className="text-4xl font-bold text-emerald-400 mb-2">20/20</span>
          <span className="text-sm text-slate-400 uppercase tracking-wider">Correct Classifications</span>
          <span className="text-[10px] text-slate-500 mt-1">(Demo set)</span>
       </div>
       <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col items-center">
          <span className="text-4xl font-bold text-emerald-400 mb-2">17/17</span>
          <span className="text-sm text-slate-400 uppercase tracking-wider">Scam Scenarios Caught</span>
          <span className="text-[10px] text-slate-500 mt-1">(Demo set)</span>
       </div>
       <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col items-center">
          <span className="text-4xl font-bold text-blue-400 mb-2">3/3</span>
          <span className="text-sm text-slate-400 uppercase tracking-wider">Legit Calls Ignored</span>
          <span className="text-[10px] text-slate-500 mt-1">(Demo set)</span>
       </div>
       <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col items-center">
          <span className="text-4xl font-bold text-purple-400 mb-2">0</span>
          <span className="text-sm text-slate-400 uppercase tracking-wider">False Positives</span>
          <span className="text-[10px] text-slate-500 mt-1">(Demo set only)</span>
       </div>
    </div>
  );
}
