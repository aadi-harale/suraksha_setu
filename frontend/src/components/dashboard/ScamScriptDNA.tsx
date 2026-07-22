import { Dna, Radio, Users, Map } from 'lucide-react';

export default function ScamScriptDNA() {
  return (
    <div className="glass-panel bg-slate-900/80 rounded-xl border border-purple-500/30 flex flex-col shadow-xl shadow-purple-900/10">
       <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
          <h3 className="font-semibold text-slate-200 flex items-center gap-2">
            <Dna className="w-4 h-4 text-purple-400" /> Scam Script DNA
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full border bg-red-500/20 text-red-400 border-red-500/30 animate-pulse flex items-center gap-1">
            <Radio className="w-3 h-3" /> Active Campaign
          </span>
       </div>
       <div className="p-4 flex flex-col gap-4">
          
          {/* DNA Sequence Visualizer */}
          <div className="bg-black/40 rounded-lg p-3 border border-purple-500/20">
            <p className="text-[10px] text-purple-400 uppercase tracking-wider font-semibold mb-2">Script DNA Sequence</p>
            <div className="flex items-center gap-1 flex-wrap">
              {['CBI', '→', 'Aadhaar Misuse', '→', 'Money Laundering', '→', 'Isolation', '→', 'UPI Verification'].map((step, i) => (
                <span 
                  key={i} 
                  className={
                    step === '→' 
                      ? 'text-slate-500 text-sm font-bold' 
                      : 'bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs px-2 py-1 rounded font-mono font-medium'
                  }
                >
                  {step}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Similarity to known cluster</p>
              <p className="text-xl font-bold text-purple-400">91%</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Matched Cases</p>
              <p className="text-xl font-bold text-white flex items-center gap-1">
                <Users className="w-4 h-4 text-slate-400" /> 7
              </p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Cities Affected</p>
              <p className="text-sm font-medium text-slate-300 flex items-center gap-1">
                <Map className="w-3 h-3 text-slate-400" /> Mumbai, Pune, Jaipur
              </p>
            </div>
            <div className="bg-red-950/40 p-3 rounded-lg border border-red-500/30">
              <p className="text-xs text-slate-400 mb-1">Campaign Status</p>
              <p className="text-sm font-bold text-red-400">🔴 Active</p>
            </div>
          </div>

          {/* Predicted Next Targets */}
          <div className="bg-amber-950/30 rounded-lg p-3 border border-amber-500/20">
            <p className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold mb-2">Predicted Next Targets</p>
            <div className="flex flex-wrap gap-2">
              {['Tier-1 metro citizens', 'Elderly users', 'First-time UPI users'].map(t => (
                <span key={t} className="text-xs bg-amber-900/30 border border-amber-500/30 text-amber-200 px-2 py-1 rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>
       </div>
    </div>
  );
}
