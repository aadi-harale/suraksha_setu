'use client';
import { useState } from 'react';
import { FileText, Copy, CheckCircle2, Download } from 'lucide-react';
import { EvidencePacket } from '@/lib/types';

interface ComplaintReadyExportProps {
  packet: EvidencePacket;
}

export default function ComplaintReadyExport({ packet }: ComplaintReadyExportProps) {
  const [copied, setCopied] = useState(false);

  const getSummaryText = () => {
    return `Case ID: ${packet.caseId}
Incident Type: Digital Arrest Scam
Location: ${packet.caseHeader.city}, India
Suspect Caller: ${packet.entities.phones[0] || 'N/A'}
Suspect UPI: ${packet.entities.upis[0] || 'N/A'}
Amount Requested: ${packet.entities.amounts[0] || 'N/A'}
Payment Status: Blocked before transfer
Key Scam Signals: ${packet.highlightedPhrases.map(p => p.category).join(', ')}
Recommended Action: Report via 1930 / cybercrime portal and preserve evidence.`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/80 rounded-xl border border-indigo-500/30 p-6 shadow-xl mb-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-semibold mb-1 flex items-center gap-2 text-indigo-400">
            <FileText className="w-5 h-5" /> Complaint-Ready NCRP/1930 Export
          </h3>
          <p className="text-xs text-slate-400">
            Simulated export of structured data for official cybercrime reporting.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy NCRP Summary'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 relative z-10">
        <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Incident Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Case ID:</span><span className="text-slate-200 font-mono">{packet.caseId}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Incident Type:</span><span className="text-slate-200">Digital Arrest Scam</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Location:</span><span className="text-slate-200">{packet.caseHeader.city}, India</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Risk Score:</span><span className="text-red-400 font-bold">{packet.caseHeader.riskScore}/100</span></div>
          </div>
        </div>

        <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Suspect Entities</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Phone:</span><span className="text-slate-200 font-mono">{packet.entities.phones[0] || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">UPI ID:</span><span className="text-slate-200 font-mono">{packet.entities.upis[0] || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Amount:</span><span className="text-slate-200">{packet.entities.amounts[0] || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Payment Status:</span><span className="text-emerald-400 font-medium">Prevented</span></div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 bg-slate-950 rounded-lg p-4 border border-slate-800 relative z-10">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Simulated Evidence Attachments</h4>
        <div className="flex flex-wrap gap-2">
          {['Transcript.txt', 'Audio_Hash.sha256', 'Fraud_Network_Graph.json', 'Decision_Log.json'].map(file => (
            <span key={file} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700 flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400" /> {file}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
