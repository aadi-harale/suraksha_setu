'use client';
import { DemoScenario } from '@/lib/types';
import { DEMO_SCENARIOS } from '@/lib/mock-data';
import { Play, Pause, RotateCcw, Globe, MapPin, User } from 'lucide-react';

export default function DemoSelector({
  selectedScenario,
  setSelectedScenario,
  isPlaying,
  setIsPlaying,
  currentWordIndex,
  onReset
}: {
  selectedScenario: DemoScenario;
  setSelectedScenario: (scenario: DemoScenario) => void;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  currentWordIndex: number;
  onReset: () => void;
}) {
  const scamScenarios = DEMO_SCENARIOS.filter(s => s.isScam);
  const legitScenarios = DEMO_SCENARIOS.filter(s => !s.isScam);

  return (
    <div className="flex flex-col gap-2 items-end">
      {/* Scenario selector row */}
      <div className="flex gap-3 items-center">
        <select
          className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 min-w-[260px] max-w-[320px]"
          value={selectedScenario.id}
          onChange={(e) => {
            const sc = DEMO_SCENARIOS.find(s => s.id === e.target.value);
            if (sc) { setSelectedScenario(sc); onReset(); }
          }}
        >
          <optgroup label="⚠️ SCAM SCENARIOS">
            {scamScenarios.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </optgroup>
          <optgroup label="✅ LEGITIMATE CALLS">
            {legitScenarios.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </optgroup>
        </select>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center gap-2 font-semibold py-2.5 px-5 rounded-lg transition-all duration-200 shadow-lg ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/40'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Pause' : currentWordIndex === 0 ? 'Start Demo' : 'Resume'}
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2.5 px-3 rounded-lg transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Scenario meta badges */}
      <div className="flex gap-2 text-[10px] font-medium">
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${
          selectedScenario.isScam
            ? 'bg-red-500/15 text-red-400 border-red-500/30'
            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
        }`}>
          {selectedScenario.isScam ? '⚠️ Scam' : '✅ Legitimate'}
        </span>
        {selectedScenario.city && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border bg-slate-800 text-slate-400 border-slate-700">
            <MapPin className="w-2.5 h-2.5" /> {selectedScenario.city}
          </span>
        )}
        {selectedScenario.languageMode && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border bg-slate-800 text-slate-400 border-slate-700">
            <Globe className="w-2.5 h-2.5" /> {selectedScenario.languageMode}
          </span>
        )}
        {selectedScenario.callerDescription && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border bg-slate-800 text-slate-400 border-slate-700 max-w-[220px] truncate">
            <User className="w-2.5 h-2.5 shrink-0" /> {selectedScenario.callerDescription}
          </span>
        )}
      </div>
    </div>
  );
}
