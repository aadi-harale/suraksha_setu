'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, FileText, Settings, GitBranch } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Citizen Shield', icon: Shield },
  { href: '/dashboard', label: 'Investigator Dashboard', icon: LayoutDashboard },
  { href: '/evidence', label: 'Evidence & Validation', icon: FileText },
  { href: '/trace', label: 'TRACE Research Lab', icon: GitBranch },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-panel border-r border-white/5 flex flex-col z-20 shadow-2xl relative">
      <div className="p-6 relative">
        {/* Glow behind the logo */}
        <div className="absolute top-6 left-6 w-12 h-12 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="flex items-center gap-3 text-emerald-500 relative z-10">
          <Shield className="w-8 h-8 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <h1 className="text-xl font-bold tracking-tight text-white neon-text-glow">SurakshaNet<span className="text-emerald-400">AI</span></h1>
        </div>
        <p className="text-xs text-slate-400 mt-2 font-mono relative z-10">Real-Time Interception</p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden ${
                isActive 
                  ? 'text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:border-slate-700 border border-transparent'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 cursor-not-allowed opacity-50">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </div>
      </div>
    </aside>
  );
}
