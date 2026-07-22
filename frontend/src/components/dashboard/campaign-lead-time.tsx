import { Network, Activity, TrendingDown, Clock, ShieldCheck } from 'lucide-react';

export default function CampaignLeadTime() {
  return (
    <div className="glass-panel rounded-xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-[0_0_20px_rgba(16,185,129,0.05)] h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-emerald-400 flex items-center gap-2 text-lg">
            <TrendingDown className="w-5 h-5" />
            Campaign Lead-Time Intelligence
          </h3>
          <p className="text-xs text-slate-400 mt-1">Detecting fraud campaigns before mass victimisation</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded text-emerald-400 text-xs font-bold font-mono">
          CLUSTER DA-MH-0726-A
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-slate-900/80 rounded border border-slate-800 p-3">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Campaign Profile</span>
          <span className="text-sm text-slate-200 font-medium">CBI Aadhaar Money Laundering Digital Arrest Ring</span>
        </div>
        <div className="bg-slate-900/80 rounded border border-slate-800 p-3">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Estimated Victims Prevented</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-emerald-400">5</span>
            <span className="text-xs text-slate-400">(Cluster blocked early)</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-950/50 rounded border border-slate-800/50 p-4 mb-4">
        <h4 className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wide">Detection Timeline</h4>
        <div className="relative border-l-2 border-slate-800 ml-2 space-y-4">
          <div className="relative pl-4">
            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-600"></div>
            <p className="text-xs text-slate-400">Complaint 1 received (Isolated)</p>
          </div>
          <div className="relative pl-4">
            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-500"></div>
            <p className="text-xs text-indigo-300">Same UPI detected in new call</p>
          </div>
          <div className="relative pl-4">
            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-500"></div>
            <p className="text-xs text-indigo-300">Scam Script DNA matched</p>
          </div>
          <div className="relative pl-4">
            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
            <p className="text-xs font-semibold text-orange-400">Cluster Formed (Lead-time triggered)</p>
          </div>
          <div className="relative pl-4">
            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-emerald-500"></div>
            <p className="text-xs text-emerald-400">Payment attempt blocked for subsequent victim</p>
          </div>
          <div className="relative pl-4">
            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-emerald-500"></div>
            <p className="text-xs text-emerald-400">District alert simulated</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">High-Risk Hub</span>
          <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2 py-1 rounded">HDFC-1122</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Recommended Action</span>
          <span className="text-xs text-slate-300">Bank review + district alert</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
         <div className="flex items-center gap-1.5">
           <Clock className="w-3.5 h-3.5 text-emerald-500" />
           <span className="text-xs font-medium text-emerald-400">Lead Time: 3 cases earlier</span>
         </div>
         <div className="flex items-center gap-1.5">
           <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
           <span className="text-xs text-slate-400">Actionability: Review-ready</span>
         </div>
      </div>
    </div>
  );
}
