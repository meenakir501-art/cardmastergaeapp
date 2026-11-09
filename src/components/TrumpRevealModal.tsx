import React, { useEffect } from 'react';
import { Card, PlayerId, Suit } from '../types/game';
import { SUIT_SYMBOLS } from '../utils/deck';
import { PlayingCard } from './PlayingCard';

interface TrumpRevealModalProps {
  suit: Suit;
  card: Card | null;
  revealedBy: PlayerId;
  revealedByName: string;
  onDismiss: () => void;
}

export const TrumpRevealModal: React.FC<TrumpRevealModalProps> = ({
  suit,
  card,
  revealedByName,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const isRed = suit === 'HEARTS' || suit === 'DIAMONDS';

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-b from-slate-900 to-emerald-950 border-2 border-amber-400/90 rounded-2xl p-6 flex flex-col items-center max-w-xs w-full shadow-2xl shadow-amber-500/30 text-center animate-scale-up"
      >
        <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 mb-1">
          Trump Revealed!
        </span>

        <p className="text-sm text-slate-300 mb-4">
          <span className="font-bold text-white">{revealedByName}</span> asked for trump!
        </p>

        {/* Flipping Card Effect */}
        <div className="relative my-2 transform transition-transform duration-500 hover:scale-105">
          <PlayingCard card={card || undefined} size="lg" isPlayable={false} />
        </div>

        {/* Suit Emblem Banner */}
        <div
          className={`mt-4 px-4 py-2 rounded-xl border flex items-center gap-2 ${
            isRed
              ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
              : 'bg-slate-800/80 border-slate-600/40 text-amber-300'
          }`}
        >
          <span className="text-2xl">{SUIT_SYMBOLS[suit]}</span>
          <span className="font-cinzel font-bold text-lg">{suit}</span>
        </div>

        <p className="text-[11px] text-slate-400 mt-4">
          All future tricks will honor {suit} as active trump!
        </p>

        <button
          onClick={onDismiss}
          className="mt-4 w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-transform active:scale-95"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
