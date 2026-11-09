import React, { useState } from 'react';
import { Player } from '../types/game';
import { PlayingCard } from './PlayingCard';

interface PlayerSeatProps {
  player: Player;
  isTurn: boolean;
  isDealer: boolean;
  isBidWinner: boolean;
  bidAmount?: number;
  callOrPassStatus?: string | null; // e.g. 'CALL 16', 'PASS', etc.
  speechText?: string | null;
  position: 'TOP' | 'LEFT' | 'RIGHT' | 'BOTTOM';
  cardCount: number;
}

export const PlayerSeat: React.FC<PlayerSeatProps> = ({
  player,
  isTurn,
  isDealer,
  isBidWinner,
  bidAmount,
  callOrPassStatus,
  speechText,
  position,
  cardCount,
}) => {
  const [imgError, setImgError] = useState(false);
  const isTeamA = player.team === 'TEAM_A';
  const isHorizontal = position === 'LEFT' || position === 'RIGHT';

  const positionLabel = {
    TOP: 'Player 2',
    LEFT: 'Player 3',
    RIGHT: 'Player 4',
    BOTTOM: 'My Player',
  }[position];

  const isImageAvatar =
    !imgError &&
    player.avatar &&
    (player.avatar.startsWith('/') ||
      player.avatar.startsWith('http') ||
      player.avatar.startsWith('data:'));

  return (
    <div
      className={`relative flex ${
        isHorizontal ? 'flex-col items-center w-[70px] sm:w-[78px]' : 'flex-row items-center gap-2'
      } select-none`}
    >
      {/* Speech / Announcement Bubble (Temporary announcements only) */}
      {speechText && (
        <div
          className={`absolute z-30 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md transition-all whitespace-nowrap bg-yellow-400 text-slate-950 border border-yellow-300 ${
            position === 'TOP'
              ? 'top-full mt-1 left-1/2 -translate-x-1/2'
              : position === 'BOTTOM'
              ? '-top-7 left-1/2 -translate-x-1/2'
              : '-top-6 left-1/2 -translate-x-1/2'
          }`}
        >
          {speechText}
        </div>
      )}

      {/* Avatar & Remaining Mini Cards Block */}
      <div className="relative flex flex-col items-center">
        {/* Turn Glow Halo */}
        {isTurn && (
          <div className="absolute -inset-1 rounded-full bg-yellow-400/90 animate-pulse blur-xs" />
        )}

        {/* Circular Avatar */}
        <div
          className={`relative w-10 h-10 xs:w-11 xs:h-11 rounded-full flex items-center justify-center overflow-hidden shadow-md border-2 transition-all shrink-0 ${
            isTurn
              ? 'border-amber-300 ring-2 ring-amber-400/90 ring-offset-1 ring-offset-emerald-950 scale-105'
              : 'border-slate-700 bg-slate-900'
          }`}
        >
          {isImageAvatar ? (
            <img
              src={player.avatar}
              alt={player.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center font-bold text-xs text-white ${
                isTeamA ? 'bg-emerald-800' : 'bg-slate-800'
              }`}
            >
              {player.avatar || player.name.slice(0, 5)}
            </div>
          )}

          {/* Turn Badge on Avatar */}
          {isTurn && (
            <div className="absolute bottom-0 inset-x-0 bg-amber-400 text-slate-950 font-black text-[7px] text-center uppercase tracking-tighter py-0.2">
              TURN
            </div>
          )}

          {/* Dealer Chip */}
          {isDealer && (
            <div
              title="Dealer"
              className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-600 text-white font-black text-[8px] flex items-center justify-center border border-white shadow-xs z-10"
            >
              D
            </div>
          )}

          {/* Bid Winner Crown */}
          {isBidWinner && (
            <div
              title={`Bid Winner: ${bidAmount}`}
              className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs z-10"
            >
              👑
            </div>
          )}
        </div>

        {/* Realistic Mini Card Fan for Opponents/Partner */}
        {position !== 'BOTTOM' && cardCount > 0 && (
          <div className="flex items-center mt-1 pointer-events-none select-none">
            <div className="relative flex items-center justify-center h-7 w-10">
              {/* Left card */}
              <div
                className="absolute left-0 -rotate-12 -translate-y-0.5"
                style={{ transformOrigin: 'bottom center' }}
              >
                <PlayingCard faceDown size="xs" isPlayable={false} cardBackTheme={isTeamA ? 'BLUE' : 'RED'} />
              </div>
              {/* Center card */}
              <div className="absolute left-2 z-10">
                <PlayingCard faceDown size="xs" isPlayable={false} cardBackTheme={isTeamA ? 'BLUE' : 'RED'} />
              </div>
              {/* Right card */}
              <div
                className="absolute left-4 rotate-12 -translate-y-0.5 z-20"
                style={{ transformOrigin: 'bottom center' }}
              >
                <PlayingCard faceDown size="xs" isPlayable={false} cardBackTheme={isTeamA ? 'BLUE' : 'RED'} />
              </div>
            </div>
            <div className="ml-1 bg-black/90 text-yellow-300 font-mono text-[9px] font-bold px-1 py-0.2 rounded-xs border border-slate-700 shadow-xs tabular-nums">
              {cardCount}
            </div>
          </div>
        )}
      </div>

      {/* Name, Position, & Status */}
      <div
        className={`flex flex-col ${
          isHorizontal ? 'items-center mt-0.5 w-full' : 'items-start'
        } leading-tight text-center`}
      >
        {/* Position Label: Player 2, Player 3, Player 4, My Player */}
        <span className="text-[9px] font-bold text-cyan-300 uppercase tracking-wider drop-shadow-xs truncate max-w-full font-sans">
          {positionLabel}
        </span>

        {/* Guest Name */}
        <span className="text-[10px] sm:text-xs font-semibold text-white drop-shadow-sm font-mono tabular-nums max-w-[72px] sm:max-w-[80px] truncate">
          {player.name}
        </span>

        {/* Team, Bid & Call/Pass Status Badge */}
        {isHorizontal ? (
          <div className="flex flex-col items-center gap-0.5 mt-0.5 w-full">
            <div className="flex items-center gap-1 justify-center">
              <span
                className={`text-[8px] font-bold uppercase tracking-wider px-1 py-0.2 rounded-xs ${
                  isTeamA
                    ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/40'
                    : 'bg-rose-950/90 text-rose-300 border border-rose-500/40'
                }`}
              >
                {isTeamA ? 'Team A' : 'Team B'}
              </span>
              {isBidWinner && bidAmount && (
                <span className="text-[9px] text-yellow-300 font-mono tabular-nums font-bold">
                  [{bidAmount}]
                </span>
              )}
            </div>
            {callOrPassStatus && (
              <span
                className={`text-[8px] font-bold font-mono px-1.5 py-0.2 rounded-xs shadow-xs ${
                  callOrPassStatus.includes('PASS')
                    ? 'bg-slate-800/90 text-slate-300 border border-slate-600/50'
                    : 'bg-blue-600 text-white border border-blue-400 font-black'
                }`}
              >
                {callOrPassStatus}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
            <span
              className={`text-[8px] font-bold uppercase tracking-wider px-1 py-0.2 rounded-xs ${
                isTeamA
                  ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/40'
                  : 'bg-rose-950/90 text-rose-300 border border-rose-500/40'
              }`}
            >
              {isTeamA ? 'Team A' : 'Team B'}
            </span>
            {isBidWinner && bidAmount && (
              <span className="text-[9px] text-yellow-300 font-mono tabular-nums font-bold">
                [{bidAmount}]
              </span>
            )}
            {callOrPassStatus && (
              <span
                className={`text-[8px] font-bold font-mono px-1.5 py-0.2 rounded-xs shadow-xs ${
                  callOrPassStatus.includes('PASS')
                    ? 'bg-slate-800/90 text-slate-300 border border-slate-600/50'
                    : 'bg-blue-600 text-white border border-blue-400 font-black'
                }`}
              >
                {callOrPassStatus}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
