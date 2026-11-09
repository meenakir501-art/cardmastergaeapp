import React from 'react';
import { Download, Share2, PlusSquare, MoreVertical, X, Smartphone, CheckCircle2 } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  onTriggerNativeInstall?: () => Promise<boolean>;
  hasNativePrompt?: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  isIOS,
  onTriggerNativeInstall,
  hasNativePrompt,
}) => {
  if (!isOpen) return null;

  const handleNativeClick = async () => {
    sound.playClick();
    if (onTriggerNativeInstall) {
      const accepted = await onTriggerNativeInstall();
      if (accepted) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-amber-400/80 shadow-2xl overflow-hidden p-6 text-white text-center">
        {/* Glow corner accents */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* App Icon Preview */}
        <div className="flex flex-col items-center mb-4 mt-1">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 border-2 border-amber-400 shadow-xl p-2 flex items-center justify-center relative">
            <img src="/icon.svg" alt="28 Card Master" className="w-full h-full object-contain" />
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">
              28
            </div>
          </div>
          <h3 className="text-xl font-bold font-cinzel text-amber-300 mt-3">
            28 Card Master
          </h3>
          <p className="text-xs text-emerald-400 font-medium">
            100% Offline • Free To Play • No Internet Needed
          </p>
        </div>

        {/* Primary Action Button (If native 1-click install prompt is supported) */}
        {hasNativePrompt && (
          <div className="mb-4">
            <button
              onClick={handleNativeClick}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 border border-amber-300"
            >
              <Download className="w-5 h-5" />
              <span>Install App Now / अभी इनस्टॉल करें</span>
            </button>
          </div>
        )}

        {/* Guided Steps Container */}
        <div className="text-left bg-slate-900/90 rounded-2xl p-4 border border-slate-800 mb-4 space-y-3">
          <div className="text-xs font-bold text-amber-300 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>
              {isIOS ? 'iPhone / iPad Installation' : 'Mobile / Chrome Installation'}
            </span>
          </div>

          {isIOS ? (
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  Tap the <strong className="text-white">Share (शेयर)</strong> button in Safari toolbar{' '}
                  <Share2 className="w-3.5 h-3.5 inline text-sky-400" />.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  Scroll down and tap <strong className="text-white">Add to Home Screen (होम स्क्रीन में जोड़ें)</strong>{' '}
                  <PlusSquare className="w-3.5 h-3.5 inline text-emerald-400" />.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  Tap <strong className="text-white">Add</strong> in top-right corner to finish!
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  Tap the browser menu <strong className="text-white">(⋮ Three Dots)</strong> at top-right{' '}
                  <MoreVertical className="w-3.5 h-3.5 inline text-slate-400" />.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  Tap <strong className="text-white">"Install App"</strong> or <strong className="text-white">"Add to Home screen"</strong>.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  Tap <strong className="text-white">Install</strong> to add directly to your phone screen!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Benefits bullets */}
        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 mb-4">
          <div className="flex items-center gap-1.5 bg-slate-900/60 rounded-lg p-2 border border-slate-800/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Full Offline Play</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/60 rounded-lg p-2 border border-slate-800/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>No Ads / Free</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/60 rounded-lg p-2 border border-slate-800/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Fast Loading</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/60 rounded-lg p-2 border border-slate-800/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Real Card Sounds</span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition border border-slate-700"
        >
          Close / बंद करें
        </button>
      </div>
    </div>
  );
};
