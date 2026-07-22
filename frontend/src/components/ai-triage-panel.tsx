import { useEffect, useState } from 'react';
import { Bot, Shield, AlertTriangle, UserCheck, Search, Info } from 'lucide-react';
import { DemoScenario } from '@/lib/types';
import { TriageResponse } from '@/lib/openrouter-triage';

interface AiTriagePanelProps {
  scenario: DemoScenario;
  currentRiskScore: number;
}

export default function AiTriagePanel({ scenario, currentRiskScore }: AiTriagePanelProps) {
  const [triage, setTriage] = useState<TriageResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only run if risk is high/critical
    if (currentRiskScore < 75) return;
    
    // Don't re-run if we already have it for this scenario
    if (triage) return;

    let mounted = true;

    const fetchTriage = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/ai-triage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript: scenario.transcript,
            entities: scenario.entities,
            riskScore: currentRiskScore,
            killChainStage: scenario.expectedCategory,
            scenarioType: scenario.type
          })
        });
        const data = await res.json();
        if (mounted) {
          setTriage(data);
        }
      } catch (error) {
        console.error('Failed to fetch triage', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTriage();

    return () => {
      mounted = false;
    };
  }, [currentRiskScore, scenario, triage]);

  // Reset triage if scenario changes
  useEffect(() => {
    setTriage(null);
  }, [scenario.id]);

  if (currentRiskScore < 75 && !triage) return null;

  return (
    <div className="bg-slate-900/80 rounded-xl border border-blue-500/30 p-5 mt-6 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="font-semibold text-blue-400 flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Case Triage
          </h3>
          <p className="text-xs text-slate-400 mt-1">LLM-generated summary for investigators</p>
        </div>
        <div className="flex gap-2">
          {triage && (
            <div className={`px-2 py-1 rounded text-[10px] font-mono border flex items-center gap-1 ${
              triage.isSimulated 
                ? 'bg-slate-800 text-slate-400 border-slate-700' 
                : 'bg-blue-900/50 text-blue-300 border-blue-500/50'
            }`}>
              {triage.isSimulated ? 'Simulated AI' : 'Live LLM'}
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3 mb-4 flex items-start gap-2 relative z-10">
         <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
         <p className="text-[10px] text-blue-200">
           LLM-generated triage summary. Final risk score is based on hybrid signal engine, not LLM alone.
         </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : triage ? (
        <div className="space-y-4 relative z-10">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Summary</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{triage.summary}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-400" /> Top Risk Indicators
            </h4>
            <ul className="list-disc ml-5 text-sm text-slate-300 space-y-1">
              {triage.riskIndicators.map((indicator, i) => (
                <li key={i}>{indicator}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/50 p-3 rounded border border-slate-800">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-400" /> Citizen Action
              </h4>
              <p className="text-xs text-slate-300">{triage.citizenAction}</p>
            </div>
            <div className="bg-slate-950/50 p-3 rounded border border-slate-800">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Search className="w-3 h-3 text-indigo-400" /> Investigator Action
              </h4>
              <p className="text-xs text-slate-300">{triage.investigatorAction}</p>
            </div>
          </div>

          {triage.uncertainties && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Uncertainties</h4>
              <p className="text-xs text-slate-400 italic">{triage.uncertainties}</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
