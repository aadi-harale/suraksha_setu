import { CheckCircle2, TrendingUp, Cpu, Server, Users } from 'lucide-react';

export default function RubricMapping() {
  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 shadow-xl overflow-hidden mb-6">
      <div className="p-4 border-b border-slate-800 bg-slate-950/50">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-indigo-400" />
          Judging Rubric Mapping
        </h3>
        <p className="text-xs text-slate-400 mt-1">How SurakshaNet AI aligns with the hackathon evaluation criteria</p>
      </div>
      
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Innovation */}
        <div className="bg-slate-800/30 rounded p-4 border border-slate-700/50">
          <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-1.5 mb-2">
            <Cpu className="w-4 h-4" /> Innovation
          </h4>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc ml-4 marker:text-indigo-500/50">
            <li>Live kill-chain progression tracking</li>
            <li>Next-stage prediction engine</li>
            <li>Interactive fraud network graphing</li>
            <li>Campaign lead-time intelligence clustering</li>
          </ul>
        </div>

        {/* Business Impact */}
        <div className="bg-slate-800/30 rounded p-4 border border-slate-700/50">
          <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-4 h-4" /> Business Impact
          </h4>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc ml-4 marker:text-emerald-500/50">
            <li>Pre-emptive payment blocking</li>
            <li>Zero-friction 1930/NCRP complaint-ready export</li>
            <li>Reduced financial loss per victim</li>
            <li>Early detection of structured scam rings</li>
          </ul>
        </div>

        {/* Technical Excellence */}
        <div className="bg-slate-800/30 rounded p-4 border border-slate-700/50">
          <h4 className="text-sm font-bold text-blue-300 flex items-center gap-1.5 mb-2">
            <Server className="w-4 h-4" /> Technical Excellence
          </h4>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc ml-4 marker:text-blue-500/50">
            <li>Hybrid deterministic signal engine</li>
            <li>OpenRouter AI triage with graceful fallback</li>
            <li>Tamper-evident log generation</li>
            <li>Clean Next.js App Router architecture</li>
          </ul>
        </div>

        {/* Scalability & UX */}
        <div className="bg-slate-800/30 rounded p-4 border border-slate-700/50 md:col-span-2 lg:col-span-3">
          <h4 className="text-sm font-bold text-orange-300 flex items-center gap-1.5 mb-2">
            <Users className="w-4 h-4" /> Scalability & User Experience
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Scalability:</strong> Designed with modular queues for citizens, banks, telecom, and police, allowing decentralized adoption without breaking existing workflows.<br/>
            <strong>UX:</strong> Delivers a reassuring "Citizen Shield" interface with clear safety steps, paired with a dense, data-rich "War Room" dashboard for investigators, ensuring the right density of information for each persona.
          </p>
        </div>
      </div>
    </div>
  );
}
