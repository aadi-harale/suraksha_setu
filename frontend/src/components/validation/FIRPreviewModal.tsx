import { X, Printer, Shield, FileSignature, CheckCircle2 } from 'lucide-react';
import { EvidencePacket } from '@/lib/types';

interface FIRPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: EvidencePacket;
}

export default function FIRPreviewModal({ isOpen, onClose, caseData }: FIRPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-200 rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh] text-slate-900">
        
        {/* Header Controls */}
        <div className="p-4 border-b border-slate-300 flex justify-between items-center bg-slate-300/50">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <Shield className="w-5 h-5 text-indigo-700" />
            <span>Automated FIR Draft (Bharatiya Nyaya Sanhita)</span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition-colors text-sm font-medium">
              <Printer className="w-4 h-4" /> Print / Export PDF
            </button>
            <button 
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800 transition-colors p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div className="flex-1 overflow-y-auto p-8 font-serif bg-white">
          <div className="max-w-3xl mx-auto">
            {/* National Emblem Placeholder */}
            <div className="text-center mb-6 border-b-2 border-slate-900 pb-6">
              <h1 className="text-2xl font-bold uppercase tracking-widest mb-1">First Information Report</h1>
              <h2 className="text-lg uppercase mb-2">(Under Section 173 BNSS)</h2>
              <p className="text-sm">Cyber Crime Police Station, EOW</p>
              <p className="text-sm font-semibold mt-2">State of Maharashtra</p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm mb-8 border border-slate-300 p-4">
              <div>
                <span className="font-bold">1. District:</span> Mumbai City
              </div>
              <div>
                <span className="font-bold">P.S.:</span> Cyber Cell, BKC
              </div>
              <div>
                <span className="font-bold">2. FIR No:</span> AUTO-{caseData.caseId.split('-').pop()}
              </div>
              <div>
                <span className="font-bold">Date:</span> {new Date().toLocaleDateString()}
              </div>
              <div className="col-span-2">
                <span className="font-bold">3. Acts & Sections:</span> 
                <p className="pl-4 mt-1">i. Bharatiya Nyaya Sanhita (BNS), 2023 - Sections 318(4) [Cheating], 319 [Cheating by Personation], 308(2) [Extortion]</p>
                <p className="pl-4">ii. Information Technology Act, 2000 - Section 66D</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold underline mb-2">4. Suspect / Accused Details</h3>
              <div className="bg-slate-50 p-4 border border-slate-200 text-sm">
                <p><span className="font-semibold w-32 inline-block">Mobile Numbers:</span> {caseData.entities.phones.length > 0 ? caseData.entities.phones.join(', ') : 'Unknown'}</p>
                <p><span className="font-semibold w-32 inline-block">UPI IDs:</span> {caseData.entities.upis.length > 0 ? caseData.entities.upis.join(', ') : 'Unknown'}</p>
                <p><span className="font-semibold w-32 inline-block">Bank Accounts:</span> {caseData.entities.bankAccounts.length > 0 ? caseData.entities.bankAccounts.join(', ') : 'Pending Investigation'}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold underline mb-2">5. Brief facts of the case</h3>
              <p className="text-sm text-justify leading-relaxed">
                On the basis of AI-driven proactive threat detection (SurakshaNet AI Platform), this FIR is registered. The accused impersonated officers of the <span className="font-semibold">{caseData.entities.agencies.join(', ') || 'CBI/Customs'}</span>, falsely claiming that a parcel containing illegal items was intercepted in the victim's name or that an arrest warrant had been issued. 
              </p>
              <p className="text-sm text-justify leading-relaxed mt-2">
                The accused utilized coercive tactics (Digital Arrest) and instructed the victim to remain on a continuous video call, demanding a security deposit. Extracted communication logs indicate the presence of phrases such as <em>"{caseData.highlightedPhrases[0]?.phrase}"</em> and <em>"{caseData.highlightedPhrases[1]?.phrase}"</em>. Total financial demand detected: <span className="font-semibold">{caseData.entities.amounts.join(', ') || 'Unknown'}</span>.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="font-bold underline mb-2">6. Action Taken</h3>
              <div className="text-sm space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Direction issued to nodal officer (RBI/NPCI) to freeze identified UPI VPA under Sec 106 BNSS.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Direction issued to Telecom Service Provider to suspend identified MSISDN.</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end mt-16 pt-8 border-t border-slate-300">
              <div className="text-center">
                <div className="w-32 border-b border-slate-400 mb-2"></div>
                <p className="text-sm font-semibold">Victim / Complainant</p>
              </div>
              <div className="text-center">
                <div className="text-indigo-800 font-bold italic text-xl mb-1 flex items-center justify-center gap-1">
                  <FileSignature className="w-5 h-5" />
                  Auto-Signed (AI Nodal)
                </div>
                <div className="w-48 border-b border-slate-400 mb-2"></div>
                <p className="text-sm font-semibold">Duty Officer</p>
                <p className="text-xs">Cyber Police Station</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
