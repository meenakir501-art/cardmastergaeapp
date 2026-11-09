import React, { useEffect, useState } from 'react';
import { ADMOB_CONFIG } from '../../services/admobService';

interface InterstitialAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [canClose, setCanClose] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(2);
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setCanClose(false);
      setCountdown(2);
      return;
    }

    // If offline, don't trap the user with an empty ad
    if (!isOnline) {
      const timer = setTimeout(() => {
        onClose();
      }, 500);
      return () => clearTimeout(timer);
    }

    // 2-second countdown before close button activates
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isOnline, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* AdMob Top Bar Header */}
        <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded uppercase">
              AdMob Test Ad
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Interstitial
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[8px] text-slate-400 font-mono">
              <span>AdChoices</span>
              <span className="text-cyan-400">ⓘ▷</span>
            </div>

            {/* Close Button */}
            {canClose ? (
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 flex items-center justify-center text-sm font-bold border border-slate-700 transition-transform active:scale-90 cursor-pointer"
                title="Close Ad"
              >
                ✕
              </button>
            ) : (
              <span className="text-[10px] font-mono text-slate-400 bg-slate-850 px-2 py-0.5 rounded">
                Close in {countdown}s
              </span>
            )}
          </div>
        </div>

        {/* Ad Unit ID Subheader */}
        <div className="bg-slate-900/90 px-3 py-1 text-[8px] font-mono text-slate-400 border-b border-slate-800/80 truncate">
          Unit: {ADMOB_CONFIG.INTERSTITIAL_TEST_ID}
        </div>

        {/* Interstitial Ad Content (Victory Sponsor Creative) */}
        <div className="p-6 flex flex-col items-center justify-center text-center my-auto min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 shadow-xl mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-3xl">
              🏆
            </div>
          </div>

          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2.5 py-0.5 rounded-full mb-2">
            Victory Interstitial Sponsor
          </span>

          <h3 className="text-2xl font-cinzel font-black text-white tracking-wide leading-tight">
            28 GRAND MASTERS TOURNAMENT
          </h3>
          <p className="text-xs text-slate-300 mt-2 max-w-[260px] leading-relaxed">
            Congratulations on your victory! Join the high-stakes Royal Club with elite players and exclusive seasonal trophies.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 w-full max-w-[260px] text-[11px] font-medium text-slate-300">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-1.5 justify-center">
              <span>🌟</span>
              <span>Daily Badges</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-1.5 justify-center">
              <span>👑</span>
              <span>VIP Leaderboard</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA / Dismiss Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col gap-2">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            CONTINUE TO VICTORY SCREEN ➔
          </button>
        </div>
      </div>
    </div>
  );
};
