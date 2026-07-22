'use client';

import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { VALIDATION_METRICS } from '@/lib/mock-data';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { EvidencePDF } from '@/components/validation/EvidencePDF';
import { EvidencePacket } from '@/lib/types';
import ModelMetrics from '@/components/validation/ModelMetrics';
import ConfusionMatrix from '@/components/validation/ConfusionMatrix';
import BaselineComparison from '@/components/validation/BaselineComparison';
import FalsePositiveQueue from '@/components/validation/false-positive-queue';
import ComplaintReadyExport from '@/components/validation/complaint-ready-export';
import RubricMapping from '@/components/validation/rubric-mapping';
import FIRGenerator from '@/components/validation/FIRGenerator';
import PrototypeScopeCard from '@/components/validation/PrototypeScopeCard';

import { mockEvidenceData } from '@/lib/case-packet-utils';

export default function EvidencePage() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div className="min-h-full flex flex-col p-6 max-w-7xl mx-auto gap-6 relative">
      <header className="glass-panel p-6 rounded-xl border border-white/10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none translate-y-1/2 -translate-x-1/4"></div>
        
        <h1 className="text-3xl font-bold text-white mb-2 relative z-10">Evidence, Benchmark & Complaint Workflow</h1>
        <p className="text-slate-400 max-w-2xl mx-auto relative z-10">
          Low false-positive handling, complaint-ready export, fraud campaign lead-time, and tamper-evident case packaging.
        </p>
      </header>

      <RubricMapping />

      <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left: Validation Metrics */}
        <div className="flex flex-col gap-6">
           <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-5 h-5" /> Curated Scenario Benchmark
              </h3>
              <p className="text-xs text-slate-400 mb-6 italic">12 curated scenarios (9 scam, 3 legitimate) used for controlled demo testing. This is not a production-scale real-world validation dataset.</p>
              
              <ModelMetrics />
              <ConfusionMatrix />
           </div>
           
           <PrototypeScopeCard />
           <BaselineComparison />
           <FalsePositiveQueue />
        </div>

        {/* Right: Evidence Packet Preview */}
        <div className="flex flex-col">
           <ComplaintReadyExport packet={mockEvidenceData} />

           <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-6 shadow-xl flex flex-col flex-1">
             <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-300">
               <FileText className="w-5 h-5" /> Tamper-Evident Investigation Packet Preview
             </h3>
           
           <div className="flex-1 bg-white rounded-lg p-8 shadow-inner overflow-y-auto mb-4 text-slate-800 font-sans border border-slate-200">
              {/* Fake PDF preview */}
              <div className="border-b-2 border-slate-800 pb-4 mb-6">
                 <div className="flex justify-between items-start">
                    <div>
                       <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">Investigation Packet</h1>
                       <p className="text-sm text-slate-500 font-mono">ID: SEC-2026-07-8892 • TS: {new Date().toISOString()}</p>
                    </div>
                    <div className="text-right">
                       <h2 className="text-xl font-bold text-red-600">ACTIVE SCAM</h2>
                       <p className="text-sm font-semibold">Score: 92 / 100</p>
                    </div>
                 </div>
              </div>

              <div className="mb-6">
                 <h3 className="text-sm font-bold bg-slate-200 px-2 py-1 mb-2">1. INCIDENT SUMMARY</h3>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-semibold text-slate-500">Category:</span> Authority Impersonation (CBI)</div>
                    <div><span className="font-semibold text-slate-500">Location:</span> Mumbai, Maharashtra</div>
                    <div><span className="font-semibold text-slate-500">Target:</span> Aadi</div>
                    <div><span className="font-semibold text-slate-500">Kill Chain:</span> Stage 5 (Payment)</div>
                 </div>
              </div>

              <div className="mb-6">
                 <h3 className="text-sm font-bold bg-slate-200 px-2 py-1 mb-2">2. EXTRACTED ENTITIES</h3>
                 <table className="w-full text-sm text-left border-collapse">
                    <thead>
                       <tr className="border-b border-slate-300">
                          <th className="py-2">Type</th>
                          <th className="py-2">Value</th>
                          <th className="py-2">Risk</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr className="border-b border-slate-100">
                          <td className="py-2 font-medium">Phone</td>
                          <td className="py-2 font-mono">+91-9876543210</td>
                          <td className="py-2 text-red-600">High</td>
                       </tr>
                       <tr className="border-b border-slate-100">
                          <td className="py-2 font-medium">UPI ID</td>
                          <td className="py-2 font-mono">rbi.verify@okaxis</td>
                          <td className="py-2 text-red-600">Critical</td>
                       </tr>
                       <tr className="border-b border-slate-100">
                          <td className="py-2 font-medium">Amount</td>
                          <td className="py-2">₹48,000</td>
                          <td className="py-2">-</td>
                       </tr>
                    </tbody>
                 </table>
              </div>

              <div className="mb-6">
                 <h3 className="text-sm font-bold bg-slate-200 px-2 py-1 mb-2">3. KEY PHRASES DETECTED</h3>
                 <ul className="list-disc pl-5 text-sm space-y-1 text-slate-700">
                    <li>"DCP Sharma from the Central Bureau of Investigation"</li>
                    <li>"money laundering"</li>
                    <li>"non-bailable offence"</li>
                    <li>"under digital arrest"</li>
                    <li>"security deposit of ₹48,000"</li>
                 </ul>
              </div>

              <div className="mb-6">
                  <h3 className="text-sm font-bold bg-slate-200 px-2 py-1 mb-2">4. SYNTHETIC VOICE ANALYSIS — SUPPORTING SIGNAL</h3>
                  <p className="text-sm text-slate-700">
                    Vocal Stress Index: 73/100 (High Distress). Spectral flatness anomalies detected. <em className="text-slate-500">Supporting signal only — not standalone proof.</em>
                  </p>
               </div>

               <div className="mb-6">
                  <h3 className="text-sm font-bold bg-slate-200 px-2 py-1 mb-2">5. TAMPER-EVIDENT METADATA</h3>
                  <div className="font-mono text-xs text-slate-700 space-y-1">
                    <div className="flex gap-2"><span className="text-slate-500 w-40 shrink-0">Case ID:</span> <span>SN-2026-07-8892</span></div>
                    <div className="flex gap-2"><span className="text-slate-500 w-40 shrink-0">Generated At:</span> <span>{new Date().toLocaleString()}</span></div>
                    <div className="flex gap-2"><span className="text-slate-500 w-40 shrink-0">Transcript SHA256:</span> <span className="text-[10px] break-all">e3b0c44298fc1c149afbf4c8996fb924...b855</span></div>
                    <div className="flex gap-2"><span className="text-slate-500 w-40 shrink-0">Audio SHA256:</span> <span className="text-[10px] break-all">8a1e2b5b3a6e8f4c8b2a1a4f5b6c7d8e...b4c</span></div>
                    <div className="flex gap-2"><span className="text-slate-500 w-40 shrink-0">Entity Hash:</span> <span className="text-[10px]">5d41402abc4b2a76b9719d911017c592</span></div>
                    <div className="flex gap-2"><span className="text-slate-500 w-40 shrink-0">Risk Engine:</span> <span>v1.0.3</span></div>
                    <div className="flex gap-2"><span className="text-slate-500 w-40 shrink-0">Decision Events:</span> <span>6</span></div>
                    <div className="flex gap-2"><span className="text-slate-500 w-40 shrink-0">Source Mode:</span> <span>Demo Transcript Simulation</span></div>
                  </div>
               </div>

               <div className="mb-4">
                  <h3 className="text-sm font-bold bg-slate-200 px-2 py-1 mb-2">6. DECISION LOG</h3>
                  <div className="text-xs text-slate-700 space-y-1 font-mono">
                    <div className="flex gap-3"><span className="text-slate-400">08:42:11</span><span>Authority impersonation detected</span></div>
                    <div className="flex gap-3"><span className="text-slate-400">08:42:19</span><span>Legal threat detected</span></div>
                    <div className="flex gap-3"><span className="text-slate-400">08:42:27</span><span>Isolation instruction detected</span></div>
                    <div className="flex gap-3"><span className="text-slate-400">08:42:36</span><span>Payment demand detected</span></div>
                    <div className="flex gap-3"><span className="text-slate-400">08:42:40</span><span>Critical warning triggered</span></div>
                    <div className="flex gap-3"><span className="text-slate-400">08:42:45</span><span>Trusted contact alert simulated</span></div>
                  </div>
               </div>
               <p className="text-[9px] text-slate-400 italic border-t border-slate-200 pt-2">This is a tamper-evident investigation-ready packet for demo purposes only. Not a court-admissible legal document.</p>
           </div>

           {isClient ? (
             <PDFDownloadLink
               document={<EvidencePDF data={mockEvidenceData} />}
               fileName={`evidence-packet-${mockEvidenceData.caseId}.pdf`}
               className="w-full bg-slate-100 hover:bg-white text-slate-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 border border-slate-300 transition-colors"
             >
               <FileText className="w-5 h-5" /> Download PDF Packet
             </PDFDownloadLink>
           ) : (
             <button disabled className="w-full bg-slate-100/50 text-slate-900/50 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 border border-slate-300">
               <FileText className="w-5 h-5" /> Loading PDF Generator...
             </button>
           )}

           <FIRGenerator caseData={mockEvidenceData} />
         </div>
        </div>
      </div>
    </div>
  );
}
