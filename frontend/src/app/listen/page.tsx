'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, Bell, BellOff, CheckCircle2,
  ClipboardCopy, LockKeyhole, Mic, MicOff, RotateCcw, ShieldAlert, ShieldCheck, StopCircle
} from 'lucide-react';
import JourneySteps from '@/components/shared/JourneySteps';
import { DEMO_CASES } from '@/lib/demo-cases';
import { TraceEngine } from '@/lib/trace-engine';
import { assessLiveWarnings, warningMessageKey, type LiveWarning, type WarningSeverity } from '@/lib/live-warnings';

interface BrowserSpeechResult { readonly isFinal:boolean; readonly 0:{readonly transcript:string}; }
interface BrowserSpeechEvent { readonly results:ArrayLike<BrowserSpeechResult>; }
interface BrowserSpeechError { readonly error:string; readonly message?:string; }
interface BrowserRecognition {
  lang:string; continuous:boolean; interimResults:boolean;
  onstart:(()=>void)|null;
  onresult:((event:BrowserSpeechEvent)=>void)|null;
  onerror:((event:BrowserSpeechError)=>void)|null;
  onend:(()=>void)|null;
  start():void; stop():void; abort():void;
}
type RecognitionCtor=new()=>BrowserRecognition;
type SpeechWindow=Window & {SpeechRecognition?:RecognitionCtor;webkitSpeechRecognition?:RecognitionCtor};
type SessionStatus='idle'|'starting'|'listening'|'stopped'|'unsupported'|'error';
interface WarningEvent {key:string;warning:LiveWarning;createdAt:string;}
const LABEL:Record<WarningSeverity,string>={critical:'Urgent caution',high:'High concern',caution:'Be careful'};
const COLORS:Record<WarningSeverity,string>={
 critical:'border-rose-400/60 bg-rose-500/15 text-rose-100',
 high:'border-amber-400/45 bg-amber-500/10 text-amber-100',
 caution:'border-sky-400/35 bg-sky-500/10 text-sky-100'
};
const join=(parts:string[])=>parts.filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
const cutoff=(text:string)=>text.slice(-10000);

