import React from 'react';
import { PlayerId, Suit, Team } from '../types/game';

interface ScoreBoardProps {
  teamACardPoints: number;
  teamBCardPoints: number;
  teamATricks: number;
  teamBTricks: number;
  contractBid: number;
  bidWinner: PlayerId | null;
  biddingTeam: Team | null;
  teamAGamePoints: number;
  teamBGamePoints: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  roomCode?: string | null;
  trumpSuit?: Suit | null;
  isTrumpRevealed?: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  teamACardPoints,
  teamBCardPoints,
  teamATricks,
  teamBTricks,
  contractBid,
  biddingTeam,
  teamAGamePoints,
  teamBGamePoints,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onOpenHelp,
  roomCode,
  trumpSuit,
  isTrumpRevealed,
}) => {
  const isRedTrump = trumpSuit === 'HEARTS' || trumpSuit === 'DIAMONDS';

  return (
    <header className="w-full bg-slate-950/90 border-b border-blue-900/40 px-2 sm:px-3 py-1 flex items-center justify-between text-xs select-none backdrop-blur-md z-30 shrink-0">
      {/* 1. LEFT SECTION: YOUR TEAM (Teal / Blue) */}
      <div className="flex items-center gap-1.5 min-w-[88px] sm:min-w-[110px]">
        <div className="flex flex-col items-start leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-xs bg-cyan-900/90 text-cyan-300 border border-cyan-500/40 font-sans">
              YOUR TEAM
            </span>
            <span className="text-[9px] font-mono-nums font-bold text-cyan-400 bg-cyan-950/80 px-1 rounded-xs border border-cyan-800/40">
              {teamAGamePoints >= 0 ? `+${teamAGamePoints}` : teamAGamePoints}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-slate-300 text-[10px] sm:text-[11px] font-mono-nums">
            <span className="font-semibold text-white">
              Pts: <strong className="text-cyan-300 font-bold">{teamACardPoints}</strong>
            </span>
            <span className="text-slate-500">·</span>
            <span>
              Tricks: <strong className="text-white font-bold">{teamATricks}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2. CENTER SECTION: TRUMP & ROUND (Reference App Style Blue Pill) */}
      <div className="flex flex-col items-center justify-center px-1">
        <div className="flex items-center gap-1.5">
          {/* Trump Status Indicator */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-950/90 border border-blue-500/40 text-[10px] font-bold shadow-xs">
            <span className="text-[9px] text-blue-300 uppercase tracking-wider">Trump:</span>
            {trumpSuit ? (
              isTrumpRevealed ? (
                <span className={`flex items-center gap-0.5 font-black ${isRedTrump ? 'text-rose-400' : 'text-amber-300'}`}>
                  <span>{trumpSuit === 'HEARTS' ? '♥' : trumpSuit === 'DIAMONDS' ? '♦' : trumpSuit === 'SPADES' ? '♠' : '♣'}</span>
                  <span className="text-[9px]">{trumpSuit}</span>
                </span>
              ) : (
                <span className="text-amber-300 font-semibold flex items-center gap-0.5 text-[9px]">
                  <span>🔒</span>
                  <span>Concealed</span>
                </span>
              )
            ) : (
              <span className="text-slate-400 text-[9px]">Bidding...</span>
            )}
          </div>

          {/* Contract Target */}
          {contractBid > 0 && biddingTeam && (
            <div className="text-[9px] font-mono tabular-nums font-bold px-1.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-amber-300">
              Bid: {contractBid} ({biddingTeam === 'TEAM_A' ? 'You' : 'Opp'})
            </div>
          )}

          {roomCode && (
            <span
              title={`Room: ${roomCode}`}
              className="hidden xs:inline text-[8px] bg-blue-950 border border-blue-500/40 text-blue-300 font-mono font-bold px-1.5 py-0.5 rounded-full truncate max-w-[70px]"
            >
              #{roomCode.length > 8 ? roomCode.slice(0, 6) + '…' : roomCode}
            </span>
          )}
        </div>
      </div>

      {/* 3. RIGHT SECTION: OPPONENT (Red / Coral) & Mini Utilities */}
      <div className="flex items-center gap-2 min-w-[88px] sm:min-w-[110px] justify-end">
        <div className="flex flex-col items-end leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-mono-nums font-bold text-rose-400 bg-rose-950/80 px-1 rounded-xs border border-rose-800/40">
              {teamBGamePoints >= 0 ? `+${teamBGamePoints}` : teamBGamePoints}
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-xs bg-rose-900/90 text-rose-300 border border-rose-500/40 font-sans">
              OPPONENT
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-slate-300 text-[10px] sm:text-[11px] font-mono-nums">
            <span className="font-semibold text-white">
              Pts: <strong className="text-rose-300 font-bold">{teamBCardPoints}</strong>
            </span>
            <span className="text-slate-500">·</span>
            <span>
              Tricks: <strong className="text-white font-bold">{teamBTricks}</strong>
            </span>
          </div>
        </div>

        {/* Utilities: Sound, Help, Settings */}
        <div className="flex items-center gap-1 border-l border-slate-800 pl-1.5 shrink-0">
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            className="w-6 h-6 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] border border-slate-700 active:scale-95 cursor-pointer"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={onOpenSettings}
            title="Settings"
            className="w-6 h-6 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] border border-slate-700 active:scale-95 cursor-pointer"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
};
