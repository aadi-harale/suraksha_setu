'use client';
import { Phone, Mic } from 'lucide-react';

function formatTranscript(text: string) {
  if (!text) return null;
  // Split on newlines, render each line with color coding
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} className="h-2" />;

    const isCallerLine = /^(Caller|NCB Officer|Caller \(transferred\)|\[Press 1\]|\[Transfer\])/i.test(trimmed);
    const isVictimLine = /^Victim:/i.test(trimmed);
    const isMeta = /^\[.*\]$/.test(trimmed);

    if (isMeta) {
      return (
        <div key={i} className="text-slate-500 text-xs italic my-1 pl-2 border-l border-slate-700">
          {trimmed}
        </div>
      );
    }
    if (isCallerLine) {
      const colonIdx = trimmed.indexOf(':');
      const speaker = colonIdx > -1 ? trimmed.slice(0, colonIdx + 1) : '';
      const speech = colonIdx > -1 ? trimmed.slice(colonIdx + 1) : trimmed;
      return (
        <div key={i} className="flex gap-2 mb-2">
          <span className="shrink-0 text-red-400 font-bold text-xs mt-0.5 w-24 text-right leading-5">{speaker}</span>
          <span className="text-red-100/90 text-xs leading-5">{speech}</span>
        </div>
      );
    }
    if (isVictimLine) {
      const colonIdx = trimmed.indexOf(':');
      const speaker = colonIdx > -1 ? trimmed.slice(0, colonIdx + 1) : '';
      const speech = colonIdx > -1 ? trimmed.slice(colonIdx + 1) : trimmed;
      return (
        <div key={i} className="flex gap-2 mb-2">
          <span className="shrink-0 text-emerald-400 font-bold text-xs mt-0.5 w-24 text-right leading-5">{speaker}</span>
          <span className="text-emerald-100/90 text-xs leading-5">{speech}</span>
        </div>
      );
    }
    return (
      <div key={i} className="text-slate-300 text-xs mb-2 pl-2">{trimmed}</div>
    );
  });
}

export default function TranscriptPanel({ 
  displayedText, 
  isPlaying 
}: { 
  displayedText: string;
  isPlaying: boolean;
}) {
  const hasContent = displayedText.trim().length > 0;

  return (
    <div className="glass-panel rounded-xl border border-white/10 flex-1 p-5 flex flex-col hover:scale-[1.01] transition-transform duration-300">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-300 uppercase tracking-wider">
        <Phone className="w-4 h-4 text-emerald-400" /> Live Call Transcript
        {isPlaying && (
          <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-red-400 animate-pulse">
            <Mic className="w-3 h-3" /> RECORDING
          </span>
        )}
      </h3>
      <div className="flex-1 bg-black/60 rounded-lg p-4 overflow-y-auto border border-white/5 shadow-inner min-h-0">
        {hasContent ? (
          <>
            <div className="mb-2 flex gap-4 text-[10px] pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1 text-red-400"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Caller</span>
              <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Victim</span>
            </div>
            {formatTranscript(displayedText)}
            {isPlaying && <span className="inline-block w-2 h-4 bg-emerald-500 ml-1 animate-pulse shadow-[0_0_10px_#10b981]"></span>}
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3">
            <Phone className="w-10 h-10 text-slate-700" />
            <p className="text-slate-500 text-sm">Select a scenario and press <strong className="text-slate-400">Start Demo</strong> to begin live interception.</p>
          </div>
        )}
      </div>
    </div>
  );
}
