import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { HandResult, MatchScore, Team } from '../types/game';
import { InterstitialAdModal } from './ads/InterstitialAdModal';
import { RewardedAdModal } from './ads/RewardedAdModal';

interface ResultScreenProps {
  handResult: HandResult;
  matchScore: MatchScore;
  isMatchComplete: boolean;
  matchWinner: Team | null;
  onNextHand: () => void;
  onRestartMatch: () => void;
  onMainMenu: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  handResult,
  matchScore,
  isMatchComplete,
  matchWinner,
  onNextHand,
  onRestartMatch,
  onMainMenu,
}) => {
  const [showRewardedAd, setShowRewardedAd] = useState<boolean>(false);
  const [showInterstitialAd, setShowInterstitialAd] = useState<boolean>(false);

  const isTeamAWinner = isMatchComplete
    ? matchWinner === 'TEAM_A'
    : (handResult.biddingTeam === 'TEAM_A' && handResult.isContractMet) ||
      (handResult.biddingTeam === 'TEAM_B' && !handResult.isContractMet);

  useEffect(() => {
    if (isTeamAWinner) {
      // Fire celebration confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      // Show Google AdMob Interstitial Test Ad (ca-app-pub-3940256099942544/1033173712) after win
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        const timer = setTimeout(() => {
          setShowInterstitialAd(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [isTeamAWinner]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 border-2 border-amber-400 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
        {/* Victory / Defeat Header */}
        <div className="mb-4">
          <span className="text-4xl mb-2 block">
            {isMatchComplete ? (isTeamAWinner ? '🏆' : '💀') : isTeamAWinner ? '🎉' : '🛡️'}
          </span>
          <h2 className="text-2xl font-cinzel font-bold text-white tracking-wide">
            {isMatchComplete
              ? isTeamAWinner
                ? 'MATCH VICTORY!'
                : 'MATCH DEFEAT'
              : handResult.isContractMet
              ? `${handResult.biddingTeam === 'TEAM_A' ? 'Team A' : 'Team B'} Won Contract!`
              : `${handResult.biddingTeam === 'TEAM_A' ? 'Team A' : 'Team B'} Failed Contract!`}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Contract: Bid <strong className="text-amber-300">{handResult.contractBid}</strong> by{' '}
            {handResult.bidWinner}
          </p>
        </div>

        {/* Score comparison card */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 mb-5 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Team</span>
            <span>Card Pts</span>
            <span>Tricks</span>
          </div>

          {/* Team A row */}
          <div className="flex items-center justify-between py-2 border-b border-slate-800/60 text-sm">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Team A (You)
            </span>
            <span className="font-mono-nums font-bold text-white text-base">
              {handResult.teamAPoints} / 28
            </span>
            <span className="font-mono-nums text-slate-300">
              {handResult.teamATricks}
            </span>
          </div>

          {/* Team B row */}
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="font-bold text-indigo-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              Team B
            </span>
            <span className="font-mono-nums font-bold text-white text-base">
              {handResult.teamBPoints} / 28
            </span>
            <span className="font-mono-nums text-slate-300">
              {handResult.teamBTricks}
            </span>
          </div>

          {/* Match Score Impact */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Match Game Points:</span>
            <span
              className={`font-bold font-mono-nums text-sm ${
                handResult.gamePointsDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              Team A: {matchScore.teamAGamePoints >= 0 ? `+${matchScore.teamAGamePoints}` : matchScore.teamAGamePoints} · Team B: {matchScore.teamBGamePoints >= 0 ? `+${matchScore.teamBGamePoints}` : matchScore.teamBGamePoints}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* Rewarded Ad Bonus Button */}
          <button
            onClick={() => setShowRewardedAd(true)}
            className="w-full py-2.5 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 hover:from-amber-900 hover:to-slate-800 text-amber-300 font-bold rounded-xl text-xs border border-amber-500/50 shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>🎁 Watch Ad for +500 Bonus Coins</span>
            <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
              Free
            </span>
          </button>

          {!isMatchComplete ? (
            <button
              onClick={onNextHand}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-transform active:scale-95 cursor-pointer"
            >
              NEXT HAND 🂠
            </button>
          ) : (
            <button
              onClick={onRestartMatch}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-transform active:scale-95 cursor-pointer"
            >
              PLAY NEW MATCH 🔄
            </button>
          )}

          <button
            onClick={onMainMenu}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            MAIN MENU
          </button>
        </div>

        {/* Rewarded Ad Modal */}
        <RewardedAdModal
          isOpen={showRewardedAd}
          onClose={() => setShowRewardedAd(false)}
        />

        {/* Google AdMob Interstitial Test Ad (ca-app-pub-3940256099942544/1033173712) Triggered After Win */}
        <InterstitialAdModal
          isOpen={showInterstitialAd}
          onClose={() => setShowInterstitialAd(false)}
        />
      </div>
    </div>
  );
};
