import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../audio/soundEngine';
import { ADMOB_CONFIG, admobService } from '../../services/admobService';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardGranted?: (rewardAmount: number) => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  onClose,
  onRewardGranted,
}) => {
  const TOTAL_SECONDS = 6;
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_SECONDS);
  const [isRewarded, setIsRewarded] = useState<boolean>(false);
  const [showCloseWarning, setShowCloseWarning] = useState<boolean>(false);
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
      setTimeLeft(TOTAL_SECONDS);
      setIsRewarded(false);
      setShowCloseWarning(false);
      return;
    }

    if (!isOnline) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleGrantReward();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isOnline]);

  const handleGrantReward = () => {
    setIsRewarded(true);
    sound.playTrickWin();
    admobService.addCoins(ADMOB_CONFIG.REWARD_AMOUNT);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
      });
    } catch {
      // Confetti fallback
    }

    if (onRewardGranted) {
      onRewardGranted(ADMOB_CONFIG.REWARD_AMOUNT);
    }
  };

  const handleAttemptClose = () => {
    if (isRewarded) {
      onClose();
    } else {
      setShowCloseWarning(true);
    }
  };

  if (!isOpen) return null;

  const progressPercent = ((TOTAL_SECONDS - timeLeft) / TOTAL_SECONDS) * 100;

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
              Rewarded Video
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-400 font-mono">
              {isRewarded ? (
                <span className="text-emerald-400 font-bold">Reward Granted</span>
              ) : (
                `Reward in ${timeLeft}s`
              )}
            </span>
            <button
              onClick={handleAttemptClose}
              className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold transition-transform active:scale-90"
              title="Close Ad"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Ad Unit ID Subheader */}
        <div className="bg-slate-900/90 px-3 py-1 text-[8px] font-mono text-slate-400 border-b border-slate-800/80 truncate">
          Unit: {ADMOB_CONFIG.REWARDED_TEST_ID}
        </div>

        {/* Video Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Simulated Video Ad Creative or Offline Notice */}
        {!isOnline ? (
          <div className="p-6 flex flex-col items-center justify-center text-center my-auto min-h-[260px]">
            <div className="w-16 h-16 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-3xl mb-3">
              📡
            </div>
            <h3 className="text-lg font-cinzel font-bold text-amber-300">
              No Internet Connection
            </h3>
            <p className="text-xs text-slate-200 mt-2 max-w-[260px] leading-relaxed">
              Google AdMob विज्ञापन लोड करने के लिए इंटरनेट चालू होना आवश्यक है।
            </p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[260px]">
              Ads require active Wi-Fi or Mobile Data to load from Google AdMob servers.
            </p>
            <div className="mt-4 px-3 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] text-amber-300 font-mono">
              Unit: {ADMOB_CONFIG.REWARDED_TEST_ID}
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center justify-center text-center my-auto min-h-[260px]">
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 p-0.5 shadow-xl mb-4 animate-bounce">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-4xl">
                🎁
              </div>
            </div>

            <h3 className="text-xl font-cinzel font-black text-amber-300 tracking-wider">
              GOLD REWARD SPONSOR
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-[240px]">
              Watch this sponsor showcase to claim your <strong>+500 Free Coins</strong>!
            </p>

            <div className="mt-4 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono font-bold text-xs flex items-center gap-1.5">
              <span>🪙</span>
              <span>+500 CHIPS BONUS</span>
            </div>

            {/* Reward Status Banner */}
            {isRewarded ? (
              <div className="mt-5 px-4 py-2 bg-emerald-950 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs font-bold animate-pulse">
                🎉 Congratulations! 500 Coins added to your balance.
              </div>
            ) : (
              <div className="mt-5 text-[11px] text-slate-400">
                Please watch until the timer reaches 0 to earn reward.
              </div>
            )}
          </div>
        )}

        {/* Bottom Action Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col gap-2">
          {!isOnline ? (
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs uppercase tracking-wider"
            >
              CLOSE
            </button>
          ) : isRewarded ? (
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95"
            >
              COLLECT REWARD & CLOSE 🪙
            </button>
          ) : (
            <div className="w-full py-2.5 bg-slate-800/60 text-slate-400 font-bold rounded-xl text-xs text-center border border-slate-700/60">
              Ad Playing... ({timeLeft}s remaining)
            </div>
          )}
        </div>

        {/* Warning Modal when closing prematurely */}
        {showCloseWarning && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm p-4 flex items-center justify-center z-20">
            <div className="bg-slate-900 border border-amber-500 rounded-2xl p-4 text-center max-w-[260px]">
              <span className="text-2xl mb-1 block">⚠️</span>
              <h4 className="text-sm font-bold text-white">Leave Early?</h4>
              <p className="text-[11px] text-slate-300 mt-1 mb-3">
                If you close now, you will lose your +500 Coins reward!
              </p>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setShowCloseWarning(false)}
                  className="w-full py-2 bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  KEEP WATCHING
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-1.5 bg-slate-800 text-slate-400 text-xs rounded-lg hover:text-white"
                >
                  Close Without Reward
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
