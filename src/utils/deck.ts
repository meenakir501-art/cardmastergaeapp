import { Card, PlayerId, Rank, Suit } from '../types/game';

export const SUITS: Suit[] = ['SPADES', 'HEARTS', 'DIAMONDS', 'CLUBS'];
export const RANKS: Rank[] = ['J', '9', 'A', '10', 'K', 'Q', '8', '7'];

export const RANK_POINTS: Record<Rank, number> = {
  J: 3,
  '9': 2,
  A: 1,
  '10': 1,
  K: 0,
  Q: 0,
  '8': 0,
  '7': 0,
};

export const RANK_ORDER: Record<Rank, number> = {
  J: 8,
  '9': 7,
  A: 6,
  '10': 5,
  K: 4,
  Q: 3,
  '8': 2,
  '7': 1,
};

export const SUIT_SYMBOLS: Record<Suit, string> = {
  SPADES: '♠',
  HEARTS: '♥',
  DIAMONDS: '♦',
  CLUBS: '♣',
};

export const SUIT_COLORS: Record<Suit, { text: string; bg: string; border: string }> = {
  SPADES: { text: 'text-slate-900', bg: 'bg-slate-100', border: 'border-slate-300' },
  HEARTS: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  DIAMONDS: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  CLUBS: { text: 'text-emerald-950', bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${suit}_${rank}`,
        suit,
        rank,
        points: RANK_POINTS[rank],
        rankOrder: RANK_ORDER[rank],
      });
    }
  }
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// In Indian 28, bidding and play traditionally go Counter-Clockwise:
// SOUTH (You) -> EAST (Opponent 2) -> NORTH (Partner) -> WEST (Opponent 1) -> SOUTH
export const PLAYER_ORDER: PlayerId[] = ['SOUTH', 'EAST', 'NORTH', 'WEST'];

export function getNextPlayer(current: PlayerId): PlayerId {
  const idx = PLAYER_ORDER.indexOf(current);
  return PLAYER_ORDER[(idx + 1) % PLAYER_ORDER.length];
}

export function sortHand(cards: Card[]): Card[] {
  const suitOrder: Record<Suit, number> = {
    SPADES: 0,
    HEARTS: 1,
    CLUBS: 2,
    DIAMONDS: 3,
  };

  return [...cards].sort((a, b) => {
    if (a.suit !== b.suit) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    // Sort highest rank first: J > 9 > A > 10 > K > Q > 8 > 7
    return b.rankOrder - a.rankOrder;
  });
}
