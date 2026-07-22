'use client';
import { useState } from 'react';
import { Database, ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { getAllSuspects, SuspectRecord } from '@/lib/mock-suspect-repository';

export default function SuspectRepositoryTable() {
  const [activeTab, setActiveTab] = useState<'All' | 'UPI' | 'Phone' | 'Bank Account'>('All');
  const suspects = getAllSuspects();

  const filteredSuspects = activeTab === 'All' 
    ? suspects 
    : suspects.filter(s => s.type === activeTab);

  return (
    <div className="glass-panel rounded-xl border border-slate-800 flex flex-col shadow-xl min-h-[400px]">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="font-semibold text-slate-200 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-500" />
          Suspect Repository Intelligence
        </h3>
        
        <div className="flex gap-2">
          {['All', 'UPI', 'Phone', 'Bank Account'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-800">
              <th className="pb-3 pl-2 font-semibold">Entity</th>
              <th className="pb-3 font-semibold">Type</th>
              <th className="pb-3 font-semibold">Complaints</th>
              <th className="pb-3 font-semibold">Risk</th>
              <th className="pb-3 font-semibold">Last Seen</th>
              <th className="pb-3 font-semibold text-right pr-2">Simulated Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredSuspects.map((suspect, i) => (
              <tr key={suspect.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                <td className="py-3 pl-2 font-mono text-slate-300">{suspect.entity}</td>
                <td className="py-3 text-slate-400">{suspect.type}</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    suspect.linkedComplaints > 5 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                    suspect.linkedComplaints > 0 ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {suspect.linkedComplaints}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${
                    suspect.risk === 'Critical' ? 'text-red-400' :
                    suspect.risk === 'High' ? 'text-orange-400' :
                    suspect.risk === 'Clean' ? 'text-emerald-400' : 'text-yellow-400'
                  }`}>
                    {suspect.risk === 'Critical' && <ShieldAlert className="w-3.5 h-3.5" />}
                    {suspect.risk === 'High' && <AlertTriangle className="w-3.5 h-3.5" />}
                    {suspect.risk === 'Clean' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {suspect.risk}
                  </span>
                </td>
                <td className="py-3 text-xs text-slate-400 truncate max-w-[150px]">
                  {suspect.lastSeen || suspect.role || '-'}
                </td>
                <td className="py-3 pr-2 text-right">
                  <button className="text-xs bg-slate-800 hover:bg-indigo-900/50 text-indigo-300 border border-slate-700 hover:border-indigo-500/50 px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ml-auto">
                    {suspect.type === 'Bank Account' ? 'Simulate Bank Freeze' : 'Escalate to Telecom'}
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-slate-800 bg-slate-950 rounded-b-xl text-center">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">
          Demo Workflow: All escalation actions are simulated
        </span>
      </div>
    </div>
  );
}
