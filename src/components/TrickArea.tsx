import React from 'react';
import { PlayerId, Suit, TrickCard, TrumpState } from '../types/game';
import { SUIT_SYMBOLS } from '../utils/deck';
import { PlayingCard } from './PlayingCard';

interface TrickAreaProps {
  currentTrickCards: TrickCard[];
  leadSuit: Suit | null;
  leadPlayerName?: string | null;
  trickNumber: number;
  trumpState: TrumpState;
  isResolvingTrick: boolean;
  winningPlayerId: PlayerId | null;
}

export const TrickArea: React.FC<TrickAreaProps> = ({
  currentTrickCards,
  leadSuit,
  leadPlayerName,
  trickNumber,
  trumpState,
  isResolvingTrick,
  winningPlayerId,
}) => {
  // Fixed 4-player positioning in the enlarged circular playing table
  const getPositionClass = (player: PlayerId) => {
    switch (player) {
      case 'NORTH': // Top: Player 2
        return 'top-1.5 sm:top-2.5 left-1/2 -translate-x-1/2 -rotate-1';
      case 'SOUTH': // Bottom: My Player
        return 'bottom-1.5 sm:bottom-2.5 left-1/2 -translate-x-1/2 rotate-1';
      case 'WEST': // Left: Player 3
        return 'left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2 -rotate-3';
      case 'EAST': // Right: Player 4
        return 'right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 rotate-3';
    }
  };

  const trickPoints = currentTrickCards.reduce((sum, tc) => sum + tc.card.points, 0);

  return (
    // Enlarged circular playing table (+16-18%), golden circular border, green felt background
    <div className="relative w-[12.2rem] h-[12.2rem] xs:w-[13.6rem] xs:h-[13.6rem] sm:w-[16.2rem] sm:h-[16.2rem] rounded-full felt-inner-ring flex items-center justify-center border-2 border-amber-500/35 bg-emerald-950/30 select-none shrink-0 shadow-inner">
      {/* Central Trick Info HUD (Center of the 4 cards) */}
      <div className="absolute flex flex-col items-center pointer-events-none z-0 px-2 text-center">
        <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-amber-300 font-sans">
          TRICK {trickNumber}/8
        </span>

        {leadPlayerName && (
          <span className="text-[9px] text-slate-300 font-mono truncate max-w-[95px]">
            Lead: {leadPlayerName}
          </span>
        )}

        {leadSuit && (
          <div className="flex items-center gap-1 text-[10px] text-slate-200 font-medium mt-0.5">
            <span
              className={`font-bold ${
                leadSuit === 'HEARTS' || leadSuit === 'DIAMONDS'
                  ? 'text-rose-400'
                  : 'text-slate-100'
              }`}
            >
              {SUIT_SYMBOLS[leadSuit]} {leadSuit}
            </span>
          </div>
        )}

        {trickPoints > 0 && (
          <span className="text-[9px] font-mono tabular-nums font-bold text-amber-300 bg-slate-900/90 px-1.5 py-0.2 rounded-full border border-amber-500/40 mt-0.5 shadow-xs">
            +{trickPoints} pts
          </span>
        )}
      </div>

      {/* Played Cards: 20-25% Larger Playing Cards around the Center Table */}
      {currentTrickCards.map((trickCard) => {
        const isWinningCard = isResolvingTrick && winningPlayerId === trickCard.player;
        const isTrumpPlay =
          trumpState.isRevealed &&
          trickCard.card.suit === trumpState.suit &&
          trickCard.playedAfterReveal;

        return (
          <div
            key={trickCard.card.id}
            className={`absolute z-10 transition-all duration-200 ease-out ${getPositionClass(
              trickCard.player
            )}`}
          >
            <div
              className={`animate-card-place ${
                isWinningCard
                  ? 'scale-105 drop-shadow-[0_0_14px_rgba(250,204,21,0.9)] ring-2 ring-yellow-400 rounded-md z-20'
                  : 'card-shadow-table'
              }`}
            >
              <PlayingCard
                card={trickCard.card}
                size="table"
                isPlayable={false}
                badge={
                  isTrumpPlay
                    ? 'TRUMP'
                    : trickCard.card.points > 0
                    ? `+${trickCard.card.points}`
                    : undefined
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
