import React from 'react';
import { admobService } from '../services/admobService';
import { AdMobBanner } from './ads/AdMobBanner';
import { PlayingCard } from './PlayingCard';

interface MainMenuProps {
  onStartGame: () => void;
  onQuickPlay: () => void;
  onOpenOnlineRoom: () => void;
  onOpenTutorial: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onWatchRewardedAd: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onQuickPlay,
  onOpenOnlineRoom,
  onOpenTutorial,
  onOpenSettings,
  onOpenAbout,
  onWatchRewardedAd,
  soundEnabled,
  onToggleSound,
}) => {
  const [coins, setCoins] = React.useState<number>(() => admobService.getCoins());

  React.useEffect(() => {
    return admobService.subscribeCoins((c) => setCoins(c));
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-3 sm:p-5 select-none overflow-hidden felt-table">
      {/* Top Utility Bar with Coins & Rewarded Ad */}
      <div className="w-full max-w-sm flex items-center justify-between z-20 gap-2">
        <button
          onClick={onToggleSound}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-950/70 border border-slate-700 text-xs font-semibold text-amber-200 backdrop-blur-xs transition-transform active:scale-95 cursor-pointer shrink-0"
        >
          <span>{soundEnabled ? '🔊' : '🔇'}</span>
          <span>Sound {soundEnabled ? 'ON' : 'OFF'}</span>
        </button>

        {/* Rewarded Ad Free Coins Pill */}
        <button
          onClick={onWatchRewardedAd}
          title="Watch Rewarded Video Ad (AdMob ca-app-pub-3940256099942544/5224354917) to earn +500 Coins"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-950/90 to-yellow-950/90 border border-amber-400/60 shadow-md text-amber-300 font-bold text-xs hover:border-amber-300 transition-all active:scale-95 cursor-pointer"
        >
          <span className="text-amber-400">🪙</span>
          <span className="font-mono-nums font-bold text-white text-[11px]">
            {coins.toLocaleString()}
          </span>
          <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tighter shadow-xs">
            +500 🎁
          </span>
        </button>

        <button
          onClick={onOpenSettings}
          title="Settings & Profile"
          className="w-8 h-8 rounded-full bg-slate-950/70 border border-slate-700 text-sm flex items-center justify-center text-slate-200 backdrop-blur-xs transition-transform active:scale-95 cursor-pointer shrink-0"
        >
          ⚙️
        </button>
      </div>

      {/* Hero Branding & Logo */}
      <div className="flex flex-col items-center z-20 text-center my-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-600/40 px-3 py-0.5 rounded-full mb-2">
          Indian Classic Card Game
        </span>

        <h1 className="text-3xl sm:text-4xl font-cinzel font-black tracking-wider text-white drop-shadow-md">
          28 CARD MASTER
        </h1>
        <p className="text-xs text-emerald-200 font-medium tracking-wide mt-1">
          Play with Indian Elder AI Bots or Online Friends
        </p>

        {/* Animated Playing Cards Fan with simple traditional cards */}
        <div className="relative w-44 h-32 mt-5 mb-3 flex items-center justify-center">
          {/* Left card: Nine of Clubs */}
          <div className="absolute transform -rotate-12 -translate-x-10 translate-y-1 hover:-translate-y-2 transition-transform duration-200">
            <PlayingCard
              card={{ id: 'c9', rank: '9', suit: 'CLUBS', points: 2, rankOrder: 7 }}
              size="sm"
              isPlayable={false}
            />
          </div>
          {/* Right card: Ace of Spades */}
          <div className="absolute transform rotate-12 translate-x-10 translate-y-1 hover:-translate-y-2 transition-transform duration-200">
            <PlayingCard
              card={{ id: 'sa', rank: 'A', suit: 'SPADES', points: 1, rankOrder: 6 }}
              size="sm"
              isPlayable={false}
            />
          </div>
          {/* Center Card: Jack of Hearts */}
          <div className="absolute z-10 transform -translate-y-1 hover:-translate-y-3 transition-transform duration-200 shadow-md">
            <PlayingCard
              card={{ id: 'hj', rank: 'J', suit: 'HEARTS', points: 3, rankOrder: 8 }}
              size="md"
              isPlayable={false}
            />
          </div>
        </div>

        {/* Game info tag */}
        <div className="text-[11px] text-amber-200/90 flex items-center gap-2 mt-1">
          <span>4 Players</span>
          <span>·</span>
          <span>2 Teams</span>
          <span>·</span>
          <span>32 Cards</span>
        </div>
      </div>

      {/* Menu Action Buttons */}
      <div className="w-full max-w-xs flex flex-col gap-2.5 z-20 mb-3">
        {/* Main Game Button: ONLY "PLAY" */}
        <button
          onClick={onStartGame}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-base uppercase tracking-widest shadow-xl border border-yellow-200 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
        >
          PLAY
        </button>

        {/* Online Multiplayer Mode */}
        <button
          onClick={onOpenOnlineRoom}
          className="w-full py-2.5 px-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-bold text-xs tracking-wide border border-amber-500/40 shadow-sm backdrop-blur-xs transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>🌐 ONLINE MULTIPLAYER</span>
        </button>

        {/* Quick Play */}
        <button
          onClick={onQuickPlay}
          className="w-full py-2.5 px-5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>⚡ QUICK PLAY (16 BID)</span>
        </button>

        {/* How to Play & About buttons side by side */}
        <div className="grid grid-cols-2 gap-2 mt-0.5">
          <button
            onClick={onOpenTutorial}
            className="py-2 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700 transition-all active:scale-95"
          >
            📖 HOW TO PLAY
          </button>
          <button
            onClick={onOpenAbout}
            className="py-2 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700 transition-all active:scale-95"
          >
            ℹ️ ABOUT
          </button>
        </div>
      </div>

      {/* Google AdMob Banner Test Unit (ca-app-pub-3940256099942544/6300978111) */}
      <div className="w-full max-w-xs z-20 my-1">
        <AdMobBanner />
      </div>

      {/* Bottom note */}
      <div className="text-[10px] text-emerald-400/60 font-mono tabular-nums z-20">
        28 Card Master · Instant One-Tap Play
      </div>
    </div>
  );
};
