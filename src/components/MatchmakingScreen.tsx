import React, { useEffect, useState } from 'react';
import { sound } from '../audio/soundEngine';
import { BOT_AVATARS, GameSettings, PlayerId } from '../types/game';
import { generateFourGuestNames } from '../utils/guestName';

interface MatchmakingScreenProps {
  settings: GameSettings;
  onMatchFound: (
    roomCode: string,
    seatAssignments: Record<PlayerId, { name: string; isAI: boolean; avatar: string }>
  ) => void;
  onCancel: () => void;
  onPlayOfflineFallback: () => void;
}

interface PlayerSlot {
  id: PlayerId;
  label: string;
  name: string;
  avatar: string;
  status: 'CONNECTED' | 'SEARCHING';
}

export const MatchmakingScreen: React.FC<MatchmakingScreenProps> = ({
  settings,
  onMatchFound,
  onCancel,
  onPlayOfflineFallback,
}) => {
  const [matchCount, setMatchCount] = useState<number>(1); // 1/4 (Host)
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [matchRoomCode] = useState<string>(() =>
    Math.floor(100000 + Math.random() * 900000).toString()
  );

  // Pre-generate 4 guest identities for the match
  const [roomGuests] = useState(() => {
    const fresh = generateFourGuestNames();
    const myName = settings.playerName && /^Guest\d{7}$/.test(settings.playerName)
      ? settings.playerName
      : fresh.SOUTH;
    return {
      SOUTH: myName,
      EAST: fresh.EAST,
      NORTH: fresh.NORTH,
      WEST: fresh.WEST,
    };
  });

  const slots: PlayerSlot[] = [
    {
      id: 'SOUTH',
      label: 'You (Host)',
      name: roomGuests.SOUTH,
      avatar: settings.playerAvatar || '/src/assets/images/player_avatar_arjun_1793887790731.jpg',
      status: 'CONNECTED',
    },
    {
      id: 'EAST',
      label: 'Opponent 2',
      name: roomGuests.EAST,
      avatar: BOT_AVATARS.OPPONENT_2,
      status: matchCount >= 2 ? 'CONNECTED' : 'SEARCHING',
    },
    {
      id: 'NORTH',
      label: 'Partner',
      name: roomGuests.NORTH,
      avatar: BOT_AVATARS.PARTNER,
      status: matchCount >= 3 ? 'CONNECTED' : 'SEARCHING',
    },
    {
      id: 'WEST',
      label: 'Opponent 1',
      name: roomGuests.WEST,
      avatar: BOT_AVATARS.OPPONENT_1,
      status: matchCount >= 4 ? 'CONNECTED' : 'SEARCHING',
    },
  ];

  // Matchmaking simulation stepping through 1/4 -> 2/4 -> 3/4 -> 4/4
  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    let timer3: NodeJS.Timeout;
    let timerLaunch: NodeJS.Timeout;

    // Reset error on start
    setIsError(false);
    setErrorMessage('');

    // Seat 2 joins
    timer1 = setTimeout(() => {
      sound.playButtonPress();
      setMatchCount(2);
    }, 1100);

    // Seat 3 joins
    timer2 = setTimeout(() => {
      sound.playButtonPress();
      setMatchCount(3);
    }, 2200);

    // Seat 4 joins
    timer3 = setTimeout(() => {
      sound.playButtonPress();
      setMatchCount(4);
    }, 3200);

    // 4/4 Ready -> Launch Match
    timerLaunch = setTimeout(() => {
      sound.playCardShuffle();
      const seatAssignments: Record<PlayerId, { name: string; isAI: boolean; avatar: string }> = {
        SOUTH: {
          name: roomGuests.SOUTH,
          isAI: false,
          avatar: settings.playerAvatar || '/src/assets/images/player_avatar_arjun_1793887790731.jpg',
        },
        EAST: {
          name: roomGuests.EAST,
          isAI: true,
          avatar: BOT_AVATARS.OPPONENT_2,
        },
        NORTH: {
          name: roomGuests.NORTH,
          isAI: true,
          avatar: BOT_AVATARS.PARTNER,
        },
        WEST: {
          name: roomGuests.WEST,
          isAI: true,
          avatar: BOT_AVATARS.OPPONENT_1,
        },
      };

      onMatchFound(matchRoomCode, seatAssignments);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerLaunch);
    };
  }, [matchRoomCode, onMatchFound, roomGuests, settings.playerAvatar]);

  const handleRetry = () => {
    setIsError(false);
    setMatchCount(1);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-hidden felt-table text-slate-100">
      {/* Header */}
      <div className="w-full max-w-sm flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
            Online Matchmaking
          </span>
        </div>
        <span className="text-[10px] font-mono bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-700 text-slate-300">
          Match #{matchRoomCode}
        </span>
      </div>

      {/* Center Radar / Player Status */}
      <div className="flex flex-col items-center z-20 my-auto text-center w-full max-w-sm">
        {/* Radar Pulse Icon */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-amber-400/30 animate-ping" />
          <div className="absolute inset-3 rounded-full border border-amber-400/50 animate-pulse" />
          <div className="w-20 h-20 rounded-full bg-emerald-950/90 border-2 border-amber-400 flex flex-col items-center justify-center shadow-xl">
            <span className="text-2xl font-black font-mono text-amber-300">
              {matchCount}/4
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-200">
              Players
            </span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-cinzel font-black tracking-wide text-white mb-1 drop-shadow-md">
          {matchCount === 4 ? 'All 4 Players Ready!' : 'Searching for Players...'}
        </h2>
        <p className="text-xs text-amber-200/80 mb-5">
          {matchCount === 4
            ? 'Dealing cards & preparing bidding table...'
            : 'Connecting you with 3 players in the 28 game lobby'}
        </p>

        {/* 4 Player Slots */}
        <div className="w-full grid grid-cols-2 gap-2 mb-4">
          {slots.map((slot) => {
            const isConnected = slot.status === 'CONNECTED';
            return (
              <div
                key={slot.id}
                className={`p-2 rounded-2xl border transition-all flex items-center gap-2.5 ${
                  isConnected
                    ? 'bg-slate-900/90 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-600 shrink-0">
                  <img
                    src={slot.avatar}
                    alt={slot.name}
                    className="w-full h-full object-cover"
                  />
                  {isConnected && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
                  )}
                </div>
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-xs font-bold text-white font-mono truncate">
                    {slot.name}
                  </span>
                  <span className="text-[9px] text-slate-400 font-sans">
                    {isConnected ? slot.label : 'Searching...'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Notification if backend disconnects */}
        {isError && (
          <div className="w-full p-3 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs mb-3 text-center">
            <p className="font-bold mb-1">⚠️ Connection Error</p>
            <p className="text-[11px] text-rose-300">{errorMessage || 'Unable to connect to matchmaking server.'}</p>
            <button
              onClick={handleRetry}
              className="mt-2 px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase"
            >
              Retry Connection 🔄
            </button>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="w-full max-w-xs flex flex-col gap-2 z-20">
        <button
          onClick={onPlayOfflineFallback}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 font-bold text-xs border border-amber-500/40 transition-transform active:scale-95"
        >
          ⚡ PLAY OFFLINE WITH AI BOTS
        </button>

        <button
          onClick={onCancel}
          className="w-full py-2 rounded-xl bg-slate-950/60 hover:bg-slate-900 text-slate-400 font-semibold text-xs border border-slate-800 transition-colors"
        >
          Cancel & Return Home
        </button>
      </div>
    </div>
  );
};
