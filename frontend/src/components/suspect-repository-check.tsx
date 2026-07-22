import { Database, AlertTriangle, MapPin, Activity } from 'lucide-react';
import { SuspectRecord } from '@/lib/mock-suspect-repository';

interface SuspectRepositoryCheckProps {
  record: SuspectRecord;
}

export default function SuspectRepositoryCheck({ record }: SuspectRepositoryCheckProps) {
  const isCritical = record.risk === 'Critical';
  const isHigh = record.risk === 'High';
  const isClean = record.risk === 'Clean';

  let borderClass = 'border-slate-800';
  let bgClass = 'bg-slate-950/50';
  let textClass = 'text-slate-400';
  let statusText = 'No Match Found';

  if (isCritical) {
    borderClass = 'border-red-500/50';
    bgClass = 'bg-red-500/10';
    textClass = 'text-red-400';
    statusText = 'Complaint Match Found';
  } else if (isHigh) {
    borderClass = 'border-orange-500/50';
    bgClass = 'bg-orange-500/10';
    textClass = 'text-orange-400';
    statusText = 'Complaint Match Found';
  } else if (isClean) {
    borderClass = 'border-emerald-500/50';
    bgClass = 'bg-emerald-500/10';
    textClass = 'text-emerald-400';
    statusText = 'No Complaints Found';
  }

  return (
    <div className={`rounded-xl border ${borderClass} p-5 relative overflow-hidden transition-all duration-300`}>
      <div className={`absolute top-0 right-0 w-32 h-32 ${bgClass} blur-3xl rounded-full`}></div>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
            <Database className="w-4 h-4" />
            Complaint Repository Check
          </h3>
        </div>
        <div className={`${bgClass} ${borderClass} border text-xs px-3 py-1 rounded-full font-mono flex items-center gap-1 ${textClass}`}>
          <AlertTriangle className="w-3 h-3" />
          {statusText}
        </div>
      </div>

      <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-800 relative z-10">
        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block mb-1">Entity ({record.type})</span>
            <span className="text-sm font-mono text-slate-200 font-bold">{record.entity}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block mb-1">Linked Complaints</span>
            <span className={`text-sm font-bold ${textClass}`}>{record.linkedComplaints} matches</span>
          </div>
          
          {(record.lastSeen || record.scamTypes || record.linkedCluster) && (
            <>
              {record.lastSeen && (
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Last Seen Locations</span>
                  <span className="text-xs text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {record.lastSeen}
                  </span>
                </div>
              )}
              {record.scamTypes && (
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Used In Scripts</span>
                  <span className="text-xs text-slate-300 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-slate-400" />
                    {record.scamTypes}
                  </span>
                </div>
              )}
              {record.linkedCluster && (
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Linked Cluster</span>
                  <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                    {record.linkedCluster}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <p className="text-[10px] text-slate-500 mt-4 italic relative z-10">
        * Complaint-derived supporting signal only. Not proof of guilt. Absence of a match does not mean the entity is safe.
      </p>
    </div>
  );
}
