import { Network, Link2, MapPin, FileText, AlertTriangle, Cpu } from 'lucide-react';

export default function GraphIntelligence() {
  const metrics = {
    centralityScore: 0.84,
    linkedCases: 7,
    citiesAffected: ['Mumbai', 'Pune', 'Jaipur'],
    scriptSimilarity: 91,
    campaignRisk: 'Critical',
    campaignStatus: 'Active' as const,
    recommendedAction: 'Freeze mule account review + telecom number escalation'
  };

  return (
    <div className="glass-panel bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col shadow-xl h-full">
       <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-slate-200 flex items-center gap-2">
            <Network className="w-4 h-4 text-purple-500" /> Graph Intelligence
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${
            metrics.campaignStatus === 'Active' 
              ? 'bg-red-500/20 text-red-400 border-red-500/20 animate-pulse'
              : 'bg-slate-500/20 text-slate-400 border-slate-500/20'
          }`}>
            Campaign {metrics.campaignStatus}
          </span>
       </div>
       <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
          
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
             <div className="text-xs text-slate-400 mb-1">Mule Account Centrality</div>
             <div className="flex items-end gap-2">
               <span className="text-2xl font-bold text-white">{metrics.centralityScore}</span>
               <span className="text-xs text-red-400 font-medium mb-1">High Hub Risk</span>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
             <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 flex flex-col items-center text-center">
                <Link2 className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-lg font-bold text-white">{metrics.linkedCases}</span>
                <span className="text-[10px] text-slate-400 uppercase">Linked Cases</span>
             </div>
             <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 flex flex-col items-center text-center">
                <FileText className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-lg font-bold text-white">{metrics.scriptSimilarity}%</span>
                <span className="text-[10px] text-slate-400 uppercase">Script Match</span>
             </div>
             <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 flex flex-col items-center text-center">
                <MapPin className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-lg font-bold text-white">{metrics.citiesAffected.length}</span>
                <span className="text-[10px] text-slate-400 uppercase">Cities Affected</span>
             </div>
             <div className="bg-red-900/30 rounded-lg p-3 border border-red-500/30 flex flex-col items-center text-center">
                <AlertTriangle className="w-4 h-4 text-red-400 mb-1" />
                <span className="text-lg font-bold text-red-400">{metrics.campaignRisk}</span>
                <span className="text-[10px] text-slate-400 uppercase">Campaign Risk</span>
             </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
             <div className="text-xs text-slate-400 mb-2 flex items-center gap-1">
               <MapPin className="w-3 h-3" /> Target Geos
             </div>
             <div className="flex flex-wrap gap-2">
               {metrics.citiesAffected.map(city => (
                 <span key={city} className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-300 border border-slate-700">
                   {city}
                 </span>
               ))}
             </div>
          </div>

          <div className="bg-amber-950/40 rounded-lg p-3 border border-amber-500/30">
             <div className="text-xs text-amber-400 font-semibold mb-1 flex items-center gap-1">
               <Cpu className="w-3 h-3" /> Recommended Action
             </div>
             <p className="text-xs text-slate-300">{metrics.recommendedAction}</p>
          </div>
       </div>
    </div>
  );
}
