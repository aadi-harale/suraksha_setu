'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Shield, Bell, X, ShieldCheck } from 'lucide-react';

export default function WarningOverlay({ currentRiskScore }: { currentRiskScore: number }) {
  const [showUPI, setShowUPI] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [trustedAlertSent, setTrustedAlertSent] = useState(false);
  const [hasShownUpi, setHasShownUpi] = useState(false);

  useEffect(() => {
    // Trigger the fake UPI screen when risk gets very high (simulating payment demand)
    if (currentRiskScore >= 80 && !hasShownUpi) {
      setShowUPI(true);
      setHasShownUpi(true);
    }
    if (currentRiskScore < 80) {
      setHasShownUpi(false); // reset if we drop back down
      setShowUPI(false);
      setShowBlock(false);
      setTrustedAlertSent(false);
    }
  }, [currentRiskScore, hasShownUpi]);

  const handleProceedToPay = () => {
    setShowUPI(false);
    setShowBlock(true);
  };

  const handleTrustedAlert = () => {
    setTrustedAlertSent(true);
  };

  if (currentRiskScore < 56) return null;

  return (
    <>
      <div className={`glass-panel border rounded-xl p-6 transition-colors duration-500 ${currentRiskScore >= 76 ? 'bg-red-950/50 border-red-500/50 shadow-2xl shadow-red-900/20' : 'bg-orange-950/50 border-orange-500/50'}`}>
        <div className={`flex items-center gap-3 mb-4 ${currentRiskScore >= 76 ? 'text-red-400 animate-pulse' : 'text-orange-400'}`}>
          <AlertTriangle className="w-8 h-8" />
          <h3 className="text-xl font-bold">{currentRiskScore >= 76 ? 'CRITICAL WARNING' : 'HIGH RISK'}</h3>
        </div>
        
        {currentRiskScore >= 76 ? (
          <>
            <p className="text-white font-medium mb-2">Likely Digital Arrest Scam.</p>
            <p className="text-red-200 text-sm mb-6">Do not transfer money. Real officers do not demand payment over calls.</p>
            
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg mb-3 flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" /> Hang Up Now
            </button>
            <button 
              onClick={() => {
                setShowBlock(false);
                setTrustedAlertSent(true);
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              Alert Trusted Contact
            </button>
          </>
        ) : (
          <>
            <p className="text-white font-medium mb-2">Suspicious pattern detected.</p>
            <p className="text-orange-200 text-sm mb-4">The caller is using isolation tactics and legal threats.</p>
            <div className="bg-orange-900/40 p-3 rounded-lg flex items-start gap-3">
              <Shield className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-orange-100">Do not share OTPs, click links, or download AnyDesk/TeamViewer.</p>
            </div>
          </>
        )}
      </div>

      {/* Fake UPI Payment Screen Modal */}
      {showUPI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-blue-600 p-4 text-center">
              <h3 className="text-white font-bold text-lg">Payment Request</h3>
            </div>
            <div className="p-6 text-center">
              <p className="text-slate-400 text-sm mb-1">Paying to</p>
              <p className="text-white font-bold text-xl mb-6">rbi.verify@okaxis</p>
              
              <div className="bg-slate-800 rounded-lg p-4 mb-6">
                <p className="text-3xl font-bold text-white">₹48,000</p>
                <p className="text-slate-400 text-sm mt-1">Purpose: Verification deposit</p>
              </div>

              <button 
                onClick={handleProceedToPay}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Proceed to Pay
              </button>
              <button 
                onClick={() => setShowUPI(false)}
                className="w-full mt-3 text-slate-400 hover:text-white text-sm py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Blocked Modal */}
      {showBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="bg-red-950 border border-red-500 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-red-600 p-4 flex items-center justify-center gap-2">
              <AlertTriangle className="w-6 h-6 text-white" />
              <h3 className="text-white font-bold text-lg">CRITICAL WARNING: Digital Arrest Scam Likely</h3>
            </div>
            <div className="p-6">
              <p className="text-white text-base mb-4">
                This payment request matches an active digital arrest scam pattern. The UPI ID is linked to <strong>7 previous cases</strong>.
              </p>
              <p className="text-red-300 font-semibold mb-6">
                Do not transfer money. Call 1930 and verify with family.
              </p>
              
              <div className="bg-red-900/50 rounded-lg p-4 mb-6 flex items-center justify-between border border-red-500/30">
                <span className="text-red-200">Potential Loss Prevented:</span>
                <span className="text-2xl font-bold text-white">₹48,000</span>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => {
                    handleTrustedAlert();
                    setShowBlock(false);
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 border border-slate-600"
                >
                  <Bell className="w-5 h-5" /> Alert Trusted Contact
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" /> Call 1930
                </button>
                <button 
                  onClick={() => setShowBlock(false)}
                  className="w-full bg-transparent hover:bg-red-900/50 text-red-300 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trusted Contact Alert Modal */}
      {trustedAlertSent && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 rounded-xl shadow-2xl w-80 overflow-hidden animate-in slide-in-from-right-8 duration-300">
          <div className="bg-emerald-600/20 p-3 flex justify-between items-center border-b border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="font-bold text-sm">Trusted Contact Alert Sent</h4>
            </div>
            <button onClick={() => setTrustedAlertSent(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4">
            <p className="text-white text-sm mb-2">Possible digital arrest scam targeting Aadi.</p>
            <p className="text-slate-300 text-xs mb-1"><strong>Risk Score:</strong> 92/100</p>
            <p className="text-slate-300 text-xs mb-3"><strong>Payment request detected:</strong> ₹48,000 to rbi.verify@okaxis</p>
            <div className="bg-slate-800 p-2 rounded border border-slate-700">
              <p className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold mb-1">Recommended Action</p>
              <p className="text-xs text-slate-300">Call the victim immediately and ask them to disconnect.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
