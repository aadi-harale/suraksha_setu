import { Activity, Info } from 'lucide-react';
import { DemoScenario } from '@/lib/types';

export default function RiskMeter({ 
  currentRiskScore,
  scenario 
}: { 
  currentRiskScore: number,
  scenario: DemoScenario
}) {
  const confidence = currentRiskScore >= 91 ? 'High' : currentRiskScore >= 56 ? 'Medium' : 'Low';

  return (
    <div className="glass-panel rounded-xl flex-1 p-6 flex flex-col items-center hover:scale-[1.01] transition-transform duration-300">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-300">
        <Activity className="w-5 h-5 text-emerald-400" /> Threat Level
      </h3>
      
      <div className="relative w-40 h-40 mb-4">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
          {/* Defs for glowing SVG filter */}
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle 
            cx="50" cy="50" r="45" 
            fill="none" 
            stroke={currentRiskScore >= 91 ? '#dc2626' : currentRiskScore >= 76 ? '#f97316' : currentRiskScore >= 56 ? '#f59e0b' : currentRiskScore >= 31 ? '#eab308' : '#10b981'} 
            strokeWidth="8"
            strokeDasharray={`${(currentRiskScore / 100) * 283} 283`}
            className="transition-all duration-500 ease-out"
            filter={currentRiskScore > 25 ? "url(#glow)" : ""}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold tracking-tighter text-white ${currentRiskScore >= 75 ? 'neon-text-glow' : ''}`}>{currentRiskScore}</span>
          <span className="text-[10px] font-medium text-slate-400 uppercase mt-1">/ 100</span>
        </div>
      </div>
      
      <div className={`px-4 py-1.5 mb-2 rounded-full font-medium text-sm ${
        currentRiskScore >= 91 ? 'bg-red-500/20 text-red-400' : 
        currentRiskScore >= 76 ? 'bg-orange-500/20 text-orange-400' : 
        currentRiskScore >= 56 ? 'bg-amber-500/20 text-amber-400' : 
        currentRiskScore >= 31 ? 'bg-yellow-500/20 text-yellow-400' : 
        'bg-emerald-500/20 text-emerald-400'
      }`}>
        {currentRiskScore >= 91 ? 'CRITICAL INTERVENTION' : 
         currentRiskScore >= 76 ? 'HIGH RISK' : 
         currentRiskScore >= 56 ? 'SUSPICIOUS' : 
         currentRiskScore >= 31 ? 'CAUTION' : 'SAFE'}
      </div>
      
      <div className="text-xs text-slate-400 mb-6">Confidence: <span className="font-bold text-white">{confidence}</span></div>

      {currentRiskScore >= 31 && scenario.entities && (
        <div className="w-full bg-slate-950/50 rounded-lg p-4 border border-slate-800">
           <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1">
             <Info className="w-3 h-3 text-blue-400" /> Top Evidence
           </h4>
           <ul className="text-xs space-y-2 text-slate-400">
             {scenario.id === 'scenario_hinglish' ? (
                <>
                  <li><span className="font-bold text-amber-500">Authority impersonation:</span> "digital arrest"</li>
                  <li><span className="font-bold text-amber-500">Victim Isolation:</span> "kisi ko inform nahi kar sakte"</li>
                  <li><span className="font-bold text-amber-500">Continuous control:</span> "Video call band mat kijiye"</li>
                  <li><span className="font-bold text-amber-500">Payment extraction:</span> "amount transfer kijiye"</li>
                </>
             ) : scenario.id === 'scenario_01' ? (
                <>
                  <li><span className="font-bold text-amber-500">Authority impersonation:</span> "Central Bureau of Investigation (CBI)"</li>
                  <li><span className="font-bold text-amber-500">Legal threat:</span> "money laundering", "FIR registered"</li>
                  <li><span className="font-bold text-amber-500">Isolation:</span> "Do not tell your family"</li>
                  <li><span className="font-bold text-amber-500">Continuous control:</span> "stay on this video call"</li>
                  <li><span className="font-bold text-amber-500">Payment extraction:</span> "security deposit of ₹48,000"</li>
                </>
             ) : (
                <>
                  <li><span className="font-bold text-amber-500">Legal threat:</span> "freezing all your assets"</li>
                  <li><span className="font-bold text-amber-500">Authority impersonation:</span> "Enforcement Directorate"</li>
                  <li><span className="font-bold text-amber-500">Payment extraction:</span> "transfer all your funds"</li>
                </>
             )}
           </ul>
        </div>
      )}
    </div>
  );
}
