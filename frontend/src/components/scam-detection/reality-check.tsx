import { useState } from 'react';
import { ShieldAlert, Info, PhoneOff, AlertTriangle, PhoneCall, Shield, Building } from 'lucide-react';

interface RealityCheckProps {
  show: boolean;
}

export default function RealityCheck({ show }: RealityCheckProps) {
  const [expanded, setExpanded] = useState(false);

  if (!show) return null;

  return (
    <div className="bg-slate-900/90 rounded-xl border-2 border-orange-500/50 p-6 shadow-[0_0_25px_rgba(249,115,22,0.15)] relative overflow-hidden mt-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-orange-400 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6" />
            Reality Check: Digital Arrest Does Not Exist
          </h3>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Real police, CBI, or ED officials <strong>do not</strong> place citizens under "digital arrest" over video calls. They never ask you to transfer money for "verification" or "security deposits".
          </p>
        </div>
      </div>

      <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20 mb-4 relative z-10">
        <h4 className="text-sm font-semibold text-orange-300 flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4" /> Immediate Red Flags in this call:
        </h4>
        <ul className="text-xs text-slate-300 space-y-1.5 ml-6 list-disc marker:text-orange-500/50">
          <li>Forcing you to stay isolated on a video call.</li>
          <li>Threatening immediate physical arrest without an official paper warrant.</li>
          <li>Demanding money transfers to "clear your name".</li>
        </ul>
      </div>

      <div className="relative z-10">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1 mb-2"
        >
          <Info className="w-4 h-4" />
          {expanded ? 'Hide Safety Steps' : 'View Immediate Safety Steps'}
        </button>

        {expanded && (
          <div className="grid grid-cols-2 gap-3 mt-3 animate-in fade-in slide-in-from-top-2">
            <div className="bg-slate-950 p-3 rounded border border-slate-800 flex items-start gap-2">
              <PhoneOff className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">1. Disconnect</span>
                <span className="text-[10px] text-slate-400">Hang up the call immediately.</span>
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800 flex items-start gap-2">
              <Building className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">2. Do not pay</span>
                <span className="text-[10px] text-slate-400">Never transfer money for verification.</span>
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800 flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">3. Report 1930</span>
                <span className="text-[10px] text-slate-400">Call 1930 or visit cybercrime.gov.in.</span>
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800 flex items-start gap-2">
              <PhoneCall className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">4. Tell Family</span>
                <span className="text-[10px] text-slate-400">Inform a trusted contact now.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
