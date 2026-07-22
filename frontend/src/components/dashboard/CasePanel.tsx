import { FileText, ChevronRight } from 'lucide-react';
import { ACTIVE_ALERTS } from '@/lib/mock-data';
import Link from 'next/link';

export default function CasePanel() {
  const recentCase = ACTIVE_ALERTS[0];

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col shadow-xl h-full">
       <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" /> Recent Case
          </h3>
       </div>
       <div className="flex-1 p-4 flex flex-col">
          <div className="mb-4">
             <div className="text-sm text-slate-400 mb-1">Case ID: {recentCase.id}</div>
             <div className="text-lg font-bold text-white mb-2">{recentCase.title}</div>
             <p className="text-sm text-slate-300">{recentCase.message}</p>
          </div>
          
          <div className="mt-auto">
             <Link href="/evidence" className="w-full flex items-center justify-between bg-slate-800 hover:bg-slate-700 text-white font-medium p-3 rounded-lg transition-colors text-sm">
                View Evidence Packet
                <ChevronRight className="w-4 h-4 text-slate-400" />
             </Link>
          </div>
       </div>
    </div>
  );
}
