import { BarChart, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';

export default function BaselineComparison() {
  const models = [
    {
      name: "Keyword-only Detector",
      description: "Simple regex matching without context",
      precision: "78%",
      recall: "71%",
      fpr: "18%",
      icon: <Zap className="w-5 h-5 text-slate-400" />,
      color: "border-slate-700 bg-slate-800/30"
    },
    {
      name: "LLM-only Classifier",
      description: "Generative AI API call (GPT-4 / Claude)",
      precision: "84%",
      recall: "86%",
      fpr: "12%",
      icon: <BarChart className="w-5 h-5 text-blue-400" />,
      color: "border-blue-900 bg-blue-950/30"
    },
    {
      name: "SurakshaNet Hybrid Engine",
      description: "Multi-modal orchestration (Voice + Phrase + Graph)",
      precision: "92%",
      recall: "94%",
      fpr: "5%",
      icon: <ShieldAlert className="w-5 h-5 text-emerald-500" />,
      color: "border-emerald-500/50 bg-emerald-950/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
    }
  ];

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col shadow-xl overflow-hidden">
       <div className="p-4 border-b border-slate-800">
          <h3 className="font-semibold text-slate-200 flex items-center gap-2">
            Baseline Comparison 
            <span className="text-xs font-normal text-slate-400 ml-2 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
               Demo benchmark on 20 curated scenarios
            </span>
          </h3>
       </div>
       
       <div className="p-0 overflow-x-auto">
         <table className="w-full text-left border-collapse">
           <thead>
             <tr className="bg-slate-950/50 text-xs uppercase text-slate-400 tracking-wider">
               <th className="p-4 font-medium border-b border-slate-800">Model Architecture</th>
               <th className="p-4 font-medium border-b border-slate-800">Precision</th>
               <th className="p-4 font-medium border-b border-slate-800">Recall</th>
               <th className="p-4 font-medium border-b border-slate-800 text-amber-400/80">False Positive Rate</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-800/50">
             {models.map((model, i) => (
               <tr key={i} className={`transition-colors hover:bg-slate-800/50 ${model.name.includes("SurakshaNet") ? "bg-emerald-950/10" : ""}`}>
                 <td className="p-4">
                   <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-lg border ${model.color}`}>
                       {model.icon}
                     </div>
                     <div>
                       <div className="font-semibold text-slate-200 flex items-center gap-2">
                          {model.name}
                          {model.name.includes("SurakshaNet") && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                       </div>
                       <div className="text-xs text-slate-500 mt-0.5">{model.description}</div>
                     </div>
                   </div>
                 </td>
                 <td className="p-4">
                   <div className={`font-medium ${model.name.includes("SurakshaNet") ? "text-emerald-400 font-bold" : "text-slate-300"}`}>
                     {model.precision}
                   </div>
                 </td>
                 <td className="p-4">
                   <div className={`font-medium ${model.name.includes("SurakshaNet") ? "text-emerald-400 font-bold" : "text-slate-300"}`}>
                     {model.recall}
                   </div>
                 </td>
                 <td className="p-4">
                   <div className={`font-medium ${model.name.includes("SurakshaNet") ? "text-amber-400 font-bold" : "text-slate-400"}`}>
                     {model.fpr}
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
        </div>
       <div className="px-4 pb-3 pt-1">
         <p className="text-[10px] text-slate-500 italic">Illustrative benchmark on curated demo scenarios. Results reflect controlled test conditions, not real-world production deployment.</p>
       </div>
    </div>
  );
}
