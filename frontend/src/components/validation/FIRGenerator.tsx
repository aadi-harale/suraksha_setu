'use client';
import { useState } from 'react';
import { FileText, Shield } from 'lucide-react';
import { EvidencePacket } from '@/lib/types';
import FIRPreviewModal from './FIRPreviewModal';

interface FIRGeneratorProps {
  caseData: EvidencePacket;
}

export default function FIRGenerator({ caseData }: FIRGeneratorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mt-4">
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 border border-slate-700 transition-colors shadow-lg group"
      >
        <Shield className="w-5 h-5 text-indigo-400 group-hover:animate-pulse" /> 
        Generate Complaint/FIR Draft for Review
      </button>

      <FIRPreviewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        caseData={caseData}
      />
    </div>
  );
}
