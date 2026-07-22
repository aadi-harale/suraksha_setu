'use client';

import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Phone, ShieldAlert, Activity } from 'lucide-react';
import { DEMO_SCENARIOS } from '@/lib/mock-data';
import { DemoScenario, PhraseMatch } from '@/lib/types';
import { ANIMATION, RISK_THRESHOLDS } from '@/lib/constants';

import DemoSelector from '@/components/scam-detection/DemoSelector';
import TranscriptPanel from '@/components/scam-detection/TranscriptPanel';
import RiskMeter from '@/components/scam-detection/RiskMeter';
import RiskTimeline from '@/components/scam-detection/RiskTimeline';
import KillChainStage from '@/components/scam-detection/KillChainStage';
import WarningOverlay from '@/components/scam-detection/WarningOverlay';
import ImpactBadge from '@/components/scam-detection/ImpactBadge';
import VoiceAuthBadge from '@/components/scam-detection/VoiceAuthBadge';
import FalsePositiveDefense from '@/components/false-positive-defense';
import SuspectRepositoryCheck from '@/components/suspect-repository-check';
import { lookupEntity } from '@/lib/mock-suspect-repository';
import StressAnalyzer from '@/components/scam-detection/StressAnalyzer';
import RealityCheck from '@/components/scam-detection/reality-check';
import AiTriagePanel from '@/components/ai-triage-panel';
import JudgeDemoMode from '@/components/shared/judge-demo-mode';

export default function CitizenShieldPage() {
  const [isDemoModeActive, setIsDemoModeActive] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario>(DEMO_SCENARIOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentRiskScore, setCurrentRiskScore] = useState(0);
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    setWords(selectedScenario.transcript.split(' '));
    setCurrentWordIndex(0);
    setCurrentRiskScore(0);
    setIsPlaying(false);
  }, [selectedScenario]);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentWordIndex < words.length) {
      const timer = setTimeout(() => {
        setCurrentWordIndex(prev => prev + 1);
        
        // Calculate risk based on progress
        const progress = currentWordIndex / words.length;
        const riskPoints = selectedScenario.riskProgression;
        
        if (riskPoints.length > 0) {
          const index = Math.min(
            Math.floor(progress * riskPoints.length),
            riskPoints.length - 1
          );
          setCurrentRiskScore(riskPoints[index]);
        }
      }, ANIMATION.TRANSCRIPT_WORD_DELAY);
      return () => clearTimeout(timer);
    } else {
      setIsPlaying(false);
      setCurrentRiskScore(selectedScenario.expectedRiskScore);
    }
  }, [isPlaying, currentWordIndex, words.length, selectedScenario]);

  const displayedText = words.slice(0, currentWordIndex).join(' ');
  const showWarning = currentRiskScore >= RISK_THRESHOLDS.WARNING_TRIGGER;
  
  const progress = words.length > 0 ? currentWordIndex / words.length : 0;
  const suspectEntity = selectedScenario.entities?.upis?.[0] || selectedScenario.entities?.phones?.[0];
  const suspectRecord = selectedScenario.isScam && suspectEntity ? lookupEntity(suspectEntity) : null;
  const showSuspectCheck = suspectRecord && progress >= (selectedScenario.killChainStagesAt?.['5'] || 0.6);

  let currentStep = -1;
  if (isPlaying || currentWordIndex > 0) {
    if (progress === 1) currentStep = 9;
    else if (currentRiskScore >= 80) currentStep = 8;
    else if (currentRiskScore >= 75) currentStep = 7;
    else if (progress >= 0.8 || (selectedScenario.killChainStagesAt && progress >= (selectedScenario.killChainStagesAt['5'] || 0.8))) currentStep = 6;
    else if (showSuspectCheck) currentStep = 5;
    else if (currentRiskScore >= 55) currentStep = 4;
    else if (progress > 0.3) currentStep = 3;
    else if (currentRiskScore > 20) currentStep = 2;
    else if (progress > 0.1) currentStep = 1;
    else if (currentWordIndex > 0) currentStep = 0;
  }

  const handleStartDemo = () => {
    setIsDemoModeActive(true);
    // Find the primary scam scenario to play
    const scamScenario = DEMO_SCENARIOS.find(s => s.type === 'digital_arrest') || DEMO_SCENARIOS[0];
    setSelectedScenario(scamScenario);
    setCurrentWordIndex(0);
    setCurrentRiskScore(0);
    setIsPlaying(true);
  };

  return (
    <div className="h-full flex flex-col p-6 max-w-7xl mx-auto gap-4 relative">
      <JudgeDemoMode 
        currentStep={currentStep} 
        isActive={isDemoModeActive} 
        onStartDemo={handleStartDemo} 
      />

      <header className="flex justify-between items-center glass-panel p-4 rounded-xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-emerald-500" />
            Citizen Shield Live Interception
          </h2>
          <p className="text-slate-400 text-sm mt-1">Real-time digital arrest detection and victim protection</p>
        </div>
        <DemoSelector 
          selectedScenario={selectedScenario}
          setSelectedScenario={setSelectedScenario}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentWordIndex={currentWordIndex}
          onReset={() => { setCurrentWordIndex(0); setCurrentRiskScore(0); setIsPlaying(false); }}
        />
      </header>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column: Transcript */}
        <div className="col-span-5 flex flex-col gap-4">
          <TranscriptPanel displayedText={displayedText} isPlaying={isPlaying} />
        </div>

        {/* Center Column: Risk Meter & Stages */}
        <div className="col-span-4 flex flex-col gap-4">
          <RiskMeter currentRiskScore={currentRiskScore} scenario={selectedScenario} />
          <RiskTimeline riskProgression={selectedScenario.riskProgression.slice(0, currentWordIndex > 0 ? Math.ceil((currentWordIndex / words.length) * selectedScenario.riskProgression.length) : 0)} />
          <KillChainStage scenario={selectedScenario} progress={currentWordIndex > 0 ? currentWordIndex / words.length : 0} />
          <FalsePositiveDefense scenario={selectedScenario} />
          {showSuspectCheck && suspectRecord && (
            <SuspectRepositoryCheck record={suspectRecord} />
          )}
          <AiTriagePanel scenario={selectedScenario} currentRiskScore={currentRiskScore} />
        </div>

        {/* Right Column: Actions & Voice */}
        <div className="col-span-3 flex flex-col gap-4">
           <WarningOverlay currentRiskScore={currentRiskScore} />
           
           <ImpactBadge currentRiskScore={currentRiskScore} />

           <RealityCheck show={currentRiskScore >= 55} />

           <VoiceAuthBadge authenticityScore={selectedScenario.voiceAuthenticity} isPlaying={isPlaying} />
           
           <StressAnalyzer progress={currentWordIndex > 0 ? currentWordIndex / words.length : 0} />
        </div>
      </div>
    </div>
  );
}
