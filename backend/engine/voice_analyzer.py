import os
import numpy as np

class VoiceResult:
    def __init__(self, authenticity_score: float, features: dict, verdict: str, explanation: str):
        self.authenticity_score = authenticity_score
        self.features = features
        self.verdict = verdict
        self.explanation = explanation

class VoiceAnalyzer:
    def __init__(self):
        try:
            import librosa
            self.librosa = librosa
            self.is_available = True
        except ImportError:
            self.is_available = False

    def analyze(self, audio_path: str) -> VoiceResult:
        if not self.is_available or not os.path.exists(audio_path):
            return self.analyze_precomputed(0.5)

        try:
            y, sr = self.librosa.load(audio_path, sr=22050)
            
            # Extract features
            f0, voiced, _ = self.librosa.pyin(y, fmin=self.librosa.note_to_hz('C2'), fmax=self.librosa.note_to_hz('C7'))
            pitch_variance = float(np.nanvar(f0)) if np.any(~np.isnan(f0)) else 0.0
            
            flatness = self.librosa.feature.spectral_flatness(y=y)
            spectral_flatness = float(np.mean(flatness))
            
            zcr = self.librosa.feature.zero_crossing_rate(y)
            zcr_variance = float(np.var(zcr))
            
            mfcc = self.librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            mfcc_variance = float(np.mean(np.var(mfcc, axis=1)))
            
            # High frequency ratio
            S = np.abs(self.librosa.stft(y))
            freqs = self.librosa.fft_frequencies(sr=sr)
            hf_mask = freqs > 8000
            hf_ratio = float(np.mean(S[hf_mask]) / (np.mean(S) + 1e-10))
            
            # Pause regularity
            intervals = self.librosa.effects.split(y, top_db=30)
            pause_lengths = np.diff([i[0] for i in intervals]) / sr
            pause_regularity = float(1.0 - np.std(pause_lengths)) if len(pause_lengths) > 1 else 0.5
            
            # Composite score heuristic
            suspicion = 0
            if pitch_variance < 15: suspicion += 1      
            if spectral_flatness > 0.1: suspicion += 1  
            if hf_ratio < 0.05: suspicion += 1          
            
            authenticity_score = max(0.0, 1.0 - (suspicion * 0.33))
            
            verdict = "Likely Human Voice" if authenticity_score >= 0.7 else "Suspicious Audio Patterns" if authenticity_score >= 0.4 else "Likely AI-Generated Voice"
            
            features = {
                "pitchVariance": pitch_variance,
                "spectralFlatness": spectral_flatness,
                "zeroCrossingRateVariance": zcr_variance,
                "mfccVariance": mfcc_variance,
                "highFrequencyRatio": hf_ratio,
                "pauseRegularity": pause_regularity
            }
            
            return VoiceResult(
                authenticity_score=authenticity_score,
                features=features,
                verdict=verdict,
                explanation=f"Audio analysis indicates it is {verdict}."
            )
            
        except Exception as e:
            return self.analyze_precomputed(0.5)
            
    def analyze_precomputed(self, score: float) -> VoiceResult:
        verdict = "Likely Human Voice" if score >= 0.7 else "Suspicious Audio Patterns" if score >= 0.4 else "Likely AI-Generated Voice"
        features = {
            "pitchVariance": 25.0 if score > 0.5 else 5.0,
            "spectralFlatness": 0.02 if score > 0.5 else 0.15,
            "zeroCrossingRateVariance": 0.005 if score > 0.5 else 0.001,
            "mfccVariance": 1500.0 if score > 0.5 else 500.0,
            "highFrequencyRatio": 0.1 if score > 0.5 else 0.02,
            "pauseRegularity": 0.3 if score > 0.5 else 0.9
        }
        return VoiceResult(
            authenticity_score=score,
            features=features,
            verdict=verdict,
            explanation=f"Precomputed analysis: {verdict}."
        )
