import React, { useState } from 'react';
import { sound } from '../audio/soundEngine';
import { Player, PlayerId } from '../types/game';

interface BiddingPanelProps {
  currentBidder: PlayerId;
  currentHighestBid: number;
  highestBidder: PlayerId | null;
  players: Player[];
  isHumanTurn: boolean;
  onBid: (amount: number) => void;
  onPass: () => void;
}

export const BiddingPanel: React.FC<BiddingPanelProps> = ({
  currentBidder,
  currentHighestBid,
  highestBidder,
  players,
  isHumanTurn,
  onBid,
  onPass,
}) => {
  // Opening bid is strictly 16; subsequent bids must be > currentHighestBid
  const minValidBid = currentHighestBid === 0 ? 16 : currentHighestBid + 1;
  const isMaxBidReached = minValidBid > 28;

  const [selectedBid, setSelectedBid] = useState<number>(Math.min(28, minValidBid));

  // Sync selected bid if minValidBid increases
  React.useEffect(() => {
    if (selectedBid < minValidBid && minValidBid <= 28) {
      setSelectedBid(minValidBid);
    }
  }, [minValidBid, selectedBid]);

  const currentBidderName =
    players.find((p) => p.id === currentBidder)?.name || 'Unknown';
  const highestBidderName =
    players.find((p) => p.id === highestBidder)?.name || 'None';

  // Quick bid buttons between minValidBid and minValidBid + 3 (up to 28)
  const quickBidOptions: number[] = [];
  if (!isMaxBidReached) {
    for (let b = minValidBid; b <= Math.min(28, minValidBid + 3); b++) {
      quickBidOptions.push(b);
    }
  }

  const handleStep = (delta: number) => {
    sound.playButtonPress();
    setSelectedBid((prev) => {
      const next = prev + delta;
      if (next < minValidBid) return minValidBid;
      if (next > 28) return 28;
      return next;
    });
  };

  const handleSelectQuick = (amount: number) => {
    sound.playButtonPress();
    setSelectedBid(amount);
  };

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pointer-events-auto">
      <div className="bg-slate-900/95 border-2 border-amber-400/90 rounded-2xl p-4 shadow-2xl backdrop-blur-md max-w-sm w-full animate-slide-up text-center">
        {/* Header Status */}
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-3">
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Highest Bid (Range: 16-28)
            </span>
            <span className="text-sm font-bold text-amber-300 font-mono-nums">
              {currentHighestBid > 0 ? `${currentHighestBid} (${highestBidderName})` : 'No bids yet (Opening: 16)'}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Current Turn
            </span>
            <span className="text-sm font-bold text-emerald-400">
              {isHumanTurn ? 'Your Turn to Bid' : `${currentBidderName} thinking...`}
            </span>
          </div>
        </div>

        {isHumanTurn ? (
          <div>
            {isMaxBidReached ? (
              <div className="py-2 mb-3 bg-rose-950/70 border border-rose-500/40 rounded-xl px-3 text-xs text-rose-200 font-semibold">
                Maximum bid 28 reached! You can only PASS.
              </div>
            ) : (
              <>
                <div className="text-xs text-slate-300 mb-2">
                  Select your bid <span className="font-bold text-amber-300 font-mono-nums">(16 to 28)</span> or Pass:
                </div>

                {/* Stepper Controls: Increase/Decrease one number at a time */}
                <div className="flex items-center justify-center gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => handleStep(-1)}
                    disabled={selectedBid <= minValidBid}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-amber-300 font-black text-lg border border-slate-700 flex items-center justify-center transition-transform active:scale-95 disabled:active:scale-100"
                  >
                    –
                  </button>

                  <div className="flex flex-col items-center px-4 py-1.5 bg-slate-950 rounded-xl border border-amber-500/40 min-w-[100px]">
                    <span className="text-2xl font-black text-amber-400 font-mono-nums tabular-nums">
                      {selectedBid}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      Points Call
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStep(1)}
                    disabled={selectedBid >= 28}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-amber-300 font-black text-lg border border-slate-700 flex items-center justify-center transition-transform active:scale-95 disabled:active:scale-100"
                  >
                    +
                  </button>
                </div>

                {/* Quick Bid Selection Buttons */}
                <div className="flex items-center justify-center gap-1.5 mb-3 flex-wrap">
                  {quickBidOptions.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleSelectQuick(amount)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold font-mono-nums transition-all ${
                        selectedBid === amount
                          ? 'bg-amber-400 text-slate-950 scale-105 shadow-md shadow-amber-500/30'
                          : 'bg-slate-800 text-amber-200 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      {amount}
                    </button>
                  ))}

                  {minValidBid <= 24 && (
                    <button
                      onClick={() => handleSelectQuick(24)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold font-mono-nums transition-all ${
                        selectedBid === 24
                          ? 'bg-amber-400 text-slate-950 scale-105 shadow-md'
                          : 'bg-amber-950/60 text-amber-300 hover:bg-amber-900 border border-amber-600/50'
                      }`}
                    >
                      24!
                    </button>
                  )}

                  {minValidBid <= 28 && (
                    <button
                      onClick={() => handleSelectQuick(28)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold font-mono-nums transition-all ${
                        selectedBid === 28
                          ? 'bg-rose-500 text-white scale-105 shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      28 MAX
                    </button>
                  )}
                </div>

                {/* Precision Slider */}
                <div className="flex items-center gap-2 mb-3 px-2">
                  <span className="text-xs font-mono-nums text-slate-400">{minValidBid}</span>
                  <input
                    type="range"
                    min={minValidBid}
                    max={28}
                    value={selectedBid}
                    onChange={(e) => setSelectedBid(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <span className="text-xs font-mono-nums text-slate-400">28</span>
                </div>
              </>
            )}

            {/* Action Buttons: Pass & Bid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sound.playButtonPress();
                  onPass();
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-600 transition-transform active:scale-95"
              >
                PASS
              </button>
              <button
                disabled={isMaxBidReached || selectedBid < minValidBid || selectedBid > 28}
                onClick={() => {
                  sound.playButtonPress();
                  onBid(selectedBid);
                }}
                className={`py-2.5 px-4 rounded-xl font-black text-sm uppercase shadow-lg transition-transform ${
                  isMaxBidReached || selectedBid < minValidBid || selectedBid > 28
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 active:scale-95 shadow-amber-500/20'
                }`}
              >
                CALL {selectedBid}
              </button>
            </div>
          </div>
        ) : (
          <div className="py-4 flex items-center justify-center gap-2 text-sm text-slate-300 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Waiting for {currentBidderName} to make a call...</span>
          </div>
        )}
      </div>
    </div>
  );
};
