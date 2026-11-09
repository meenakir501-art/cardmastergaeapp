import React from 'react';
import { PlayerId, Suit, TrumpState } from '../types/game';
import { SUIT_SYMBOLS } from '../utils/deck';
import { PlayingCard } from './PlayingCard';

interface TrumpBoxProps {
  trumpState: TrumpState;
  bidWinner: PlayerId | null;
  contractBid: number;
  canReveal: boolean;
  onRevealTrump: () => void;
  isHumanBidder: boolean;
}

export const TrumpBox: React.FC<TrumpBoxProps> = ({
  trumpState,
  contractBid,
  canReveal,
  onRevealTrump,
  isHumanBidder,
}) => {
  const [isPeeking, setIsPeeking] = React.useState(false);

  return (
    <div className="flex flex-col items-center bg-emerald-950/90 border border-amber-500/30 rounded-lg p-1 backdrop-blur-xs shadow-md select-none shrink-0 w-12 sm:w-14">
      <div className="flex items-center justify-between w-full gap-0.5 mb-0.5 px-0.5">
        <span className="text-[8px] uppercase font-bold tracking-wider text-amber-300">
          Trump
        </span>
        {contractBid > 0 && (
          <span className="text-[8px] font-mono tabular-nums font-bold text-amber-200">
            {contractBid}
          </span>
        )}
      </div>

      <div className="relative">
        {trumpState.isRevealed ? (
          // Revealed Trump Card & Suit
          <div className="flex flex-col items-center animate-fade-in">
            <div className="relative">
              <PlayingCard card={trumpState.chosenCard || undefined} size="xs" isPlayable={false} />
              <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[8px] font-black px-1 rounded-full shadow-xs">
                OPEN
              </div>
            </div>
            <div className="flex items-center gap-0.5 mt-0.5 font-bold text-[10px]">
              <span
                className={
                  trumpState.suit === 'HEARTS' || trumpState.suit === 'DIAMONDS'
                    ? 'text-rose-400'
                    : 'text-amber-300'
                }
              >
                {trumpState.suit && SUIT_SYMBOLS[trumpState.suit]} {trumpState.suit}
              </span>
            </div>
          </div>
        ) : (
          // Hidden Trump Card
          <div className="flex flex-col items-center">
            <div
              className="relative cursor-pointer"
              onClick={() => {
                if (isHumanBidder) {
                  setIsPeeking(!isPeeking);
                }
              }}
            >
              {isPeeking && trumpState.chosenCard ? (
                <PlayingCard card={trumpState.chosenCard} size="xs" isPlayable={false} />
              ) : (
                <PlayingCard faceDown size="xs" isPlayable={false} />
              )}

              {/* Lock Badge */}
              <div className="absolute top-0.5 left-0.5 bg-slate-950/90 text-amber-400 text-[8px] p-0.5 rounded-full border border-amber-400/40">
                🔒
              </div>
            </div>

            <div className="flex flex-col items-center mt-0.5">
              <span className="text-[9px] text-slate-300 font-semibold">Hidden</span>
              {isHumanBidder && (
                <button
                  onClick={() => setIsPeeking(!isPeeking)}
                  className="text-[8px] text-amber-400 hover:text-amber-300 underline"
                >
                  {isPeeking ? 'Hide' : 'Peek'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Button to ask for Trump when user cannot follow suit */}
      {canReveal && !trumpState.isRevealed && (
        <button
          onClick={onRevealTrump}
          className="mt-1 w-full py-0.5 px-1 rounded-md bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-[9px] shadow-sm animate-pulse active:scale-95 transition-transform"
        >
          Ask Trump 🂠
        </button>
      )}
    </div>
  );
};
