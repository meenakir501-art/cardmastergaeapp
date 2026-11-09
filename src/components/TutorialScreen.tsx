import React, { useState } from 'react';
import { PlayingCard } from './PlayingCard';

interface TutorialScreenProps {
  onClose: () => void;
}

export const TutorialScreen: React.FC<TutorialScreenProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'CARDS' | 'POINTS' | 'BIDDING' | 'TRUMP' | 'RULES'>('CARDS');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <h2 className="font-cinzel font-bold text-lg text-white">How to Play 28</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 p-2 bg-slate-950/40 border-b border-slate-800 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('CARDS')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'CARDS'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Deck & Ranks
          </button>
          <button
            onClick={() => setActiveTab('POINTS')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'POINTS'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Card Points
          </button>
          <button
            onClick={() => setActiveTab('BIDDING')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'BIDDING'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bidding
          </button>
          <button
            onClick={() => setActiveTab('TRUMP')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'TRUMP'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hidden Trump
          </button>
          <button
            onClick={() => setActiveTab('RULES')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'RULES'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Play & Tricks
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto text-slate-200 text-xs sm:text-sm space-y-4 leading-relaxed">
          {activeTab === 'CARDS' && (
            <div>
              <h3 className="font-bold text-amber-300 text-sm mb-2">The 32-Card Deck & Ranking</h3>
              <p className="text-slate-300 mb-3">
                The game is played with 32 cards from a standard deck (8 cards in each of the 4 suits: Spades ♠, Hearts ♥, Diamonds ♦, Clubs ♣).
              </p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-3">
                <span className="text-xs uppercase font-extrabold text-amber-400 block mb-1">
                  Card Ranking (Highest to Lowest):
                </span>
                <div className="font-mono-nums text-sm font-bold text-amber-200 tracking-wide">
                  J &gt; 9 &gt; A &gt; 10 &gt; K &gt; Q &gt; 8 &gt; 7
                </div>
              </div>

              <p className="text-slate-400 text-xs">
                Jack is the highest and most powerful card in each suit, followed immediately by the Nine!
              </p>
            </div>
          )}

          {activeTab === 'POINTS' && (
            <div>
              <h3 className="font-bold text-amber-300 text-sm mb-2">The 28 Points System</h3>
              <p className="text-slate-300 mb-3">
                Only Jacks, 9s, Aces, and 10s score points. Kings, Queens, 8s, and 7s have 0 points.
              </p>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-white">Jack (J)</span>
                  <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-md font-mono-nums">
                    3 Points
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-white">Nine (9)</span>
                  <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-md font-mono-nums">
                    2 Points
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-white">Ace (A)</span>
                  <span className="bg-amber-300 text-slate-950 font-bold text-xs px-2 py-0.5 rounded-md font-mono-nums">
                    1 Point
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-white">Ten (10)</span>
                  <span className="bg-amber-300 text-slate-950 font-bold text-xs px-2 py-0.5 rounded-md font-mono-nums">
                    1 Point
                  </span>
                </div>
              </div>

              <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/30 text-emerald-200 text-xs">
                <strong>Total Deck Points:</strong> 4 suits × 7 points per suit = <strong>exactly 28 points</strong>!
              </div>
            </div>
          )}

          {activeTab === 'BIDDING' && (
            <div>
              <h3 className="font-bold text-amber-300 text-sm mb-2">Bidding Rules (14 to 28)</h3>
              <p className="text-slate-300 mb-2">
                4 cards are dealt to each player first. Players bid on how many points their team can win out of 28.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-xs">
                <li>Minimum bid is <strong>14</strong>; Maximum bid is <strong>28</strong>.</li>
                <li>Bidding moves <strong>counter-clockwise</strong>.</li>
                <li>Each bid must exceed the previous highest bid.</li>
                <li>Three consecutive passes conclude the auction.</li>
                <li>The highest bidder chooses a <strong>hidden trump card</strong>.</li>
                <li>Remaining 4 cards are then dealt to every player.</li>
              </ul>
            </div>
          )}

          {activeTab === 'TRUMP' && (
            <div>
              <h3 className="font-bold text-amber-300 text-sm mb-2">The Hidden Trump Mechanic</h3>
              <p className="text-slate-300 mb-2">
                The winning bidder places their selected trump card <strong>face-down</strong> on the table.
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300 mb-2">
                <p>
                  1. The trump suit remains <strong>secret</strong> until exposed!
                </p>
                <p>
                  2. Cards of that suit do <strong>not</strong> act as trumps before exposure.
                </p>
                <p>
                  3. If a player <strong>cannot follow the led suit</strong>, they can tap <strong>"Ask Trump"</strong> to reveal the trump card!
                </p>
                <p>
                  4. The player who revealed trump <strong>must play a trump card</strong> if they hold one.
                </p>
                <p>
                  5. Once exposed, the reserved card is added to the bidder's hand, and trump becomes active for all subsequent tricks!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'RULES' && (
            <div>
              <h3 className="font-bold text-amber-300 text-sm mb-2">Trick Play & Winning</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-300 text-xs">
                <li>
                  <strong>Must Follow Suit:</strong> You must always play a card of the led suit if you have one.
                </li>
                <li>
                  <strong>Winning the Trick:</strong> If trump has been revealed and played, the highest trump wins. Otherwise, the highest card of the led suit wins.
                </li>
                <li>
                  <strong>Contract Victory:</strong> If the bidding team collects points equal to or greater than their bid, they win the hand!
                </li>
                <li>
                  <strong>Match Target:</strong> The first team to reach <strong>+6 Game Points</strong> wins the entire match!
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-transform active:scale-95"
          >
            Got It, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
