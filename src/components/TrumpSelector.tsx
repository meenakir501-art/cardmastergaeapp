import React, { useState } from 'react';
import { Card, Suit } from '../types/game';
import { SUIT_COLORS, SUIT_SYMBOLS } from '../utils/deck';
import { PlayingCard } from './PlayingCard';

interface TrumpSelectorProps {
  hand: Card[];
  contractBid: number;
  onSelectTrump: (suit: Suit, card: Card) => void;
}

export const TrumpSelector: React.FC<TrumpSelectorProps> = ({
  hand,
  contractBid,
  onSelectTrump,
}) => {
  const suits: Suit[] = ['SPADES', 'HEARTS', 'CLUBS', 'DIAMONDS'];

  // Group hand cards by suit
  const cardsBySuit: Record<Suit, Card[]> = {
    SPADES: hand.filter((c) => c.suit === 'SPADES'),
    HEARTS: hand.filter((c) => c.suit === 'HEARTS'),
    CLUBS: hand.filter((c) => c.suit === 'CLUBS'),
    DIAMONDS: hand.filter((c) => c.suit === 'DIAMONDS'),
  };

  // Find best suit candidate (suit with most cards or Jack)
  let recommendedSuit: Suit = 'SPADES';
  let bestScore = -1;
  suits.forEach((s) => {
    const list = cardsBySuit[s];
    const score = list.length * 3 + list.reduce((sum, c) => sum + c.rankOrder, 0);
    if (score > bestScore) {
      bestScore = score;
      recommendedSuit = s;
    }
  });

  const [selectedSuit, setSelectedSuit] = useState<Suit>(recommendedSuit);
  const suitCards = cardsBySuit[selectedSuit];

  // Default card to reserve as hidden trump
  const [selectedCardId, setSelectedCardId] = useState<string>(
    suitCards[0]?.id || hand[0]?.id
  );

  // Update card if selectedSuit changes
  React.useEffect(() => {
    const list = cardsBySuit[selectedSuit];
    if (list.length > 0) {
      setSelectedCardId(list[0].id);
    } else {
      setSelectedCardId(hand[0]?.id);
    }
  }, [selectedSuit]);

  const handleConfirm = () => {
    const card = hand.find((c) => c.id === selectedCardId) || hand[0];
    onSelectTrump(selectedSuit, card);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 border-2 border-amber-400 rounded-2xl p-5 max-w-md w-full shadow-2xl text-center">
        <span className="text-xs font-black uppercase tracking-wider text-amber-400">
          You Won the Auction! (Bid: {contractBid})
        </span>
        <h2 className="text-xl font-cinzel font-bold text-white mt-1 mb-2">
          Choose Your Trump Suit
        </h2>
        <p className="text-xs text-slate-300 mb-4">
          Select the suit for trump and reserve one card face-down as the concealed trump.
        </p>

        {/* Suit Options */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {suits.map((suit) => {
            const isRed = suit === 'HEARTS' || suit === 'DIAMONDS';
            const count = cardsBySuit[suit].length;
            const isSelected = selectedSuit === suit;
            const isRec = suit === recommendedSuit;

            return (
              <button
                key={suit}
                onClick={() => setSelectedSuit(suit)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center relative transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400 shadow-md'
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                }`}
              >
                {isRec && (
                  <span className="absolute -top-2 bg-emerald-600 text-white font-bold text-[9px] px-1.5 py-0.2 rounded-full">
                    Recommended
                  </span>
                )}
                <span
                  className={`text-2xl ${
                    isRed ? 'text-rose-500' : 'text-slate-200'
                  }`}
                >
                  {SUIT_SYMBOLS[suit]}
                </span>
                <span className="text-xs font-bold text-slate-100 mt-0.5">{suit}</span>
                <span className="text-[10px] text-slate-400">
                  {count} {count === 1 ? 'card' : 'cards'} in hand
                </span>
              </button>
            );
          })}
        </div>

        {/* Choose Concealed Card */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 mb-4">
          <div className="text-xs text-amber-300 font-semibold mb-2">
            Pick Card to Reserve as Hidden Trump:
          </div>
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
            {hand.map((card) => {
              const isSelectedCard = card.id === selectedCardId;
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className="cursor-pointer"
                >
                  <PlayingCard
                    card={card}
                    size="sm"
                    selected={isSelectedCard}
                    isPlayable={true}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/30 transition-transform active:scale-95"
        >
          CONFIRM TRUMP ({selectedSuit})
        </button>
      </div>
    </div>
  );
};
