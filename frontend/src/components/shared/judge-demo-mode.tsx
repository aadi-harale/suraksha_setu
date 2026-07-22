'use client';

import { FastForward, CheckCircle2, Circle } from 'lucide-react';

interface JudgeDemoModeProps {
  currentStep: number;
  isActive: boolean;
  onStartDemo: () => void;
}

export const DEMO_STEPS = [
  { title: "Suspicious call begins", insight: "Detection starts during the call, not after the complaint." },
  { title: "Transcript simulation starts", insight: "Speech/text signals are converted into explainable risk evidence." },
  { title: "Risk score rises", insight: "Risk is based on multiple signals, not one keyword." },
  { title: "Kill-chain stage progresses", insight: "SurakshaNet maps the scam lifecycle, not just scam/safe." },
  { title: "Reality Check appears", insight: "The system breaks victim isolation with simple safety guidance." },
  { title: "Suspect Repository match appears", insight: "Suspicious UPI/phone entities become investigation intelligence." },
  { title: "Simulated payment attempt appears", insight: "Intervention happens before money loss." },
  { title: "Payment block simulation triggers", insight: "The strongest impact moment is payment prevention." },
  { title: "AI triage summary appears", insight: "LLM assists explanation and complaint drafting, but does not decide risk." },
  { title: "Complaint-ready packet generated", insight: "The case becomes structured, tamper-evident, and ready for reporting workflow." }
];

export default function JudgeDemoMode({ currentStep, isActive }: JudgeDemoModeProps) {
  if (!isActive) return null;

  const currentStepData = DEMO_STEPS[Math.min(currentStep, DEMO_STEPS.length - 1)] || DEMO_STEPS[0];
  const progressPercentage = ((currentStep + 1) / DEMO_STEPS.length) * 100;

  return (
    <div className="bg-slate-900/90 border border-indigo-500/30 rounded-lg p-4 shadow-xl w-full max-w-4xl mx-auto mb-4 animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FastForward className="w-5 h-5 text-indigo-400 animate-pulse" />
          <span className="text-base font-bold text-slate-200 uppercase tracking-wider">Judge Demo Sequence Active</span>
        </div>
        <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
          Step {Math.min(currentStep + 1, DEMO_STEPS.length)} / {DEMO_STEPS.length}
        </span>
      </div>
      
      <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden shadow-inner">
        <div 
          className="bg-indigo-500 h-2 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-md p-3 mb-4">
        <div className="text-indigo-200 text-sm font-semibold mb-1">Current Step: {currentStepData.title}</div>
        <div className="text-indigo-100/70 text-xs italic">
          <span className="font-bold text-indigo-300 not-italic mr-1">Judge insight:</span> 
          {currentStepData.insight}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {DEMO_STEPS.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          
          return (
            <div key={index} className={`flex items-center gap-1.5 text-[11px] ${
              isCompleted ? 'text-emerald-400' : 
              isCurrent ? 'text-indigo-300 font-bold' : 
              'text-slate-600'
            }`}>
              {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
               isCurrent ? <Circle className="w-3.5 h-3.5 fill-indigo-500/20" /> : 
               <Circle className="w-3.5 h-3.5" />}
              <span className="truncate max-w-[140px]" title={step.title}>{step.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
