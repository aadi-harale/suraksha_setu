'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { TraceEngine, type Impact } from '@/lib/trace-engine';

const initial = [
 {id:'source-01',caseId:'CASE-01',text:'This is CBI police. Arrest warrant for money laundering. Do not tell your family. Stay on video call. Transfer ₹48000 to rbi.verify@okaxis.',sourceLabel:'Synthetic example A',recordedAt:'2026-10-27T00:00:00Z'},
 {id:'source-02',caseId:'CASE-02',text:'Police arrest warrant. Do not tell your family. Transfer ₹5000 to rbi.verify@okaxis.',sourceLabel:'Synthetic example B',recordedAt:'2026-10-27T00:01:00Z'}
];
function seed() {const e=new TraceEngine(); initial.forEach(x=>e.addEvidence(x));return e;}
const label=(text:string)=>text.replaceAll('_',' ');
const time=()=>new Date().toISOString();
export default function TracePage() {
 const [engine,setEngine]=useState<TraceEngine>(()=>seed());
 const [version,setVersion]=useState(0);
 const [caseId,setCaseId]=useState('CASE-01');
 const [evidenceId,setEvidenceId]=useState('');
 const [text,setText]=useState('');
 const [message,setMessage]=useState('');
 const [impact,setImpact]=useState<Impact|null>(null);
 const [busy,setBusy]=useState(false);
 const assessments=useMemo(()=>engine.caseIds().map(x=>engine.assess(x)),[engine,version]);
 const evidence=engine.evidenceList();
 const links=engine.correlations();
 const packets=engine.packetList();
 const actions=engine.actions(caseId);
 const update=(fn:()=>Impact|void)=>{
  try {const result=fn();setVersion(x=>x+1);if(result)setImpact(result);setMessage('Change recorded. Assessments and dependencies refreshed.');}
  catch(error){setMessage(error instanceof Error?error.message:'Operation failed');}
 };
 function addEvidence(){
  if(!text.trim())return setMessage('Add evidence text before saving.');
  update(()=>engine.addEvidence({id:'source-'+globalThis.crypto.randomUUID(),caseId:caseId.trim()||'CASE-NEW',text,sourceLabel:'Manually entered test text',recordedAt:time()}));setText('');
 }
 async function packet(){
  setBusy(true);
  try{
   const p=await engine.createPacket('packet-'+globalThis.crypto.randomUUID(),caseId);setVersion(x=>x+1);
   const blob=new Blob([JSON.stringify({...p,notice:'Research demonstration only. A SHA-256 digest is not third-party notarization or legal certification.'},null,2)],{type:'application/json'});
   const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=p.id+'.json';a.click();URL.revokeObjectURL(url);setMessage('Evidence snapshot exported as JSON. No official report submitted.');
  }catch(error){setMessage(error instanceof Error?error.message:'Packet generation failed');}
  finally{setBusy(false);}
 }
 return <div className="mx-auto max-w-6xl space-y-6 p-5 md:p-8 text-slate-100">
  <header className="rounded-2xl border border-emerald-500/20 bg-slate-900/80 p-6">
   <p className="text-xs uppercase tracking-[.2em] text-emerald-300">Suraksha Setu · Research workspace</p>
   <h1 className="mt-2 text-3xl font-bold">TRACE: evidence, corrections and intervention accountability</h1>
   <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Explore how a suspicious conversation creates explainable signals and tentative case links. Correct a transcript to see unsupported links disappear and older packets marked as superseded. All starting cases are fictional.</p>
   <div className="mt-4 rounded-lg border border-amber-400/30 bg-amber-900/20 p-3 text-sm text-amber-100">Local in-memory demonstrator: changes disappear on refresh. No real calls are monitored, no payments are blocked, and no agency is contacted. Avoid entering personal or sensitive information.</div>
   <div className="mt-4 flex flex-wrap gap-3"><Link href="/shield" className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700">Call simulation</Link><Link href="/evidence" className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700">Evidence lab</Link><button onClick={()=>{setEngine(seed());setVersion(x=>x+1);setMessage('Demo reset.');setImpact(null);}} className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700">Reset fictional data</button></div>
  </header>
  <section className="grid gap-4 md:grid-cols-3" aria-label="Summary">
   <div className="rounded-xl border border-slate-700 bg-slate-900 p-4"><p className="text-slate-400 text-sm">Cases assessed</p><strong className="text-3xl">{assessments.length}</strong></div>
   <div className="rounded-xl border border-slate-700 bg-slate-900 p-4"><p className="text-slate-400 text-sm">Tentative network links</p><strong className="text-3xl">{links.length}</strong></div>
   <div className="rounded-xl border border-slate-700 bg-slate-900 p-4"><p className="text-slate-400 text-sm">Superseded packets</p><strong className="text-3xl">{packets.filter(x=>x.validity==='superseded').length}</strong></div>
  </section>
  <section className="rounded-xl border border-slate-700 bg-slate-900 p-5 space-y-4">
   <h2 className="text-xl font-semibold">1. Evidence workspace</h2>
   <label className="block text-sm">Case ID<input value={caseId} onChange={e=>setCaseId(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 p-3" placeholder="CASE-01"/></label>
   <label className="block text-sm">New fictional transcript or observation<textarea value={text} onChange={e=>setText(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 p-3" placeholder="Enter synthetic example text. Do not enter real private data."/></label>
   <button onClick={addEvidence} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500">Add test evidence</button>
   {evidence.filter(x=>x.caseId===caseId).map(item=><div key={item.id} className="rounded-lg border border-slate-700 p-4">
    <div className="flex flex-wrap justify-between gap-2"><strong className="text-sm">{item.id}</strong><span className="text-xs text-slate-400">Revision {item.revision} · {item.status}</span></div>
    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{item.text}</p>
    {item.status==='active'&&<div className="mt-3 flex flex-wrap gap-2"><button className="rounded bg-slate-700 px-3 py-2 text-sm" onClick={()=>{setEvidenceId(item.id);setText(item.text);setMessage('Evidence selected. Edit it in the text field, then choose Apply correction.');}}>Edit text</button><button className="rounded bg-rose-900/70 px-3 py-2 text-sm" onClick={()=>update(()=>engine.withdrawEvidence(item.id,item.revision))}>Withdraw evidence</button></div>}
   </div>)}
   {evidenceId&&<button onClick={()=>{const item=evidence.find(x=>x.id===evidenceId);if(!item)return;update(()=>engine.reviseEvidence(item.id,text,item.revision));setEvidenceId('');setText('');}} className="rounded-lg border border-amber-500 px-4 py-2 text-amber-200">Apply correction to {evidenceId}</button>}
  </section>
  <section className="grid gap-5 lg:grid-cols-2">
   <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 space-y-3"><h2 className="text-xl font-semibold">2. Explainable assessments</h2>
    {assessments.map(a=><article key={a.caseId} className="rounded-lg border border-slate-700 p-4"><div className="flex justify-between gap-3"><strong>{a.caseId}</strong><span className="font-mono text-emerald-300">{a.score}/100</span></div><p className="mt-2 text-sm">Detected stage: <b>{label(a.stage)}</b></p><p className="text-xs text-slate-400">Heuristic score, not a probability or official fraud determination.</p><ul className="mt-2 list-disc pl-5 text-sm text-slate-300">{a.reasons.map(r=><li key={r}>{r}</li>)}</ul><p className="mt-3 text-sm">{a.recommendation}</p></article>)}
   </div>
   <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 space-y-3"><h2 className="text-xl font-semibold">3. Tentative case correlations</h2><p className="text-sm text-slate-400">Shared identifiers or patterns require independent review and do not establish common criminal control.</p>{links.length===0?<p className="rounded-lg bg-slate-950 p-4 text-sm text-slate-400">No active matching links.</p>:links.map(l=><div key={l.id} className="rounded-lg border border-slate-700 p-4 text-sm"><strong>{l.caseA} ↔ {l.caseB}</strong><p>{label(l.relation)}: {l.match}</p><p className="text-xs text-slate-400">Supported by: {l.supportEvidenceIds.join(', ')}</p></div>)}</div>
  </section>
  <section className="rounded-xl border border-slate-700 bg-slate-900 p-5 space-y-3"><h2 className="text-xl font-semibold">4. Intervention accountability</h2><p className="text-sm text-slate-400">Only recommendations can be created here. A verified completion receipt is required for any external action to be marked confirmed. No provider adapter is connected.</p><button onClick={()=>update(()=>{engine.recommend('action-'+globalThis.crypto.randomUUID(),caseId);})} className="rounded-lg bg-slate-700 px-4 py-2 text-sm">Record safety recommendation</button>{actions.map(a=><p key={a.id} className="rounded-lg border border-slate-700 p-3 text-sm">{a.id}: <strong>{a.status}</strong> · Assessment revision {a.assessmentRevision} · {a.evidenceCurrent?'Evidence current':'Evidence changed: review required'}</p>)}</section>
  <section className="rounded-xl border border-slate-700 bg-slate-900 p-5 space-y-3"><h2 className="text-xl font-semibold">5. Snapshot packets</h2><p className="text-sm text-slate-400">Export a JSON snapshot with an SHA-256 digest. A digest detects changed bytes but is not a signature or a legal filing.</p><button onClick={packet} disabled={busy} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold disabled:opacity-50">{busy?'Generating…':'Generate and download snapshot'}</button>{packets.map(p=><p key={p.id} className="rounded-lg bg-slate-950 p-3 text-sm">{p.id} · {p.validity} · {p.digest.slice(0,16)}…</p>)}</section>
  {impact&&<section aria-live="polite" className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-5"><h2 className="font-semibold">Latest correction impact</h2><p className="mt-2 text-sm">Case revision {impact.revisionBefore} → {impact.revisionAfter}. Links removed: {impact.removedLinks.length}. Links added: {impact.addedLinks.length}. Packets superseded: {impact.invalidatedPackets.length}. Interventions flagged: {impact.actionsNeedingReview.length}.</p></section>}
  {message&&<p role="status" className="rounded-lg border border-slate-700 p-3 text-sm text-slate-300">{message}</p>}
 </div>;
}
