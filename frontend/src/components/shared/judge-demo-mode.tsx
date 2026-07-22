'use client';

import { Play, FastForward, CheckCircle2, Circle } from 'lucide-react';

interface JudgeDemoModeProps {
  currentStep: number;
  isActive: boolean;
  onStartDemo: () => void;
}

export const DEMO_STEPS = [
  "Scam call starts",
  "Transcript parsing",
  "Risk score escalation",
  "Kill-chain progression",
  "Reality Check triggers",
  "Suspect Repository match",
  "Simulated payment attempt",
  "Payment block intervention",
  "Trusted contact alert",
  "AI triage & Evidence export"
];

export default function JudgeDemoMode({ currentStep, isActive, onStartDemo }: JudgeDemoModeProps) {
  if (!isActive) {
    return (
      <button 
        onClick={onStartDemo}
        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all border border-indigo-400/50"
      >
        <Play className="w-4 h-4 fill-white" />
        Start 3-Minute Judge Demo
      </button>
    );
  }

  const progressPercentage = ((currentStep) / DEMO_STEPS.length) * 100;

  return (
    <div className="bg-slate-900/90 border border-indigo-500/30 rounded-lg p-3 shadow-xl w-full max-w-2xl mx-auto mb-4 animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FastForward className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-bold text-slate-200">Judge Demo Sequence Active</span>
        </div>
        <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded">
          Step {Math.min(currentStep + 1, DEMO_STEPS.length)} / {DEMO_STEPS.length}
        </span>
      </div>
      
      <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 overflow-hidden">
        <div 
          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {DEMO_STEPS.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          const isPending = currentStep < index;
          
          return (
            <div key={index} className={`flex items-center gap-1 text-[10px] ${
              isCompleted ? 'text-emerald-400' : 
              isCurrent ? 'text-indigo-300 font-bold' : 
              'text-slate-600'
            }`}>
              {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : 
               isCurrent ? <Circle className="w-3 h-3 fill-indigo-500/20" /> : 
               <Circle className="w-3 h-3" />}
              <span className="truncate max-w-[120px]" title={step}>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
