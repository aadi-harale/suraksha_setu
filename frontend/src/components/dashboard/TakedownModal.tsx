import { useState, useEffect } from 'react';
import { ShieldAlert, X, Radio, Building, ShieldCheck, CheckCircle2, Loader2, AlertTriangle, Send } from 'lucide-react';

interface TakedownModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
}

export default function TakedownModal({ isOpen, onClose, caseId }: TakedownModalProps) {
  const [sequenceState, setSequenceState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);

  // Agency specific status
  const [traiStatus, setTraiStatus] = useState<'pending' | 'running' | 'completed'>('pending');
  const [rbiStatus, setRbiStatus] = useState<'pending' | 'running' | 'completed'>('pending');
  const [certStatus, setCertStatus] = useState<'pending' | 'running' | 'completed'>('pending');

  useEffect(() => {
    if (isOpen) {
      setSequenceState('idle');
      setProgress(0);
      setTraiStatus('pending');
      setRbiStatus('pending');
      setCertStatus('pending');
    }
  }, [isOpen]);

  const initiateTakedown = () => {
    setSequenceState('running');
    
    // TRAI sequence
    setTimeout(() => setTraiStatus('running'), 500);
    setTimeout(() => {
      setTraiStatus('completed');
      setProgress(33);
    }, 2500);

    // RBI sequence
    setTimeout(() => setRbiStatus('running'), 2800);
    setTimeout(() => {
      setRbiStatus('completed');
      setProgress(66);
    }, 4500);

    // CERT-In sequence
    setTimeout(() => setCertStatus('running'), 4800);
    setTimeout(() => {
      setCertStatus('completed');
      setProgress(100);
      setSequenceState('completed');
    }, 6500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 text-red-500 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wider">Multi-Agency Takedown Protocol</h2>
              <div className="text-xs text-slate-400 font-mono mt-0.5">TARGET: {caseId} • ENCRYPTED DISPATCH</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors p-2"
            disabled={sequenceState === 'running'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {sequenceState === 'idle' ? (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <AlertTriangle className="w-16 h-16 text-orange-500 mb-4 opacity-80" />
              <h3 className="text-xl font-bold text-slate-200 mb-2">Confirm Takedown Initiation</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-8">
                This action will dispatch automated legal and technical countermeasures to telecom operators, financial institutions, and cyber police units simultaneously.
              </p>
              
              <button 
                onClick={initiateTakedown}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] uppercase tracking-widest text-sm"
              >
                <Send className="w-4 h-4" /> Execute Protocol
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-2 uppercase">
                  <span>Dispatch Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${sequenceState === 'completed' ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                {/* TRAI */}
                <div className={`p-4 rounded-lg border ${traiStatus === 'completed' ? 'bg-slate-900 border-emerald-900/50' : traiStatus === 'running' ? 'bg-slate-800/50 border-red-900/50' : 'bg-slate-900/30 border-slate-800 opacity-50'} flex gap-4 transition-all duration-500`}>
                  <div className={`p-3 rounded-lg shrink-0 h-min ${traiStatus === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : traiStatus === 'running' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                    {traiStatus === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : traiStatus === 'running' ? <Loader2 className="w-6 h-6 animate-spin" /> : <Radio className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-slate-200">TRAI / Telecom Operators</h4>
                      <span className={`text-xs font-mono uppercase ${traiStatus === 'completed' ? 'text-emerald-400' : traiStatus === 'running' ? 'text-red-400' : 'text-slate-500'}`}>
                        {traiStatus === 'completed' ? 'Executed' : traiStatus === 'running' ? 'Connecting...' : 'Pending'}
                      </span>
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1 font-mono">
                      <li>› Blacklisting Target Caller ID: <span className="text-slate-300">+91-9876543210</span></li>
                      <li>› Deactivating linked IMEI blocks</li>
                      <li>› Tracing VoIP gateway node</li>
                    </ul>
                  </div>
                </div>

                {/* RBI */}
                <div className={`p-4 rounded-lg border ${rbiStatus === 'completed' ? 'bg-slate-900 border-emerald-900/50' : rbiStatus === 'running' ? 'bg-slate-800/50 border-red-900/50' : 'bg-slate-900/30 border-slate-800 opacity-50'} flex gap-4 transition-all duration-500`}>
                  <div className={`p-3 rounded-lg shrink-0 h-min ${rbiStatus === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : rbiStatus === 'running' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                    {rbiStatus === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : rbiStatus === 'running' ? <Loader2 className="w-6 h-6 animate-spin" /> : <Building className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-slate-200">RBI / NPCI Financial Hub</h4>
                      <span className={`text-xs font-mono uppercase ${rbiStatus === 'completed' ? 'text-emerald-400' : rbiStatus === 'running' ? 'text-red-400' : 'text-slate-500'}`}>
                        {rbiStatus === 'completed' ? 'Executed' : rbiStatus === 'running' ? 'Connecting...' : 'Pending'}
                      </span>
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1 font-mono">
                      <li>› Freezing UPI VPA: <span className="text-slate-300">rbi.verify@okaxis</span></li>
                      <li>› Suspending linked mule accounts</li>
                      <li>› Flagging PAN associated with KYC</li>
                    </ul>
                  </div>
                </div>

                {/* CERT-In */}
                <div className={`p-4 rounded-lg border ${certStatus === 'completed' ? 'bg-slate-900 border-emerald-900/50' : certStatus === 'running' ? 'bg-slate-800/50 border-red-900/50' : 'bg-slate-900/30 border-slate-800 opacity-50'} flex gap-4 transition-all duration-500`}>
                  <div className={`p-3 rounded-lg shrink-0 h-min ${certStatus === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : certStatus === 'running' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                    {certStatus === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : certStatus === 'running' ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-slate-200">CERT-In / Cyber Police</h4>
                      <span className={`text-xs font-mono uppercase ${certStatus === 'completed' ? 'text-emerald-400' : certStatus === 'running' ? 'text-red-400' : 'text-slate-500'}`}>
                        {certStatus === 'completed' ? 'Executed' : certStatus === 'running' ? 'Connecting...' : 'Pending'}
                      </span>
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1 font-mono">
                      <li>› Generating automated FIR (BNS 318, 319)</li>
                      <li>› Uploading tamper-evident evidence packet</li>
                      <li>› Dispatching real-time IOCs to threat feed</li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {sequenceState === 'completed' && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
            <button 
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700"
            >
              Acknowledge & Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
