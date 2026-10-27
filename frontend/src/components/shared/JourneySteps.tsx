import Link from 'next/link';
import { Check } from 'lucide-react';
export type JourneyStage='check'|'understand'|'prepare'|'report';
const STAGES:{id:JourneyStage;title:string;href:string}[]=[
 {id:'check',title:'Check',href:'/check'},
 {id:'understand',title:'Understand',href:'/check'},
 {id:'prepare',title:'Prepare',href:'/reports'},
 {id:'report',title:'Get official help',href:'/help'}
];
export default function JourneySteps({current}:{current:JourneyStage}){
 const active=STAGES.findIndex(s=>s.id===current);
 return <nav aria-label="Your journey" className="mb-8 rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
   <ol className="grid grid-cols-2 gap-3 md:grid-cols-4">
    {STAGES.map((step,index)=>{
     const reached=index<=active;
     return <li key={step.id} className="flex min-w-0 items-center gap-3">
      <span aria-hidden="true" className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${reached?'border-teal-400 bg-teal-400/15 text-teal-200':'border-slate-600 bg-slate-800 text-slate-400'}`}>{index<active?<Check size={16}/>:index+1}</span>
      <span className={`text-xs font-semibold sm:text-sm ${index===active?'text-white':'text-slate-400'}`}>{step.title}</span>
     </li>;
    })}
   </ol>
   <p className="mt-3 text-xs leading-5 text-slate-400">Guided preparation only. The final step happens through official reporting services, not inside Suraksha Setu.</p>
 </nav>;
}