'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ShieldCheck, House, SearchCheck, FolderOpen, LifeBuoy, Menu, X, FlaskConical, ArrowUpRight, Mic } from 'lucide-react';

const routes = [
  { href:'/', label:'Home', icon:House },
  { href:'/listen', label:'Live warnings', icon:Mic },
  { href:'/check', label:'Text check', icon:SearchCheck },
  { href:'/reports', label:'Case workspace', icon:FolderOpen },
  { href:'/help', label:'Get help', icon:LifeBuoy },
];

export default function Navigation() {
 const path=usePathname();
 const [open,setOpen]=useState(false);
 return <header className="sticky top-0 z-50 border-b border-slate-700/60 bg-[#0c1622]/95 backdrop-blur-lg">
  <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-white focus:p-3 focus:text-black">Skip to content</a>
  <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 md:px-7">
   <Link href="/" className="flex min-w-0 items-center gap-3" onClick={()=>setOpen(false)}>
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-400/15 text-teal-300"><ShieldCheck size={26}/></span>
    <span className="leading-tight"><span className="block text-lg font-bold tracking-tight text-white">Suraksha Setu</span><span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Understand · Protect · Report</span></span>
   </Link>
   <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
    {routes.map(({href,label,icon:Icon})=><Link key={href} href={href} aria-current={path===href?'page':undefined} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${path===href?'bg-teal-400/15 text-teal-200':'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><Icon size={17}/>{label}</Link>)}
   </nav>
   <Link href="/lab" className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 xl:flex"><FlaskConical size={16}/>Explore prototype<ArrowUpRight size={15}/></Link>
   <button aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(x=>!x)} className="rounded-lg border border-slate-600 p-2 text-white lg:hidden">{open?<X/>:<Menu/>}</button>
  </div>
  {open&&<nav aria-label="Mobile navigation" className="space-y-1 border-t border-slate-700 bg-[#0c1622] px-4 pb-4 pt-2 lg:hidden">
   {[...routes,{href:'/lab',label:'Explore prototype',icon:FlaskConical}].map(({href,label,icon:Icon})=><Link key={href} href={href} onClick={()=>setOpen(false)} className={`flex items-center gap-3 rounded-lg p-3 text-sm ${path===href?'bg-teal-400/15 text-teal-200':'text-slate-200'}`}><Icon size={19}/>{label}</Link>)}
  </nav>}
 </header>;
}
