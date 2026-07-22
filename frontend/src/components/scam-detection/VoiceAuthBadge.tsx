'use client';
import { AudioWaveform } from 'lucide-react';

export default function VoiceAuthBadge({ authenticityScore, isPlaying }: { authenticityScore: number, isPlaying: boolean }) {
  const isDeepfake = authenticityScore < 0.5;
  const isSuspicious = authenticityScore >= 0.5 && authenticityScore < 0.7;

  let colorClass = 'text-emerald-400';
  let bgClass = 'bg-emerald-500/10';
  let borderClass = 'border-emerald-500/30';
  let label = 'Likely Human';

  if (isDeepfake) {
    colorClass = 'text-red-500';
    bgClass = 'bg-red-500/10';
    borderClass = 'border-red-500/50';
    label = 'Synthetic Voice Suspicion';
  } else if (isSuspicious) {
    colorClass = 'text-amber-400';
    bgClass = 'bg-amber-500/10';
    borderClass = 'border-amber-500/30';
    label = 'Suspicious Audio';
  }

  // Generate mock spectrogram bars (deterministic to avoid hydration mismatches)
  const bars = Array.from({ length: 16 }).map((_, i) => {
    const height = 20 + ((i * 13) % 70);
    const animationDelay = `${(i * 0.03).toFixed(2)}s`;
    return { height, animationDelay };
  });

  return (
    <div className={`bg-slate-900/80 border ${borderClass} rounded-xl p-6 mt-auto transition-colors duration-500`}>
      <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
        <AudioWaveform className="w-4 h-4" /> Live Spectrogram
      </h3>
      
      {/* Waveform Visualization */}
      <div className={`h-16 flex items-end gap-[2px] mb-4 ${bgClass} rounded p-2 overflow-hidden border border-slate-800`}>
        {bars.map((bar, i) => (
          <div 
            key={i}
            className={`w-full rounded-t-sm ${isDeepfake && i % 4 === 0 ? 'bg-red-500' : (isDeepfake ? 'bg-red-400/50' : (isSuspicious ? 'bg-amber-400/60' : 'bg-emerald-400/60'))}`}
            style={{ 
              height: isPlaying ? `${Math.max(20, bar.height)}%` : '10%',
              transition: 'height 0.1s ease',
              animationName: isPlaying ? 'pulse-height' : 'none',
              animationDuration: '0.8s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDirection: 'alternate',
              animationDelay: bar.animationDelay
            }}
          />
        ))}
      </div>

      {/* Adding the pulse keyframes to a style block */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-height {
          0% { transform: scaleY(0.7); }
          100% { transform: scaleY(1.3); }
        }
      `}} />

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">Authenticity Score</span>
        <span className={`text-sm font-bold ${colorClass}`}>{authenticityScore.toFixed(2)}/1.00</span>
      </div>

      <div className="mt-3 p-3 bg-slate-950/50 rounded border border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-300 font-medium">{label}</span>
        <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
          isDeepfake ? 'bg-red-500/20 text-red-400' : (isSuspicious ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400')
        }`}>
          {isDeepfake ? 'High Suspicion' : (isSuspicious ? 'Audit Req' : 'Verified')}
        </span>
      </div>
      <p className="text-[10px] text-slate-500 mt-2 italic leading-relaxed text-center">
        Audio anomaly score is a supporting signal only and is not standalone proof of synthetic voice.
      </p>
    </div>
  );
}
