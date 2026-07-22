'use client';
import { HeartPulse, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function StressAnalyzer({ progress }: { progress: number }) {
  const [stressScore, setStressScore] = useState(40);
  
  useEffect(() => {
    // Simulate stress increasing as the scam progresses
    const baseStress = 40 + (progress * 50); // scales from 40 to 90
    // Add some random jitter for realism (-5 to +5)
    const jitter = Math.floor(Math.random() * 10) - 5;
    const finalStress = Math.min(100, Math.max(0, baseStress + jitter));
    setStressScore(finalStress);
  }, [progress]);

  let statusText = "Normal";
  let colorClass = "text-green-400";
  let bgClass = "bg-green-500/20";
  let borderClass = "border-green-500/30";
  
  if (stressScore > 85) {
    statusText = "Severe Panic Detected";
    colorClass = "text-red-500";
    bgClass = "bg-red-500/20";
    borderClass = "border-red-500/50";
  } else if (stressScore > 70) {
    statusText = "High Distress";
    colorClass = "text-orange-400";
    bgClass = "bg-orange-500/20";
    borderClass = "border-orange-500/40";
  } else if (stressScore > 55) {
    statusText = "Elevated Stress";
    colorClass = "text-amber-400";
    bgClass = "bg-amber-500/20";
    borderClass = "border-amber-500/30";
  }

  return (
    <div className={`rounded-xl border p-4 ${borderClass} bg-slate-900/80 transition-colors duration-500`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-slate-200 flex items-center gap-2">
          <Activity className="w-4 h-4 text-pink-500" /> Vocal Stress Index
        </h3>
        <span className={`font-bold ${colorClass} font-mono text-lg`}>
          {Math.round(stressScore)} / 100
        </span>
      </div>
      
      <div className="flex items-center gap-4 mt-4">
        <div className={`p-3 rounded-full ${bgClass} ${stressScore > 70 ? 'animate-pulse' : ''}`}>
          <HeartPulse className={`w-8 h-8 ${colorClass}`} />
        </div>
        <div>
          <p className={`font-medium ${colorClass}`}>Status: {statusText}</p>
          <p className="text-xs text-slate-400 mt-1">Signals: pause density, pitch tremor, urgency keywords</p>
        </div>
      </div>

      {stressScore > 85 && (
        <div className="mt-4 text-xs font-mono text-red-400 bg-red-950/50 p-2 rounded border border-red-500/30">
          [!] SOS TRIGGERED: Bypassing Victim Isolation. Alerting family member...
        </div>
      )}
    </div>
  );
}
