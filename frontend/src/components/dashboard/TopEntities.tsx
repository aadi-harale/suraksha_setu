import { ShieldAlert, Users, Phone, CreditCard, Banknote } from 'lucide-react';
import { FRAUD_GRAPH_DATA } from '@/lib/mock-data';

export default function TopEntities() {
  const criticalEntities = FRAUD_GRAPH_DATA.nodes.filter(n => n.riskLevel === 'critical');
  const highEntities = FRAUD_GRAPH_DATA.nodes.filter(n => n.riskLevel === 'high');
  
  const entities = [...criticalEntities, ...highEntities].slice(0, 5);

  const getIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Phone className="w-3.5 h-3.5 text-blue-400" />;
      case 'upi': return <CreditCard className="w-3.5 h-3.5 text-purple-400" />;
      case 'bank_account': return <Banknote className="w-3.5 h-3.5 text-yellow-400" />;
      default: return <ShieldAlert className="w-3.5 h-3.5 text-red-400" />;
    }
  };

  return (
    <div className="glass-panel rounded-xl border border-slate-800 flex flex-col shadow-xl h-full">
       <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-slate-200 flex items-center gap-2 text-sm uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-orange-500" /> Watchlist Entities
          </h3>
       </div>
       <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {entities.map(entity => (
            <div 
              key={entity.id} 
              className="bg-slate-950/40 border border-slate-800 p-3 rounded-lg flex items-center justify-between hover:border-slate-700 transition-all duration-200 group"
            >
               <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800 group-hover:bg-slate-800 transition-colors">
                    {getIcon(entity.type)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-200 font-mono">{entity.value}</span>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">{entity.type}</span>
                  </div>
               </div>
               <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-semibold ${
                 entity.riskLevel === 'critical' 
                  ? 'bg-red-950/50 text-red-400 border-red-500/20' 
                  : 'bg-orange-950/50 text-orange-400 border-orange-500/20'
               }`}>
                 {entity.riskLevel.toUpperCase()}
               </span>
            </div>
          ))}
       </div>
    </div>
  );
}
