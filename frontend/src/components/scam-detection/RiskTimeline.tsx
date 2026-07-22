import { Activity } from 'lucide-react';

export default function RiskTimeline({ riskProgression }: { riskProgression: number[] }) {
  if (!riskProgression || riskProgression.length === 0) return null;

  const currentRisk = riskProgression[riskProgression.length - 1];
  
  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-6 shadow-xl">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-slate-400 uppercase tracking-wider">
        <Activity className="w-4 h-4" /> Risk Timeline
      </h3>
      
      <div className="flex h-12 items-end gap-1">
        {riskProgression.map((risk, index) => (
          <div 
            key={index} 
            className={`flex-1 rounded-t-sm transition-all duration-300 ${
              risk >= 75 ? 'bg-red-500' : 
              risk >= 50 ? 'bg-orange-500' : 
              risk >= 25 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ height: `${Math.max(10, risk)}%` }}
            title={`Score: ${risk}`}
          />
        ))}
      </div>
    </div>
  );
}
