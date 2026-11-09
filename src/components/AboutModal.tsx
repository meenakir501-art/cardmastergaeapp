import React from 'react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-sm w-full p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🂠</span>
            <h2 className="font-cinzel font-bold text-lg text-white">About 28 Card Master</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            <strong className="text-amber-300 font-cinzel">28 Card Game</strong> is an authentic South Asian classic trick-taking card game renowned for its strategic bidding and suspenseful concealed trump mechanism.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Cards:</span>
              <span className="text-slate-200 font-mono-nums font-bold">32 Cards (J, 9, A, 10, K, Q, 8, 7)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Card Points:</span>
              <span className="text-slate-200 font-mono-nums font-bold">28 Points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Bidding Range:</span>
              <span className="text-slate-200 font-mono-nums font-bold">14 to 28</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Players:</span>
              <span className="text-slate-200 font-mono-nums font-bold">4 Players (2 Teams)</span>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Engineered with a high-performance local AI engine, smooth 60 FPS transitions, realistic card physics, and synthesized Web Audio. Works 100% offline.
          </p>
        </div>

        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-transform active:scale-95"
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};
