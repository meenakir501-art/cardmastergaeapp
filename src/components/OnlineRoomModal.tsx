import React, { useState } from 'react';
import { BOT_AVATARS, GameSettings, PlayerId } from '../types/game';
import { generateFourGuestNames, generateGuestName } from '../utils/guestName';

interface OnlineRoomModalProps {
  onClose: () => void;
  onStartRoomGame: (roomCode: string, seatAssignments: Record<PlayerId, { name: string; isAI: boolean; avatar: string }>) => void;
  settings: GameSettings;
}

export const OnlineRoomModal: React.FC<OnlineRoomModalProps> = ({
  onClose,
  onStartRoomGame,
  settings,
}) => {
  const [mode, setMode] = useState<'CHOICE' | 'CREATE' | 'JOIN'>('CHOICE');
  const [roomCode, setRoomCode] = useState<string>(() =>
    Math.floor(100000 + Math.random() * 900000).toString()
  );
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Seat config for the room with unique Guest names
  const [seats, setSeats] = useState<Record<PlayerId, { name: string; isAI: boolean; avatar: string }>>(() => {
    const guestNames = generateFourGuestNames();
    const myName = settings.playerName && /^Guest\d{7}$/.test(settings.playerName)
      ? settings.playerName
      : guestNames.SOUTH;

    return {
      SOUTH: {
        name: myName,
        isAI: false,
        avatar: settings.playerAvatar || '/src/assets/images/player_avatar_arjun_1793887790731.jpg',
      },
      NORTH: {
        name: guestNames.NORTH,
        isAI: true,
        avatar: BOT_AVATARS.PARTNER,
      },
      WEST: {
        name: guestNames.WEST,
        isAI: true,
        avatar: BOT_AVATARS.OPPONENT_1,
      },
      EAST: {
        name: guestNames.EAST,
        isAI: true,
        avatar: BOT_AVATARS.OPPONENT_2,
      },
    };
  });

  const toggleSeatType = (pid: PlayerId) => {
    if (pid === 'SOUTH') return; // South is local host
    setSeats((prev) => {
      const current = prev[pid];
      const isAI = !current.isAI;
      // Get all currently used names to prevent collisions
      const usedNames = Object.values(prev).map((s) => s.name);
      const newGuestName = generateGuestName(usedNames);

      return {
        ...prev,
        [pid]: {
          ...current,
          isAI,
          name: newGuestName,
        },
      };
    });
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(`https://28cardmaster.app/room/${roomCode}`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      setCopySuccess(true);
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCodeInput.trim().length >= 4) {
      onStartRoomGame(joinCodeInput.trim().toUpperCase(), seats);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-sm w-full p-5 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌐</span>
            <h2 className="font-cinzel font-bold text-lg text-white">Play with Friends</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Mode Selector */}
        {mode === 'CHOICE' && (
          <div className="space-y-3 my-2">
            <p className="text-xs text-slate-300 text-center mb-4">
              Play 28 Card Master in private rooms with friends or fill open seats with our friendly Indian AI elders.
            </p>

            <button
              onClick={() => setMode('CREATE')}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-bold text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>CREATE PRIVATE ROOM</span>
              <span>➕</span>
            </button>

            <button
              onClick={() => setMode('JOIN')}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>JOIN WITH ROOM CODE</span>
              <span>🔑</span>
            </button>
          </div>
        )}

        {/* Create Room Lobby */}
        {mode === 'CREATE' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  Room Code
                </span>
                <span className="text-xl font-mono tabular-nums font-black text-amber-300 tracking-wider">
                  {roomCode}
                </span>
              </div>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
              >
                {copySuccess ? 'Copied! ✓' : 'Copy Code'}
              </button>
            </div>

            {/* Seat Roster */}
            <div>
              <span className="text-xs font-bold text-slate-300 block mb-2">
                Room Table Seats (4 Players):
              </span>
              <div className="space-y-2">
                {(['SOUTH', 'NORTH', 'WEST', 'EAST'] as PlayerId[]).map((pid) => {
                  const seat = seats[pid];
                  const label =
                    pid === 'SOUTH'
                      ? 'You (Host)'
                      : pid === 'NORTH'
                      ? 'Partner'
                      : pid === 'WEST'
                      ? 'Opponent 1'
                      : 'Opponent 2';

                  return (
                    <div
                      key={pid}
                      className="flex items-center justify-between bg-slate-950/70 px-3 py-2 rounded-xl border border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-700 shrink-0">
                          <img
                            src={seat.avatar}
                            alt={seat.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-200">{seat.name}</div>
                          <div className="text-[10px] text-slate-400">{label}</div>
                        </div>
                      </div>

                      {pid !== 'SOUTH' && (
                        <button
                          onClick={() => toggleSeatType(pid)}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${
                            seat.isAI
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                              : 'bg-blue-950 text-blue-300 border border-blue-500/40'
                          }`}
                        >
                          {seat.isAI ? 'Elder Bot' : 'Friend Seat'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setMode('CHOICE')}
                className="w-1/3 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={() => onStartRoomGame(roomCode, seats)}
                className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-transform active:scale-95"
              >
                START MATCH ▶
              </button>
            </div>
          </div>
        )}

        {/* Join Room */}
        {mode === 'JOIN' && (
          <form onSubmit={handleJoinSubmit} className="space-y-4 my-2">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Enter Room Code / Room ID:
              </label>
              <input
                type="text"
                maxLength={40}
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                placeholder="e.g. 583921 or Room ID"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-center text-sm sm:text-base font-mono tabular-nums font-bold text-amber-300 focus:outline-none focus:border-amber-400 tracking-wider"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMode('CHOICE')}
                className="w-1/3 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={joinCodeInput.trim().length < 4}
                className={`w-2/3 py-2.5 rounded-xl font-bold text-xs uppercase transition-transform active:scale-95 ${
                  joinCodeInput.trim().length >= 4
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                JOIN ROOM
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
