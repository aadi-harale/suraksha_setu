import Link from 'next/link';
import { ShieldCheck, ArrowRight, PhoneCall, SearchCheck, FolderOpen, ShieldAlert, LockKeyhole, ListChecks, FlaskConical } from 'lucide-react';
const actions=[
 {href:'/help',icon:PhoneCall,kicker:'NEED HELP NOW',title:'I may be in danger',copy:'Get immediate steps for a suspicious call or a payment you have already made.',tone:'border-rose-400/35 bg-rose-500/10',iconColor:'text-rose-300',cta:'See urgent steps'},
 {href:'/check',icon:SearchCheck,kicker:'NOT SURE?',title:'Check a call or message',copy:'Paste a suspicious message or transcript. We highlight warning signs and explain what they may mean.',tone:'border-teal-400/30 bg-teal-400/10',iconColor:'text-teal-300',cta:'Start a check'},
 {href:'/reports',icon:FolderOpen,kicker:'GET ORGANISED',title:'Prepare my report',copy:'Review saved drafts and take a copy of the information you may need for official reporting.',tone:'border-sky-400/25 bg-sky-400/10',iconColor:'text-sky-300',cta:'Open my reports'}
];
export default function HomePage(){return <div className="overflow-hidden">
 <section className="border-b border-slate-800 bg-[radial-gradient(ellipse_at_76%_0%,rgba(15,118,110,.21),transparent_55%)]">
  <div className="mx-auto max-w-7xl px-5 pb-14 pt-14 md:px-8 md:pb-20 md:pt-20">
   <div className="max-w-4xl"><p className="product-kicker mb-5 flex items-center gap-2"><ShieldCheck size={17}/>Cyber-fraud safety assistant · India</p>
    <h1 className="text-4xl font-extrabold leading-[1.13] tracking-tight text-white sm:text-5xl md:text-6xl">Something feels wrong?<br/><span className="text-teal-300">Know what to do next.</span></h1>
    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Scammers rely on confusion and pressure. Suraksha Setu helps you understand suspicious conversations, choose safer next steps and prepare information for reporting. No complicated dashboard required.</p>
    <div className="mt-8 flex flex-wrap gap-3"><Link href="/check" className="product-btn product-btn-primary"><SearchCheck size={19}/>Check a suspicious message<ArrowRight size={18}/></Link><Link href="/help" className="product-btn product-btn-secondary"><ShieldAlert size={19}/>I need urgent help</Link></div>
   </div>
   <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-400"><span className="inline-flex items-center gap-2"><LockKeyhole size={17} className="text-teal-300"/>Analysis runs in your browser</span><span className="inline-flex items-center gap-2"><ListChecks size={17} className="text-teal-300"/>Plain-language guidance</span><span className="inline-flex items-center gap-2"><ShieldCheck size={17} className="text-teal-300"/>No official action claimed</span></div>
  </div>
 </section>
 <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
  <div className="mb-7"><p className="product-kicker">Choose your starting point</p><h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">What would you like to do?</h2></div>
  <div className="grid gap-5 md:grid-cols-3">{actions.map(a=><Link key={a.href} href={a.href} className={`group flex min-h-[265px] flex-col rounded-2xl border p-6 transition-colors hover:border-teal-400/65 ${a.tone}`}>
   <a.icon size={28} className={a.iconColor}/><p className="mt-6 text-xs font-bold tracking-[.16em] text-slate-400">{a.kicker}</p>
   <h3 className="mt-2 text-xl font-bold text-white">{a.title}</h3><p className="mt-3 flex-1 text-sm leading-6 text-slate-300">{a.copy}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-200">{a.cta}<ArrowRight size={17} className="transition-transform group-hover:translate-x-1"/></span>
  </Link>)}</div>
 </section>
 <section className="border-y border-slate-800 bg-slate-900/60"><div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
  <p className="product-kicker">Simple, from start to finish</p><h2 className="mt-2 text-2xl font-bold">Three steps. One clear outcome.</h2>
  <div className="mt-8 grid gap-6 md:grid-cols-3">{[{n:'01',title:'Understand',copy:'Read an explanation of suspicious requests and pressure tactics.'},{n:'02',title:'Decide',copy:'Choose practical safety actions without a misleading “safe” guarantee.'},{n:'03',title:'Prepare',copy:'Optionally save a local draft and export details for an official complaint.'}].map(s=><div key={s.n} className="border-t border-slate-600 pt-5"><span className="text-3xl font-black text-teal-400/80">{s.n}</span><h3 className="mt-3 text-lg font-bold">{s.title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{s.copy}</p></div>)}</div>
 </div></section>
 <section className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-8"><div className="max-w-2xl">
  <p className="product-kicker">Behind the scenes</p><h2 className="mt-2 text-2xl font-bold">Built on evidence, not a mystery score.</h2><p className="mt-3 text-sm leading-6 text-slate-300">The experimental TRACE engine highlights matching phrases and supports correction of case relationships. Its scores are rule-based indicators, not a validated probability of fraud.</p></div>
  <Link href="/lab" className="product-btn product-btn-secondary shrink-0"><FlaskConical size={18}/>Explore technical demo<ArrowRight size={17}/></Link>
 </section>
 </div>}
