'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, BookOpen, Check, CircleAlert, ClipboardCheck, Download, ExternalLink, FileText, FolderOpen, LockKeyhole, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';
import JourneySteps from '@/components/shared/JourneySteps';
import { DEMO_CASES, type DemoCase } from '@/lib/demo-cases';
import { TraceEngine } from '@/lib/trace-engine';
import { clearReports, deleteReport, downloadReport, markReportStep, readReports, type LocalReport, type CaseMilestone } from '@/lib/local-reports';

type Tab='examples'|'personal';
function exampleIndicators(s:DemoCase){
 const engine=new TraceEngine();
 engine.addEvidence({id:'example',caseId:s.id,text:s.transcript,sourceLabel:'Fictional learning example',recordedAt:'2026-10-01T00:00:00Z'});
 const assessment=engine.assess(s.id);
 return {score:assessment.score,stage:assessment.stage,indicators:[...new Set(assessment.signals.map(x=>x.kind))]};
}
export default function ReportsPage(){
 const [tab,setTab]=useState<Tab>('examples');
 const [reports,setReports]=useState<LocalReport[]>([]);
 const [loaded,setLoaded]=useState(false);
 const [selected,setSelected]=useState<string>(DEMO_CASES[0].id);
 const [query,setQuery]=useState('');
 const [message,setMessage]=useState('');
 useEffect(()=>{
  const drafts=readReports();setReports(drafts);
  const id=new URLSearchParams(window.location.search).get('case');
  if(id&&drafts.some(r=>r.id===id)){setTab('personal');setSelected(id);}
  setLoaded(true);
 },[]);
 const filteredExamples=useMemo(()=>DEMO_CASES.filter(s=>(s.title+' '+s.category+' '+s.summary).toLowerCase().includes(query.toLowerCase())),[query]);
 const filteredDrafts=useMemo(()=>reports.filter(s=>(s.title+' '+s.stage+' '+s.channel).toLowerCase().includes(query.toLowerCase())),[query,reports]);
 const demo=tab==='examples'?DEMO_CASES.find(x=>x.id===selected)??filteredExamples[0]:undefined;
 const draft=tab==='personal'?reports.find(x=>x.id===selected)??filteredDrafts[0]:undefined;
 const assessment=useMemo(()=>demo?exampleIndicators(demo):null,[demo]);
 function switchTab(next:Tab){setTab(next);setQuery('');setMessage('');setSelected(next==='examples'?DEMO_CASES[0].id:(reports[0]?.id??''));}
 function refresh(){setReports(readReports());}
 function step(id:string,milestone:CaseMilestone){
  try{
   if(milestone==='reportedByUserAt'&&!window.confirm('Confirm that YOU contacted an official reporting channel outside this application. Suraksha Setu cannot verify or submit the report.'))return;
   markReportStep(id,milestone);refresh();
   setMessage(milestone==='reportedByUserAt'?'Your self-reported follow-up is recorded locally. No official acknowledgment has been verified.':'Draft progress saved to this browser.');
  }catch(e){setMessage(e instanceof Error?e.message:'Could not update local draft.');}
 }
 function download(r:LocalReport){
  try{downloadReport(r);step(r.id,'exportedAt');}catch(e){setMessage(e instanceof Error?e.message:'Export failed.');}
 }
 function remove(id:string){
  if(!window.confirm('Delete this personal draft from this browser? This cannot be undone.'))return;
  try{deleteReport(id);refresh();setSelected('');setMessage('The personal draft was deleted.');}
  catch{setMessage('Could not delete this draft.');}
 }
 function clear(){
  if(!window.confirm('Delete ALL your personal drafts from this browser? Fictional example cases will remain available.'))return;
  try{clearReports();refresh();setSelected('');setMessage('All personal drafts were cleared. Fictional examples are unchanged.');}
  catch{setMessage('Could not clear saved drafts.');}
 }
 const milestones=draft?[
  {key:'reviewedAt' as CaseMilestone,title:'Review the information',copy:'Check what you wrote and keep original records separately.',done:Boolean(draft.workflow?.reviewedAt)},
  {key:'exportedAt' as CaseMilestone,title:'Download a copy',copy:'Keep a local text draft that you can reference when reporting.',done:Boolean(draft.workflow?.exportedAt)},
  {key:'reportedByUserAt' as CaseMilestone,title:'Report through an official channel',copy:'Use cybercrime.gov.in or 1930. Mark this only if you actually contacted them.',done:Boolean(draft.workflow?.reportedByUserAt)}
 ]:[];
 return <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16">
  <header className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
   <div><p className="product-kicker">Your case workspace</p><h1 className="mt-3 text-3xl font-extrabold md:text-4xl">Understand cases. Keep your drafts.</h1><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">Explore realistic fictional examples or manage the private drafts you choose to save. No information here is an official police record.</p></div>
   <Link href="/check" className="product-btn product-btn-primary shrink-0"><Plus size={18}/>Start a new check</Link>
  </header>
  <JourneySteps current="prepare"/>
  <div className="mb-6 flex items-start gap-3 rounded-xl border border-teal-400/25 bg-teal-500/5 p-4 text-sm leading-6 text-slate-200"><ShieldCheck size={20} className="mt-0.5 shrink-0 text-teal-300"/>Fictional examples are part of the application. They are not automatically saved to your browser. Personal drafts are separate and remain only in this browser using unencrypted local storage.</div>
  {message&&<p role="status" className="mb-5 rounded-xl border border-slate-600 bg-slate-900 p-4 text-sm">{message}</p>}
  <div className="mb-6 inline-flex flex-wrap gap-2 rounded-2xl border border-slate-700 bg-slate-900/70 p-2" role="tablist" aria-label="Case collections">
   <button role="tab" aria-selected={tab==='examples'} onClick={()=>switchTab('examples')} className={tab==='examples'?'rounded-xl bg-teal-400/15 px-5 py-3 text-sm font-bold text-teal-200':'rounded-xl px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800'}><BookOpen size={16} className="mr-2 inline"/>Example cases ({DEMO_CASES.length})</button>
   <button role="tab" aria-selected={tab==='personal'} onClick={()=>switchTab('personal')} className={tab==='personal'?'rounded-xl bg-teal-400/15 px-5 py-3 text-sm font-bold text-teal-200':'rounded-xl px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800'}><FolderOpen size={16} className="mr-2 inline"/>My drafts ({loaded?reports.length:'…'})</button>
  </div>
  <div className="grid gap-5 lg:grid-cols-[minmax(0,345px)_minmax(0,1fr)]">
   <aside className="product-panel min-w-0 p-4">
    <div className="mb-4 flex items-center justify-between px-2"><h2 className="font-bold">{tab==='examples'?'Scenario library':'Personal drafts'}</h2>{tab==='personal'&&reports.length>0&&<button onClick={clear} className="text-xs font-semibold text-rose-300 underline">Clear all</button>}</div>
    <label className="relative block"><span className="sr-only">Search cases</span><Search size={17} className="absolute left-3 top-4 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search cases" className="product-input pl-10"/></label>
    <div className="mt-4 space-y-2">
     {tab==='examples'&&filteredExamples.map(s=><button key={s.id} onClick={()=>{setSelected(s.id);setMessage('');}} className={selected===s.id?'w-full rounded-xl border border-teal-400/60 bg-teal-500/10 p-4 text-left':'w-full rounded-xl border border-slate-700 p-4 text-left hover:border-slate-500'}>
      <span className="mb-2 inline-flex rounded-full border border-slate-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">Fictional · {s.isLegitimate?'comparison':'warning signs'}</span>
      <span className="block text-sm font-bold text-white">{s.title}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{s.summary}</span>
     </button>)}
     {tab==='personal'&&filteredDrafts.map(r=><button key={r.id} onClick={()=>{setSelected(r.id);setMessage('');}} className={selected===r.id?'w-full rounded-xl border border-teal-400/60 bg-teal-500/10 p-4 text-left':'w-full rounded-xl border border-slate-700 p-4 text-left hover:border-slate-500'}>
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Personal · saved locally</span><span className="mt-1 block truncate text-sm font-bold">{r.title}</span>
      <span className="mt-1 block text-xs text-slate-400">{new Date(r.createdAt).toLocaleString('en-IN')}</span>
     </button>)}
     {(tab==='examples'?filteredExamples.length===0:filteredDrafts.length===0)&&<p className="px-3 py-5 text-sm text-slate-400">{query?'No cases match your search.':tab==='personal'?'You have not saved any personal cases yet.':'No examples found.'}</p>}
    </div>
    {tab==='personal'&&<p className="mt-5 border-t border-slate-700 pt-4 text-xs leading-6 text-slate-400"><LockKeyhole size={14} className="mr-1 inline"/>These drafts are unencrypted and tied to this browser, not to a user account.</p>}
   </aside>
   <main className="product-panel min-w-0 p-5 md:p-8">
    {tab==='examples'&&demo&&assessment&&<div className="space-y-6">
     <header><div className="mb-3 flex flex-wrap items-center gap-2"><span className="rounded-full bg-teal-400/15 px-3 py-1 text-xs font-bold text-teal-200">EDUCATIONAL DEMO</span><span className="text-xs capitalize text-slate-400">{demo.category} · {demo.channel}</span></div><h2 className="text-2xl font-bold">{demo.title}</h2><p className="mt-3 text-sm leading-7 text-slate-300">{demo.summary}</p></header>
     <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4"><p className="text-xs text-slate-400">Matched indicators</p><p className="mt-2 text-2xl font-bold">{assessment.indicators.length}</p></div>
      <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4"><p className="text-xs text-slate-400">Heuristic score</p><p className="mt-2 text-2xl font-bold">{assessment.score}<span className="text-sm font-normal text-slate-400">/100</span></p></div>
      <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4"><p className="text-xs text-slate-400">Type</p><p className="mt-2 text-sm font-bold">{demo.isLegitimate?'Legitimate comparison':'Suspected scam example'}</p></div>
     </div>
     <div><h3 className="font-bold">What happened in this example</h3><p className="mt-3 max-h-56 overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-700 bg-slate-950/50 p-4 text-sm leading-7 text-slate-300">{demo.transcript}</p></div>
     <div className="rounded-xl border border-teal-400/25 bg-teal-500/5 p-5"><h3 className="font-bold">What to learn from this case</h3><p className="mt-2 text-sm leading-7 text-slate-200">{demo.teachingPoint}</p><p className="mt-2 text-xs text-slate-400">No rule-based score proves a caller is genuine or fraudulent. Results shown here are derived from the current rule engine, not historical convictions.</p></div>
     <Link href={'/check?example='+encodeURIComponent(demo.id)} className="product-btn product-btn-primary">Run this example through the checker<ArrowRight size={18}/></Link>
    </div>}
    {tab==='personal'&&!loaded&&<p className="text-slate-400">Loading your browser drafts…</p>}
    {tab==='personal'&&loaded&&!draft&&<div className="flex min-h-72 flex-col items-center justify-center text-center"><FolderOpen size={38} className="text-teal-300"/><h2 className="mt-4 text-xl font-bold">No personal case selected</h2><p className="mt-3 max-w-md text-sm leading-6 text-slate-300">Start with the checker, review its guidance, and choose to save a draft. Your fictional examples stay in the separate tab.</p><Link href="/check" className="product-btn product-btn-primary mt-6">Start a new check<ArrowRight size={17}/></Link></div>}
    {tab==='personal'&&draft&&<div className="space-y-6">
     <header><p className="product-kicker">Your local case · no official filing</p><h2 className="mt-2 text-2xl font-bold">{draft.title}</h2><p className="mt-2 text-sm text-slate-400">Saved {new Date(draft.createdAt).toLocaleString('en-IN')} · {draft.channel}</p></header>
     <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-slate-700 p-4"><p className="text-xs text-slate-400">Risk indicator score</p><p className="mt-2 text-2xl font-bold">{draft.score}<span className="text-sm text-slate-400">/100</span></p></div><div className="rounded-xl border border-slate-700 p-4"><p className="text-xs text-slate-400">Money transferred?</p><p className="mt-2 text-lg font-bold capitalize">{draft.moneyTransferred}</p></div><div className="rounded-xl border border-slate-700 p-4"><p className="text-xs text-slate-400">Prepared steps</p><p className="mt-2 text-2xl font-bold">{milestones.filter(m=>m.done).length}<span className="text-sm text-slate-400">/3</span></p></div></div>
     {draft.moneyTransferred==='yes'&&<p className="rounded-xl border border-rose-400/35 bg-rose-500/10 p-4 text-sm leading-6 text-rose-100"><CircleAlert size={17} className="mr-2 inline"/>Money sent? Contact your bank and call <a href="tel:1930" className="font-bold underline">1930</a> now. Do not wait to finish the steps below.</p>}
     <section><h3 className="mb-3 font-bold">Your case preparation checklist</h3><ol className="space-y-3">{milestones.map((m,i)=><li key={m.key} className="flex flex-col gap-3 rounded-xl border border-slate-700 p-4 sm:flex-row sm:items-center"><span className={m.done?'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-teal-300':'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-300'}>{m.done?<Check size={18}/>:i+1}</span><div className="min-w-0 flex-1"><p className="font-semibold">{m.title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{m.copy}</p></div>{m.done?<span className="text-xs font-bold text-teal-200">Marked complete</span>:m.key==='exportedAt'?<button onClick={()=>download(draft)} className="product-btn product-btn-secondary text-xs"><Download size={15}/>Download copy</button>:<button onClick={()=>step(draft.id,m.key)} className="product-btn product-btn-secondary text-xs"><ClipboardCheck size={15}/>Mark done</button>}</li>)}</ol></section>
     <div><h3 className="font-bold">Description provided</h3><p className="mt-3 max-h-56 overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-slate-700 bg-slate-950/50 p-4 text-sm leading-7 text-slate-300">{draft.transcript}</p></div>
     <div className="rounded-xl border border-slate-700 p-5"><h3 className="font-bold">Signs detected</h3><p className="mt-2 text-sm text-slate-300">{draft.indicators.length?draft.indicators.join(' · '):'No configured signals matched. This does not verify the contact.'}</p><p className="mt-4 text-sm leading-6 text-slate-300">{draft.guidance}</p></div>
     {draft.workflow?.reportedByUserAt&&<p className="rounded-xl border border-amber-500/35 bg-amber-500/10 p-4 text-sm text-amber-100">You marked this case as reported externally. This is self-declared only. Suraksha Setu has not filed or verified any complaint.</p>}
     <div className="flex flex-wrap gap-3"><button onClick={()=>download(draft)} className="product-btn product-btn-primary"><Download size={17}/>Download draft</button><a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer" className="product-btn product-btn-secondary"><ExternalLink size={17}/>Official reporting portal</a><button onClick={()=>remove(draft.id)} className="product-btn border border-rose-400/40 bg-rose-500/10 text-rose-200"><Trash2 size={17}/>Delete</button></div>
    </div>}
   </main>
  </div>
 </div>;
}