export default function LiveListeningPage(){
 const router=useRouter();
 const [supported,setSupported]=useState<boolean|null>(null);
 const [consent,setConsent]=useState(false);
 const [status,setStatus]=useState<SessionStatus>('idle');
 const [error,setError]=useState('');
 const [transcript,setTranscript]=useState('');
 const [warnings,setWarnings]=useState<LiveWarning[]>([]);
 const [history,setHistory]=useState<WarningEvent[]>([]);
 const [revision,setRevision]=useState(0);
 const [alertsAllowed,setAlertsAllowed]=useState(false);
 const [notices,setNotices]=useState('');
 const [sourceType,setSourceType]=useState<'microphone'|'fictional'>('microphone');

 const recognitionRef=useRef<BrowserRecognition|null>(null);
 const wantedRef=useRef(false);
 const restartRef=useRef<ReturnType<typeof setTimeout>|null>(null);
 const baseRef=useRef('');
 const finalizedRef=useRef('');
 const latestRef=useRef('');
 const engineRef=useRef<TraceEngine|null>(null);
 const sentRef=useRef(new Set<string>());
 const notifiedRef=useRef(new Set<string>());
 const notificationsRef=useRef(false);

 useEffect(()=>{
  const browser=window as SpeechWindow;
  setSupported(Boolean(browser.SpeechRecognition||browser.webkitSpeechRecognition));
  function handleVisibility(){
   if(document.hidden&&wantedRef.current){
    wantedRef.current=false;
    if(restartRef.current)clearTimeout(restartRef.current);
    recognitionRef.current?.abort();
    recognitionRef.current=null;
    setStatus('stopped');
    setNotices('Listening stopped because the page moved to the background. Start it again when this page is visible.');
   }
  }
  document.addEventListener('visibilitychange',handleVisibility);
  return ()=>{
   wantedRef.current=false;
   if(restartRef.current)clearTimeout(restartRef.current);
   recognitionRef.current?.abort();
   recognitionRef.current=null;
   document.removeEventListener('visibilitychange',handleVisibility);
  };
 },[]);

 function resetEvidence(source:'microphone'|'fictional'){
  engineRef.current=new TraceEngine();
  latestRef.current='';baseRef.current='';finalizedRef.current='';
  sentRef.current=new Set();notifiedRef.current=new Set();
  setTranscript('');setWarnings([]);setHistory([]);setRevision(0);
  setSourceType(source);
 }
 function considerText(full:string, provisional:boolean){
  const text=cutoff(full);
  if(!text||text===latestRef.current&&provisional)return;
  if(text===latestRef.current)return;
  latestRef.current=text;
  setTranscript(text);
  if(!engineRef.current)engineRef.current=new TraceEngine();
  const engine=engineRef.current;
  try{
   const existing=engine.evidenceList().find(x=>x.id==='live-segment');
   if(!existing)engine.addEvidence({id:'live-segment',caseId:'live-review',text,sourceLabel:sourceType==='fictional'?'Fictional demonstration':'User-consented browser microphone transcription',recordedAt:new Date().toISOString()});
   else engine.reviseEvidence('live-segment',text,existing.revision);
   const current=engine.assess('live-review');
   setRevision(current.revision);
   const matched=assessLiveWarnings(text,'live-segment',current.revision,provisional);
   setWarnings(matched);
   const events:WarningEvent[]=[];
   for(const warning of matched){
    const key=warningMessageKey(warning);
    if(!sentRef.current.has(key)){
     sentRef.current.add(key);
     events.push({key,warning,createdAt:new Date().toISOString()});
    }
    if(!provisional&&sourceType==='microphone'&&notificationsRef.current&&['critical','high'].includes(warning.severity)&&!notifiedRef.current.has(key)){
     notifiedRef.current.add(key);
     if('Notification' in window&&Notification.permission==='granted'){
      try{new Notification('Suraksha Setu: possible scam warning',{body:'Suspicious pressure or sensitive request detected. Check the on-screen guidance.',tag:'suraksha-'+warning.id});}catch{/* browser may block notification */ }
     }
    }
   }
   if(events.length)setHistory(prev=>[...events,...prev].slice(0,18));
  }catch{
   setError('Could not update the evidence-linked assessment. You can still stop listening and use the text checker.');
  }
 }

 function stopListening(){
  wantedRef.current=false;
  if(restartRef.current){clearTimeout(restartRef.current);restartRef.current=null;}
  recognitionRef.current?.stop();
  recognitionRef.current=null;
  setStatus('stopped');
 }
 function startListening(){
  if(!consent){setError('Read the privacy notice and confirm consent before activating the microphone.');return;}
  if(wantedRef.current)return;
  const browser=window as SpeechWindow;
  const Speech=browser.SpeechRecognition||browser.webkitSpeechRecognition;
  if(!Speech){setStatus('unsupported');setError('This browser does not support live speech recognition. Try a compatible browser, or use the text checker.');return;}
  if(!window.isSecureContext){setStatus('unsupported');setError('Microphone speech recognition needs a secure HTTPS page.');return;}
  setError('');setNotices('');resetEvidence('microphone');
  let recognition:BrowserRecognition;
  try{recognition=new Speech();}catch{setStatus('error');setError('Unable to initialise this browser speech recognition service.');return;}
  recognition.lang='en-IN';
  recognition.continuous=true;
  recognition.interimResults=true;
  wantedRef.current=true;
  recognitionRef.current=recognition;
  setStatus('starting');
  recognition.onstart=()=>{if(wantedRef.current)setStatus('listening');};
  recognition.onresult=event=>{
   const finalized:string[]=[],partial:string[]=[];
   for(let i=0;i<event.results.length;i++){
    const item=event.results[i];
    const spoken=item?.[0]?.transcript?.trim();
    if(spoken){if(item.isFinal)finalized.push(spoken);else partial.push(spoken);}
   }
   finalizedRef.current=join(finalized);
   considerText(join([baseRef.current,finalizedRef.current,join(partial)]),partial.length>0);
  };
  recognition.onerror=event=>{
   if(!wantedRef.current)return;
   if(event.error==='no-speech')return;
   if(['not-allowed','service-not-allowed','audio-capture','network','language-not-supported'].includes(event.error)){
    wantedRef.current=false;setStatus('error');
    setError(event.error==='not-allowed'?'Microphone permission was denied. Enable permission in browser settings if you want to use live listening.':
     event.error==='network'?'The browser speech recognition service reported a network error. No live analysis can continue.':
     'The browser could not access speech recognition ('+event.error+').');
   }else{setNotices('Speech recognition reported: '+event.error+'. Listening may restart if supported.');}
  };
  recognition.onend=()=>{
   baseRef.current=cutoff(join([baseRef.current,finalizedRef.current]));
   finalizedRef.current='';
   if(wantedRef.current&&!document.hidden){
    setStatus('starting');
    restartRef.current=setTimeout(()=>{
     if(!wantedRef.current)return;
     try{recognition.start();}catch{wantedRef.current=false;setStatus('error');setError('Recognition stopped and could not restart. Please start a new session.');}
    },450);
   }else if(wantedRef.current===false){
    setStatus(current=>current==='error'?'error':'stopped');
   }
  };
  try{recognition.start();}catch{
   wantedRef.current=false;recognitionRef.current=null;
   setStatus('error');setError('The microphone could not be started. Check browser permissions and try again.');
  }
 }
 async function requestNotifications(){
  if(!('Notification' in window)){setNotices('Desktop notifications are unavailable here. On-screen warnings remain enabled.');return;}
  try{
   const permission=await Notification.requestPermission();
   const enabled=permission==='granted';
   notificationsRef.current=enabled;setAlertsAllowed(enabled);
   setNotices(enabled?'Browser notification alerts enabled. These contain no transcript text.':'Notification permission is not enabled. On-screen warnings still work.');
  }catch{setNotices('Browser notification request failed. On-screen warnings are still available.');}
 }
 function loadFictionalDemo(){
  stopListening();resetEvidence('fictional');setNotices('Fictional demonstration only. No microphone was activated.');
  const example=DEMO_CASES.find(c=>c.id==='demo-digital-arrest');
  if(example){setStatus('stopped');setTimeout(()=>considerText(example.transcript,false),0);}
 }
 function clearSession(){
  stopListening();resetEvidence('microphone');setNotices('Current session text cleared from this page.');setError('');
 }
 function continueToCheck(){
  if(!latestRef.current.trim()){setError('No transcript yet. Speak into the microphone, try the fictional example, or use the manual checker.');return;}
  stopListening();
  try{
   sessionStorage.setItem('suraksha:setu:live-handoff:v1',JSON.stringify({text:latestRef.current.slice(0,10000),at:Date.now(),fictional:sourceType==='fictional'}));
   router.push('/check?from=live');
  }catch{
   setError('This browser blocked temporary session storage. Copy the transcript below, then paste it into the text checker.');
  }
 }
 async function copyTranscript(){
  try{await navigator.clipboard.writeText(latestRef.current);setNotices('Transcript copied. You control where it is pasted.');}
  catch{setNotices('Could not copy. Select the text below manually.');}
 }
 const urgent=warnings.some(x=>x.severity==='critical');
 const high=warnings.some(x=>x.severity==='high');
 const stateLabel=status==='listening'?'Microphone listening':status==='starting'?'Starting speech recognition…':status==='unsupported'?'Not supported':status==='error'?'Recognition unavailable':status==='stopped'?'Not listening':'Not started';
 return <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
  <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={17}/>Home</Link>
  <header className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
   <div className="max-w-3xl"><p className="product-kicker flex items-center gap-2"><Mic size={18}/>Live microphone warnings · Beta</p>
    <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">Hear warning signs as speech is transcribed</h1>
    <p className="mt-3 text-sm leading-7 text-slate-300">With your permission, this page listens to speech near your device microphone and flags suspicious phrases as they appear. It cannot intercept a mobile or WhatsApp call directly, guarantee fraud prevention, or stop a payment.</p>
   </div>
   <span className={\`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold \${status==='listening'?'border-teal-400/50 bg-teal-400/15 text-teal-200':'border-slate-600 bg-slate-800 text-slate-300'}\`}><span className={\`h-2 w-2 rounded-full \${status==='listening'?'animate-pulse bg-teal-400':'bg-slate-500'}\`}/>{stateLabel}</span>
  </header>
  <JourneySteps current="check"/>
  <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
   <div className="space-y-6">
    <section className="product-panel p-5 md:p-7">
     <h2 className="flex items-center gap-2 text-lg font-bold"><ShieldCheck size={22} className="text-teal-300"/>Microphone consent and privacy</h2>
     <p className="mt-3 text-sm leading-6 text-slate-300">This uses your browser&apos;s speech-recognition service. Some browsers send microphone audio to a third-party recognition service. Audio is not recorded or uploaded to a Suraksha Setu server by this page. Transcribed text stays in page memory unless you explicitly continue to case review or save a personal draft.</p>
     <p className="mt-3 text-sm leading-6 text-amber-100">Only use this with permission from everyone whose speech may be captured. Browser support varies; switching away from this page stops the session. Intended for English speech (India). Hindi and other languages are not yet validated.</p>
     <label className="mt-5 flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-950/40 p-4 text-sm leading-6">
      <input type="checkbox" className="mt-1" checked={consent} onChange={e=>setConsent(e.target.checked)}/>
      I understand what the microphone may capture, that browser speech recognition can use an external service, and that all participants have consented.
     </label>
     <div className="mt-5 flex flex-wrap gap-3">
      {status==='listening'||status==='starting'?
       <button onClick={stopListening} className="product-btn border border-rose-400/45 bg-rose-500/15 text-rose-100 hover:bg-rose-500/25"><MicOff size={18}/>Stop listening</button>:
       <button onClick={startListening} disabled={!consent||supported===false} className="product-btn product-btn-primary disabled:cursor-not-allowed disabled:opacity-40"><Mic size={18}/>Start microphone listening</button>}
      <button onClick={clearSession} className="product-btn product-btn-secondary"><RotateCcw size={17}/>Clear session</button>
     </div>
     {supported===false&&<p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-100">Speech recognition is not supported in this browser. Use the text checker or the clearly labeled fictional demo below.</p>}
     {error&&<p role="alert" className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</p>}
     {notices&&<p role="status" className="mt-4 text-sm text-slate-300">{notices}</p>}
    </section>
    <section className="product-panel p-5 md:p-7">
     <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-lg font-bold">Live transcript</h2><p className="mt-1 text-xs text-slate-400">Source: {sourceType==='fictional'?'Fictional example':'Opt-in microphone'} · TRACE evidence revision {revision}</p></div>
      <button type="button" onClick={copyTranscript} disabled={!transcript} className="product-btn product-btn-secondary text-xs disabled:cursor-not-allowed disabled:opacity-40"><ClipboardCopy size={16}/>Copy</button>
     </div>
     <div aria-label="Recognised speech transcript" className="mt-4 min-h-44 max-h-80 overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-slate-700 bg-[#0b1723] p-5 text-sm leading-7 text-slate-200">
      {transcript||<span className="text-slate-500">Speech recognised after you start listening will appear here. No microphone is active until you consent and press Start.</span>}
     </div>
     <p className="mt-3 text-xs leading-6 text-slate-400">Speech recognition may miss, mishear or revise words. Interim phrases may cause provisional alerts. No audio file is stored by this application.</p>
     <div className="mt-5 flex flex-wrap gap-3"><button onClick={continueToCheck} disabled={!transcript} className="product-btn product-btn-primary disabled:cursor-not-allowed disabled:opacity-40">Continue to case review<ArrowRight size={18}/></button><Link href="/check" className="product-btn product-btn-secondary">Use text-only check</Link></div>
     <p className="mt-3 text-xs leading-5 text-slate-400">Continue copies the transcript briefly to this tab&apos;s session storage to open the checker. That copy is removed when the checker reads it; a personal report is saved only after separate consent.</p>
    </section>
   </div>
   <aside className="space-y-6">
    <section aria-live="polite" className={\`rounded-2xl border p-5 md:p-6 \${urgent?'border-rose-400/60 bg-rose-500/15':high?'border-amber-400/50 bg-amber-500/10':'border-slate-700 bg-slate-900/70'}\`}>
     <h2 className="flex items-center gap-2 text-lg font-bold">{urgent?<ShieldAlert className="text-rose-300"/>:high?<AlertTriangle className="text-amber-300"/>:<ShieldCheck className="text-teal-300"/>}Warning centre</h2>
     {warnings.length===0?<p className="mt-4 text-sm leading-7 text-slate-300">No configured high-risk cues detected in the current transcript. This does not mean the conversation is safe. If you feel pressured, end the call and independently verify the request.</p>:
      <div className="mt-4 space-y-3">{warnings.map(w=><article key={w.id} className={\`rounded-xl border p-4 \${COLORS[w.severity]}\`}>
       <div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm">{w.title}</strong><span className="text-[10px] font-bold uppercase">{LABEL[w.severity]}</span></div>
       <p className="mt-2 text-sm leading-6">{w.action}</p>
       <blockquote className="mt-3 break-words rounded-lg bg-slate-950/35 p-3 text-xs leading-5">Source: {w.excerpt}</blockquote>
       <p className="mt-2 text-[11px] opacity-80">TRACE source {w.sourceId}, revision {w.evidenceRevision}{w.provisional?' · Provisional transcript':''}</p>
      </article>)}</div>}
     {(urgent||high)&&<div className="mt-5 rounded-xl border border-rose-400/40 p-4 text-sm font-semibold text-rose-100">Do not transfer money, reveal an OTP, or install an access tool on a caller&apos;s instructions. End the interaction if necessary.</div>}
     <div className="mt-5 flex flex-wrap gap-3"><a href="tel:1930" className="product-btn border border-rose-400/35 bg-rose-600/20 text-rose-100"><Activity size={17}/>Cybercrime helpline 1930</a><Link href="/help" className="product-btn product-btn-secondary">Safety steps<ArrowRight size={16}/></Link></div>
    </section>
    <section className="product-panel p-5">
     <h2 className="flex items-center gap-2 font-bold">{alertsAllowed?<Bell size={20}/>:<BellOff size={20}/>}Optional desktop warning messages</h2>
     <p className="mt-3 text-sm leading-6 text-slate-300">On-screen alerts always work. In browsers that support them, you can separately allow desktop notifications for new high-priority detected cues. Notifications never include transcript text.</p>
     <button onClick={requestNotifications} disabled={alertsAllowed} className="product-btn product-btn-secondary mt-4 text-sm disabled:opacity-60">{alertsAllowed?<CheckCircle2 size={17}/>:<Bell size={17}/>} {alertsAllowed?'Notifications enabled':'Enable notifications'}</button>
    </section>
    <section className="product-panel p-5">
     <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-bold">Warning timeline</h2><span className="text-xs text-slate-400">{history.length} event{history.length===1?'':'s'}</span></div>
     {history.length===0?<p className="mt-3 text-sm leading-6 text-slate-400">New warning messages appear here as the recognised speech changes.</p>:<ol className="mt-4 space-y-3">{history.map(e=><li key={e.key} className="border-l-2 border-teal-400/45 pl-3 text-xs"><div className="font-semibold text-slate-200">{e.warning.title}</div><p className="mt-1 text-slate-400">{new Date(e.createdAt).toLocaleTimeString('en-IN')} · Evidence revision {e.warning.evidenceRevision}</p></li>)}</ol>}
    </section>
    <button onClick={loadFictionalDemo} className="w-full rounded-xl border border-sky-400/25 bg-sky-500/10 p-4 text-left text-sm text-sky-100 hover:bg-sky-500/20">
     <span className="font-bold">Try without a microphone: fictional example</span><span className="mt-1 block text-xs text-sky-200/75">Load a synthetic digital-arrest transcript. This is not live listening.</span>
    </button>
   </aside>
  </div>
 </div>;
}
