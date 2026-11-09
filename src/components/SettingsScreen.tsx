import React, { useState } from 'react';
import { AIDifficulty, GameSettings, HUMAN_AVATAR_OPTIONS } from '../types/game';
import { ADMOB_CONFIG } from '../services/admobService';
import { InterstitialAdModal } from './ads/InterstitialAdModal';
import { RewardedAdModal } from './ads/RewardedAdModal';

interface SettingsScreenProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
  onRestartMatch: () => void;
  onMainMenu: () => void;
  isInGame: boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onRestartMatch,
  onMainMenu,
  isInGame,
}) => {
  const [showRewardedTest, setShowRewardedTest] = useState<boolean>(false);
  const [showInterstitialTest, setShowInterstitialTest] = useState<boolean>(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-sm w-full p-5 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="font-cinzel font-bold text-lg text-white">Settings & Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          {/* Your Profile Customization */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-3">
            <label className="text-amber-300 font-bold block uppercase tracking-wider text-[11px]">
              Your Player Profile
            </label>

            {/* Guest ID Display */}
            <div>
              <span className="text-slate-400 text-xs block mb-1">Session Guest ID:</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-mono tabular-nums font-bold text-xs select-all">
                  {settings.playerName || 'Guest1000000'}
                </div>
                {!isInGame && (
                  <button
                    type="button"
                    onClick={() => {
                      const newGuest = `Guest${Math.floor(1000000 + Math.random() * 9000000)}`;
                      onUpdateSettings({ playerName: newGuest });
                    }}
                    className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold whitespace-nowrap active:scale-95 transition-transform"
                    title="Generate new Guest ID"
                  >
                    New ID 🔄
                  </button>
                )}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Format: Guest + 7 random digits (automatically generated per session)
              </span>
            </div>

            {/* Avatar Selector */}
            <div>
              <span className="text-slate-400 text-xs block mb-1.5">Choose Avatar:</span>
              <div className="grid grid-cols-3 gap-2">
                {HUMAN_AVATAR_OPTIONS.map((opt) => {
                  const isSelected = settings.playerAvatar === opt.url;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onUpdateSettings({ playerAvatar: opt.url })}
                      className={`flex flex-col items-center p-1.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/20 ring-2 ring-amber-400/50'
                          : 'border-slate-800 bg-slate-900 hover:border-slate-600'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden mb-1">
                        <img
                          src={opt.url}
                          alt={opt.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-300">{opt.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Difficulty */}
          <div>
            <label className="text-slate-300 font-bold block mb-1.5">AI Opponents Difficulty</label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['EASY', 'MEDIUM', 'HARD'] as AIDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => onUpdateSettings({ difficulty: diff })}
                  className={`py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    settings.difficulty === diff
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Vibration Toggles */}
          <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-medium">Sound Effects</span>
              <button
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  settings.soundEnabled ? 'bg-amber-400' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                    settings.soundEnabled ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-slate-200 font-medium">Hindi Voice (बोली बोलना)</span>
              <button
                onClick={() => onUpdateSettings({ voiceEnabled: settings.voiceEnabled === false ? true : false })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  settings.voiceEnabled !== false ? 'bg-amber-400' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                    settings.voiceEnabled !== false ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-slate-200 font-medium">Haptic Vibration</span>
              <button
                onClick={() => onUpdateSettings({ vibrationEnabled: !settings.vibrationEnabled })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  settings.vibrationEnabled ? 'bg-amber-400' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                    settings.vibrationEnabled ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Animation Speed */}
          <div>
            <label className="text-slate-300 font-bold block mb-1.5">Card Animation Speed</label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['FAST', 'NORMAL', 'SLOW'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => onUpdateSettings({ animationSpeed: spd })}
                  className={`py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    settings.animationSpeed === spd
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>

          {/* Card Back Style */}
          <div>
            <label className="text-slate-300 font-bold block mb-1.5">Traditional Card Back Color</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {[
                { id: 'BLUE', label: 'Classic Blue' },
                { id: 'RED', label: 'Classic Red' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() =>
                    onUpdateSettings({ cardBack: style.id as GameSettings['cardBack'] })
                  }
                  className={`py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    settings.cardBack === style.id
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Google AdMob Configuration & Test Section */}
          <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/30 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>🛡️</span> Google AdMob Test Ads
              </span>
              <span className="text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded font-mono">
                Active
              </span>
            </div>

            <div className="text-[10px] space-y-1 font-mono text-slate-400 bg-black/40 p-2 rounded-lg border border-slate-800">
              <div className="truncate">
                <span className="text-slate-500">Banner:</span> {ADMOB_CONFIG.BANNER_TEST_ID}
              </div>
              <div className="truncate">
                <span className="text-slate-500">Rewarded:</span> {ADMOB_CONFIG.REWARDED_TEST_ID}
              </div>
              <div className="truncate">
                <span className="text-slate-500">Interstitial:</span> {ADMOB_CONFIG.INTERSTITIAL_TEST_ID}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => setShowRewardedTest(true)}
                className="py-2 bg-gradient-to-r from-amber-900 to-yellow-900 hover:from-amber-800 hover:to-yellow-800 text-amber-200 border border-amber-500/50 rounded-lg text-[11px] font-bold transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>🎁 Rewarded (+500)</span>
              </button>

              <button
                onClick={() => setShowInterstitialTest(true)}
                className="py-2 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-750 hover:to-slate-650 text-amber-300 border border-amber-500/40 rounded-lg text-[11px] font-bold transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>🏆 Interstitial (Win)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Rewarded Ad Modal Test in Settings */}
        <RewardedAdModal
          isOpen={showRewardedTest}
          onClose={() => setShowRewardedTest(false)}
        />

        {/* Interstitial Ad Modal Test in Settings */}
        <InterstitialAdModal
          isOpen={showInterstitialTest}
          onClose={() => setShowInterstitialTest(false)}
        />

        {/* Buttons */}
        <div className="mt-5 space-y-2">
          {isInGame && (
            <button
              onClick={() => {
                onRestartMatch();
                onClose();
              }}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Restart Current Match
            </button>
          )}

          {isInGame && (
            <button
              onClick={() => {
                onMainMenu();
                onClose();
              }}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Exit to Main Menu
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black rounded-xl text-xs tracking-wider uppercase transition-transform active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
