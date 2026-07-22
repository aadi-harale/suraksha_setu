import { CheckCircle2, ShieldAlert, Target } from 'lucide-react';
import { DemoScenario } from '@/lib/types';

export default function KillChainStage({ 
  scenario, 
  progress 
}: { 
  scenario: DemoScenario, 
  progress: number 
}) {
  const allStages = [
    { id: 1, name: "Authority Impersonation" },
    { id: 2, name: "Fear Creation" },
    { id: 3, name: "Victim Isolation" },
    { id: 4, name: "Continuous Control" },
    { id: 5, name: "Payment Extraction" },
    { id: 6, name: "Mule Laundering" }
  ];

  // Determine current stage based on progress
  let currentStage = 0;
  const stagesCompleted: number[] = [];
  
  if (scenario.killChainStagesAt) {
    for (const [stageStr, threshold] of Object.entries(scenario.killChainStagesAt)) {
      const stageId = parseInt(stageStr);
      if (progress >= threshold) {
        currentStage = Math.max(currentStage, stageId);
        if (!stagesCompleted.includes(stageId)) {
          stagesCompleted.push(stageId);
        }
      }
    }
  }

  // Predict next stage
  const nextStage = currentStage < 6 ? currentStage + 1 : null;
  const predictedNext = nextStage ? allStages.find(s => s.id === nextStage)?.name : null;
  const confidence = 87; // Mock confidence for the feature

  const intervention = currentStage >= 4 
    ? "Alert trusted contact + block payment gateways."
    : "Soft contextual warning. Advise user to verify caller.";

  return (
    <div className="glass-panel bg-slate-900/80 rounded-xl border border-slate-800 p-6 flex-1 shadow-xl flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Kill-Chain Intelligence</h3>
        {scenario.languageMode && (
          <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
            Language: {scenario.languageMode}
          </span>
        )}
      </div>
      
      <div className="space-y-2 flex-1">
        {allStages.map(stage => {
          const isCompleted = stagesCompleted.includes(stage.id);
          const isActive = currentStage === stage.id;
          const isPredicted = nextStage === stage.id;

          let statusClass = "text-slate-600";
          if (isCompleted) statusClass = "text-emerald-500";
          if (isActive) statusClass = "text-red-400 font-bold bg-red-500/10 p-1 rounded";
          if (isPredicted) statusClass = "text-amber-500 font-bold border border-amber-500/30 bg-amber-500/10 p-1 rounded border-dashed";

          return (
            <div key={stage.id} className={`flex items-center justify-between text-sm ${statusClass} transition-all`}>
               <span className="flex items-center gap-2">
                 {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : 
                  isActive ? <Target className="w-4 h-4 animate-pulse" /> :
                  <div className="w-4 h-4 rounded-full border border-current opacity-50"></div>}
                 Stage {stage.id}: {stage.name}
               </span>
               <span className="text-xs uppercase tracking-wider">
                 {isCompleted ? 'Detected' : isActive ? 'Active' : isPredicted ? 'Predicted Next' : 'Pending'}
               </span>
            </div>
          );
        })}
      </div>

      {currentStage > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
           <div className="flex justify-between items-center">
             <span className="text-xs text-slate-400">Current Stage</span>
             <span className="text-xs font-bold text-red-400">{allStages.find(s => s.id === currentStage)?.name}</span>
           </div>
           {nextStage && (
             <div className="flex justify-between items-center">
               <span className="text-xs text-slate-400">Predicted Next Stage</span>
               <span className="text-xs font-bold text-amber-400">{predictedNext}</span>
             </div>
           )}
           <div className="flex justify-between items-center mb-2">
             <span className="text-xs text-slate-400">Prediction Confidence</span>
             <span className="text-xs font-bold text-amber-400">{confidence}%</span>
           </div>
           <div className="bg-slate-800/50 p-3 rounded text-xs border border-slate-700">
             <span className="text-slate-400 block mb-1">Recommended Intervention:</span>
             <span className="text-slate-200">{intervention}</span>
           </div>
        </div>
      )}
    </div>
  );
}
