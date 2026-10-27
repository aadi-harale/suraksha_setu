import { Check } from 'lucide-react';
export type JourneyStage='check'|'understand'|'prepare'|'report';
const STAGES:{id:JourneyStage;title:string}[]=[
 {id:'check',title:'Check'},
 {id:'understand',title:'Understand'},
 {id:'prepare',title:'Prepare'},
 {id:'report',title:'Get official help'}
];
export default function JourneySteps({current,completed=[]}:{current:JourneyStage;completed?:JourneyStage[]}){
 return <nav aria-label="Your preparation journey" className="mb-8 rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
  <ol className="grid grid-cols-2 gap-3 md:grid-cols-4">
   {STAGES.map((step,index)=>{
    const done=completed.includes(step.id);
    const active=step.id===current;
    return <li key={step.id} className="flex min-w-0 items-center gap-3">
     <span aria-hidden="true" className={done?'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-teal-400 bg-teal-400/20 text-teal-200':active?'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-teal-400 bg-teal-400/10 text-teal-100':'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-slate-400'}>{done?<Check size={16}/>:index+1}</span>
     <span className={active?'text-xs font-bold text-white sm:text-sm':'text-xs font-semibold text-slate-400 sm:text-sm'}>{step.title}</span>
    </li>;
   })}
  </ol>
  <p className="mt-3 text-xs leading-5 text-slate-400">Only completed steps receive a check. Official reporting happens separately outside this application.</p>
 </nav>;
}
