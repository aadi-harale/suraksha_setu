'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, Save, RotateCcw, LockKeyhole, PhoneCall } from 'lucide-react';
import { TraceEngine, type Assessment } from '@/lib/trace-engine';
import { addReport, type LocalReport } from '@/lib/local-reports';
import { DEMO_CASES, findDemoCase } from '@/lib/demo-cases';
import JourneySteps from '@/components/shared/JourneySteps';
const stageNames:Record<string,string>={payment_request:'Payment request',continuous_control:'Pressure to remain on call',isolation:'Isolation from others',threat:'Threat or intimidation',authority_claim:'Claimed authority',unassessed:'No configured pattern identified'};
const kindLabels:Record<string,string>={authority:'Claim of authority',threat:'Legal or financial threat',isolation:'Attempt to isolate you',control:'Pressure to stay connected',payment:'Request involving payment'};
type Channel='phone call'|'WhatsApp / SMS'|'email'|'other';
export default function CheckPage(){
 const router=useRouter();
 const [demoId,setDemoId]=useState('');
 const [text,setText]=useState(''),[channel,setChannel]=useState<Channel>('phone call');
 const [paid,setPaid]=useState<'yes'|'no'|'unsure'>('no'),[amount,setAmount]=useState('');
 const [result,setResult]=useState<Assessment|null>(null),[consent,setConsent]=useState(false);
 const [saved,setSaved]=useState(false),[error,setError]=useState('');
 function analyse(input?:string){
  setError('');
  const source=(input??text).trim();
  if(source.length<20)return setError('Enter at least 20 characters so there is enough context to examine.');
  try{const engine=new TraceEngine();engine.addEvidence({id:'text-input',caseId:'personal-check',text:source,sourceLabel:'User entered text',recordedAt:new Date().toISOString()});
   setResult(engine.assess('personal-check'));setSaved(false);setConsent(false);
  }catch(e){setError(e instanceof Error?e.message:'Could not analyse this text.');}
 }
 function reset(){setResult(null);setSaved(false);setConsent(false);setError('');}
 function loadExample(id:string){
  const demo=findDemoCase(id);if(!demo)return;
  setDemoId(demo.id);setText(demo.transcript);
  setChannel(demo.channel);setPaid(demo.moneyTransferred);setAmount(demo.amount);
  analyse(demo.transcript);
 }
 useEffect(()=>{
  const id=new URLSearchParams(window.location.search).get('example');
  if(id&&findDemoCase(id))loadExample(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);

 function save(){
  if(!result||!consent){setError('Please confirm the local-storage notice before saving.');return;}
  if(demoId){setError('This is a fictional example. Edit it to create a personal report.');return;}
  try {
   const entry:LocalReport={id:crypto.randomUUID(),createdAt:new Date().toISOString(),
    title:'Suspicious '+channel+' · '+new Date().toLocaleDateString('en-IN'),transcript:text.trim(),
    score:result.score,stage:stageNames[result.stage]||result.stage,
    indicators:[...new Set(result.signals.map(s=>kindLabels[s.kind]||s.kind))],
    guidance:result.recommendation,channel,moneyTransferred:paid,amount:paid==='yes'?amount.trim().slice(0,80):'',status:'draft'};
   addReport(entry);setSaved(true);setError('');router.push('/reports?case='+encodeURIComponent(entry.id));
  }catch(e){setError(e instanceof Error?e.message:'Could not save draft.');}
 }
 const level=result?(result.score>=65?'strong':result.score>=25?'some':'limited'):null;
 return <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-16">
  <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16}/>Home</Link>
  <div className="mb-9"><p className="product-kicker">Step 1 of 4 · Check the interaction</p><h1 className="mt-3 text-3xl font-extrabold md:text-4xl">Check a suspicious interaction</h1>
   <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">You describe what happened. We point out patterns associated with pressure tactics and suggest safer next steps. This is a rule-based screening tool, not a verdict.</p></div>

  <JourneySteps current={result?'understand':'check'} completed={result?['check']:[]}/>
  <section className="mb-6 rounded-2xl border border-teal-400/30 bg-teal-500/5 p-5">
   <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-bold text-white">Try a fictional example</h2><p className="mt-1 text-xs text-slate-300">Eight educational cases, including legitimate messages for comparison. No real individuals or official cases.</p></div><span className="rounded-full border border-teal-400/30 px-3 py-1 text-xs font-bold text-teal-200">DEMO DATA</span></div>
   <label htmlFor="example-picker" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Choose a case to examine</label>
   <select id="example-picker" value={demoId} className="product-input" onChange={e=>loadExample(e.target.value)}>
    <option value="">Select a sample case…</option>
    {DEMO_CASES.map(example=><option key={example.id} value={example.id}>{example.title} {example.isLegitimate?'(comparison)':''}</option>)}
   </select>
   {demoId&&<p role="status" className="mt-3 text-xs text-teal-100">Showing a fictional learning case. This is not a validated fraud detection outcome.</p>}
  </section>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_285px]">
   <section className="product-panel p-5 md:p-7">
    {!result?<div className="space-y-6">
     <div><label htmlFor="channel" className="mb-2 block text-sm font-bold">Where did this happen?</label><select id="channel" value={channel} onChange={e=>setChannel(e.target.value as Channel)} className="product-input"><option>phone call</option><option>WhatsApp / SMS</option><option>email</option><option>other</option></select></div>
     <div><label htmlFor="text" className="mb-2 block text-sm font-bold">What did they say or ask you to do?</label><textarea id="text" rows={9} maxLength={10000} value={text} onChange={e=>{setText(e.target.value);setDemoId('');}} className="product-input min-h-48 resize-y" placeholder="For example: The caller said I was under digital arrest, told me not to contact family, and asked for a payment."/>
      <p className="mt-2 text-xs leading-5 text-slate-400">Enter only what is necessary. Remove passwords, OTPs, identity numbers, addresses and banking credentials. {text.length.toLocaleString('en-IN')} / 10,000 characters.</p></div>
     <fieldset><legend className="mb-3 text-sm font-bold">Have you already sent money?</legend><div className="flex flex-wrap gap-3">{(['no','yes','unsure'] as const).map(v=><label key={v} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm capitalize ${paid===v?'border-teal-400 bg-teal-400/10 text-teal-100':'border-slate-600 text-slate-300'}`}><input type="radio" name="paid" checked={paid===v} onChange={()=>setPaid(v)} />{v}</label>)}</div>
      {paid==='yes'&&<><label htmlFor="amount" className="mt-4 mb-2 block text-sm">Approximate amount (optional)</label><input id="amount" value={amount} maxLength={80} onChange={e=>setAmount(e.target.value)} className="product-input" placeholder="e.g. ₹12,000"/><p className="mt-3 text-sm text-rose-200">Time matters: contact your bank and call <a className="underline" href="tel:1930">1930</a> immediately. You do not need to finish this check first.</p></>}</fieldset>
     {error&&<p role="alert" className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</p>}
     <button type="button" onClick={()=>analyse()} className="product-btn product-btn-primary w-full sm:w-auto">Check warning signs<ArrowRight size={18}/></button>
    </div>:<div className="space-y-6">
     <div><p className="product-kicker">Step 2 of 4 · Understand the signs</p><h2 className="mt-2 text-2xl font-bold">{level==='strong'?'Several serious warning signs':level==='some'?'Some warning signs found':'Few configured warning signs detected'}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">This is an indicator screening result, not confirmation that the contact is fraudulent or legitimate. If you feel threatened or money has been requested, verify independently.</p></div>
     <div className={`rounded-xl border p-5 ${level==='strong'?'border-rose-400/35 bg-rose-500/10':level==='some'?'border-amber-400/35 bg-amber-500/10':'border-slate-600 bg-slate-800/60'}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-300">What the text suggests</p><p className="mt-2 text-xl font-bold">{stageNames[result.stage]||'Unclassified'}</p>
      <p className="mt-2 text-sm text-slate-300">Matched {result.signals.length} rule-based phrase indicator{result.signals.length===1?'':'s'}. Internal heuristic score: {result.score}/100. This number is not a probability.</p>
     </div>
     <div><h3 className="mb-3 text-base font-bold">Why we flagged this</h3>{result.signals.length?<ul className="space-y-3">{result.signals.map(signal=><li key={signal.id} className="rounded-xl border border-slate-700 bg-slate-950/50 p-4"><strong className="text-sm text-teal-200">{kindLabels[signal.kind]||signal.kind}</strong><p className="mt-2 break-words text-sm text-slate-300">{signal.excerpt}</p></li>)}</ul>:<p className="rounded-xl border border-slate-700 p-4 text-sm text-slate-300">No configured pattern matched. This does not mean the conversation is safe. Many scams use unfamiliar wording.</p>}</div>
     <div className="rounded-xl border border-teal-500/25 bg-teal-500/10 p-5"><h3 className="font-bold">Recommended next step</h3><p className="mt-2 text-sm leading-6 text-slate-200">{result.recommendation}</p>{paid==='yes'&&<p className="mt-3 text-sm font-semibold text-rose-100">If you actually sent money, call 1930 and your bank now. This example is fictional.</p>}</div>
     {demoId&&<div className="rounded-xl border border-teal-400/30 bg-teal-400/10 p-4 text-sm text-teal-100"><strong>Educational sample only.</strong> Explore this case in <Link href="/reports" className="underline font-semibold">Example cases</Link>. To create a personal report, edit the text and recheck it.</div>}
     <div className="rounded-xl border border-slate-700 p-5"><h3 className="flex items-center gap-2 font-bold"><Save size={19}/>Save this as a personal draft?</h3><p className="mt-2 text-xs leading-6 text-slate-400">Optional. Saving keeps the text on this browser in unencrypted local storage. Anyone with access to this browser profile may be able to read it. It is not sent to the police or a bank. Avoid saving sensitive information on shared devices.</p>
      <label className="mt-4 flex items-start gap-3 text-sm"><input className="mt-1" type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>I understand this draft is stored locally and is not an official complaint.</label>
      {error&&<p role="alert" className="mt-3 text-sm text-rose-200">{error}</p>}
      {saved?<Link className="product-btn product-btn-primary mt-4" href="/reports"><CheckCircle2 size={18}/>Open saved report<ArrowRight size={16}/></Link>:<button onClick={save} disabled={!consent||Boolean(demoId)} className="product-btn product-btn-primary mt-4 disabled:cursor-not-allowed disabled:opacity-50"><Save size={18}/>Save local draft</button>}
     </div>
     <div className="flex flex-wrap gap-3"><button onClick={reset} className="product-btn product-btn-secondary"><RotateCcw size={16}/>Edit and check again</button><Link href="/help" className="product-btn product-btn-secondary"><PhoneCall size={16}/>Get reporting help</Link></div>
    </div>}
   </section>
   <aside className="space-y-5">
    <div className="product-panel p-5"><div className="flex items-center gap-2 text-teal-300"><ShieldCheck size={20}/><h2 className="font-bold">What this tool does</h2></div><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300"><li>• Finds configured patterns of threats, isolation and payment pressure.</li><li>• Explains the indicators in your own text.</li><li>• Helps prepare a draft for your records.</li></ul></div>
    <div className="product-panel p-5"><div className="flex items-center gap-2 text-amber-300"><AlertTriangle size={20}/><h2 className="font-bold">What it cannot do</h2></div><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300"><li>• Monitor your live phone call.</li><li>• Verify the caller&apos;s identity.</li><li>• Block a transfer or officially report a crime.</li></ul></div>
    <Link href="/help" className="flex items-center justify-between rounded-xl border border-rose-400/30 bg-rose-500/10 p-5 text-sm font-bold text-rose-100">Need urgent assistance?<PhoneCall size={19}/></Link>
    <p className="flex gap-2 text-xs leading-5 text-slate-400"><LockKeyhole size={17} className="shrink-0"/>Text is analysed in the current browser session. It is only persisted when you choose to save.</p>
   </aside>
  </div>
 </div>;
}