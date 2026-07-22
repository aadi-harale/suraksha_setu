'use client';
import { VALIDATION_METRICS } from '@/lib/mock-data';

export default function ConfusionMatrix() {
  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Confusion Matrix (12 Curated Scenarios)</h4>
      
      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/40">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-[10px] uppercase text-slate-500 tracking-wider border-b border-slate-800">
              <th className="p-2 border-r border-slate-800 w-1/3">Actual \ Pred</th>
              <th className="p-2 border-r border-slate-800 text-red-400">Predicted Scam</th>
              <th className="p-2 text-emerald-400">Predicted Normal</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-800/60">
              <td className="p-3 text-xs font-semibold text-slate-400 bg-slate-900/20 border-r border-slate-800 text-left">
                Actual Scam
              </td>
              <td className="p-3 bg-red-950/20 border-r border-slate-800">
                <div className="text-xl font-bold text-red-400">{VALIDATION_METRICS.truePositives}</div>
                <div className="text-[9px] text-slate-500 uppercase font-mono">True Pos (TP)</div>
              </td>
              <td className="p-3 bg-slate-900/10">
                <div className="text-xl font-bold text-slate-600">{VALIDATION_METRICS.falseNegatives}</div>
                <div className="text-[9px] text-slate-600 uppercase font-mono">False Neg (FN)</div>
              </td>
            </tr>
            <tr>
              <td className="p-3 text-xs font-semibold text-slate-400 bg-slate-900/20 border-r border-slate-800 text-left">
                Actual Normal
              </td>
              <td className="p-3 bg-slate-900/10 border-r border-slate-800">
                <div className="text-xl font-bold text-slate-600">{VALIDATION_METRICS.falsePositives}</div>
                <div className="text-[9px] text-slate-600 uppercase font-mono">False Pos (FP)</div>
              </td>
              <td className="p-3 bg-emerald-950/20">
                <div className="text-xl font-bold text-emerald-400">{VALIDATION_METRICS.trueNegatives}</div>
                <div className="text-[9px] text-slate-500 uppercase font-mono">True Neg (TN)</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-slate-500 mt-2 italic text-center">
        The confusion matrix displays performance over the selected curation set.
      </p>
    </div>
  );
}
