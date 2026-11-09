import React, { useRef } from 'react';
import { Card, Suit, TrumpState } from '../types/game';
import { isMoveLegal } from '../logic/rules';
import { PlayingCard } from './PlayingCard';

interface PlayerHandProps {
  hand: Card[];
  isTurn: boolean;
  leadSuit: Suit | null;
  trumpState: TrumpState;
  mustPlayTrump: boolean;
  onPlayCard: (card: Card) => void;
  illegalMoveReason: string | null;
  onIllegalMove: (reason: string) => void;
  canRevealTrump?: boolean;
  onRevealTrump?: () => void;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  hand,
  isTurn,
  leadSuit,
  trumpState,
  mustPlayTrump,
  onPlayCard,
  illegalMoveReason,
  onIllegalMove,
  canRevealTrump,
  onRevealTrump,
}) => {
  const lastPlayTimeRef = useRef<number>(0);

  const handleCardTap = (card: Card) => {
    if (!isTurn) return;

    // Prevent double-tap rapid fire within 400ms
    const now = Date.now();
    if (now - lastPlayTimeRef.current < 400) {
      return;
    }

    // Immediate validation
    const validation = isMoveLegal(card, hand, leadSuit, trumpState, mustPlayTrump);

    if (!validation.legal) {
      onIllegalMove(validation.reason || 'Illegal move! You must follow suit.');
      return;
    }

    // Instant One-Tap Play!
    lastPlayTimeRef.current = now;
    onPlayCard(card);
  };

  const totalCards = hand.length;

  return (
    <div className="w-full flex flex-col items-center select-none pb-0.5">
      {/* Turn instruction, Illegal move banner, or Ask Trump Action */}
      <div className="min-h-[22px] flex items-center justify-center mb-0.5 px-2 text-center gap-2">
        {illegalMoveReason ? (
          <span className="text-xs text-rose-200 font-bold bg-rose-950/95 border border-rose-500/60 px-3 py-0.5 rounded-full animate-shake shadow-md">
            ⚠️ {illegalMoveReason}
          </span>
        ) : canRevealTrump && !trumpState.isRevealed && isTurn ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-200 font-semibold">
              Void in led suit!
            </span>
            <button
              onClick={onRevealTrump}
              className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs shadow-md animate-pulse active:scale-95 transition-transform"
            >
              ASK TRUMP 🂠
            </button>
          </div>
        ) : isTurn ? (
          <span className="text-xs text-amber-300 font-semibold tracking-wide drop-shadow-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping inline-block" />
            Your Turn — Tap a card to play
          </span>
        ) : (
          <span className="text-[11px] text-slate-400">Waiting for turn...</span>
        )}
      </div>

      {/* Player Hand with Enlarged Clean Cards */}
      <div className="relative flex items-end justify-center w-full px-1 max-w-sm sm:max-w-md h-[5.2rem] xs:h-[5.6rem] sm:h-[6.3rem] overflow-visible pb-0.5">
        <div className="flex items-end justify-center -space-x-3.5 xs:-space-x-4 sm:-space-x-4.5 overflow-visible">
          {hand.map((card, idx) => {
            const legalCheck = isMoveLegal(card, hand, leadSuit, trumpState, mustPlayTrump);
            const isDimmed = isTurn && !legalCheck.legal;

            return (
              <div
                key={card.id}
                style={{
                  zIndex: idx + 10,
                }}
                className="shrink-0 transition-transform duration-150 ease-out"
              >
                <div className="transition-all duration-150 hover:-translate-y-3.5 hover:scale-103 active:-translate-y-1.5 cursor-pointer">
                  <PlayingCard
                    card={card}
                    dimmed={isDimmed}
                    isPlayable={isTurn}
                    size="responsive"
                    inHand={true}
                    onClick={() => handleCardTap(card)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
