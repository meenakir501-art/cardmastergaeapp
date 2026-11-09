import { AIDifficulty, Card, PlayerId, Suit, Team, TrickCard, TrumpState } from '../types/game';
import { canRevealTrump, determineTrickWinner, isMoveLegal } from './rules';

interface AIHandEvaluation {
  points: number;
  bestSuit: Suit;
  bestSuitScore: number;
  recommendedBid: number; // 0 for pass
}

/**
 * Evaluates hand strength and returns suit rankings and bid potential.
 */
export function evaluateHandForBidding(
  hand: Card[],
  difficulty: AIDifficulty,
  currentHighestBid: number
): AIHandEvaluation {
  const suitCounts: Record<Suit, number> = { SPADES: 0, HEARTS: 0, DIAMONDS: 0, CLUBS: 0 };
  const suitPoints: Record<Suit, number> = { SPADES: 0, HEARTS: 0, DIAMONDS: 0, CLUBS: 0 };
  const suitRankPower: Record<Suit, number> = { SPADES: 0, HEARTS: 0, DIAMONDS: 0, CLUBS: 0 };

  let totalCardPoints = 0;

  for (const card of hand) {
    suitCounts[card.suit]++;
    suitPoints[card.suit] += card.points;
    totalCardPoints += card.points;

    // Power points: Jack is massive (+6), Nine is high (+4), Ace (+3), 10 (+2)
    if (card.rank === 'J') suitRankPower[card.suit] += 6;
    else if (card.rank === '9') suitRankPower[card.suit] += 4;
    else if (card.rank === 'A') suitRankPower[card.suit] += 3;
    else if (card.rank === '10') suitRankPower[card.suit] += 2;
  }

  // Find best suit for trump
  let bestSuit: Suit = 'SPADES';
  let bestSuitScore = -1;

  const suits: Suit[] = ['SPADES', 'HEARTS', 'DIAMONDS', 'CLUBS'];
  for (const s of suits) {
    // Suit score factors in card count and high rank power
    const score = suitRankPower[s] * 2 + suitCounts[s] * 3 + suitPoints[s];
    if (score > bestSuitScore) {
      bestSuitScore = score;
      bestSuit = s;
    }
  }

  // Base bid calculation (minimum allowed bid: 16, maximum: 28)
  const minAllowedBid = Math.max(16, currentHighestBid === 0 ? 16 : currentHighestBid + 1);
  let bid = 0;

  if (minAllowedBid > 28) {
    // Cannot exceed maximum bid 28
    return {
      points: totalCardPoints,
      bestSuit,
      bestSuitScore,
      recommendedBid: 0,
    };
  }

  if (difficulty === 'EASY') {
    // Easy AI bids conservatively between 16 and 17 or passes
    if (bestSuitScore >= 18 && totalCardPoints >= 4) {
      bid = Math.min(17, minAllowedBid);
    }
  } else if (difficulty === 'MEDIUM') {
    // Medium evaluates points + jack holding (16 to 20)
    const hasJack = hand.some((c) => c.rank === 'J' && c.suit === bestSuit);
    const hasNine = hand.some((c) => c.rank === '9' && c.suit === bestSuit);

    if (hasJack && (hasNine || suitCounts[bestSuit] >= 2)) {
      bid = Math.max(16, Math.min(20, minAllowedBid));
    } else if (totalCardPoints >= 5 && suitCounts[bestSuit] >= 2) {
      bid = Math.max(16, Math.min(18, minAllowedBid));
    } else if (currentHighestBid === 0 && bestSuitScore >= 14) {
      bid = 16;
    }
  } else {
    // HARD AI: Strategic evaluation (16 to 28)
    const hasJack = hand.some((c) => c.rank === 'J' && c.suit === bestSuit);
    const hasNine = hand.some((c) => c.rank === '9' && c.suit === bestSuit);
    const jacksCount = hand.filter((c) => c.rank === 'J').length;

    let powerScore = bestSuitScore + jacksCount * 3 + totalCardPoints;
    if (hasJack && hasNine) powerScore += 4;

    if (powerScore >= 26) {
      bid = Math.max(16, Math.min(24, minAllowedBid));
    } else if (powerScore >= 20) {
      bid = Math.max(16, Math.min(21, minAllowedBid));
    } else if (powerScore >= 16) {
      bid = Math.max(16, Math.min(19, minAllowedBid));
    } else if (hasJack && suitCounts[bestSuit] >= 2) {
      bid = Math.max(16, Math.min(17, minAllowedBid));
    } else if (currentHighestBid === 0) {
      bid = 16;
    }
  }

  // Ensure bid is strictly between minAllowedBid and 28
  if (bid < minAllowedBid || bid > 28 || bid <= currentHighestBid) {
    bid = 0; // PASS
  }

  return {
    points: totalCardPoints,
    bestSuit,
    bestSuitScore,
    recommendedBid: bid,
  };
}

/**
 * AI chooses the trump suit and which specific card to conceal as the trump card.
 */
export function aiChooseTrump(hand: Card[]): { suit: Suit; card: Card } {
  const evalResult = evaluateHandForBidding(hand, 'HARD', 0);
  const bestSuit = evalResult.bestSuit;

  // Best card of the chosen suit to set as hidden trump
  // Ideally a Jack or 9 to guarantee a high trump return when exposed, or highest card of that suit
  const suitCards = hand.filter((c) => c.suit === bestSuit);
  const sortedSuitCards = [...suitCards].sort((a, b) => b.rankOrder - a.rankOrder);

  const chosenCard = sortedSuitCards[0] || hand[0];

  return {
    suit: bestSuit,
    card: chosenCard,
  };
}

/**
 * AI decision for playing a card on their turn.
 */
export function aiSelectCard(
  player: { id: PlayerId; hand: Card[]; team: Team },
  currentTrickCards: TrickCard[],
  leadSuit: Suit | null,
  trumpState: TrumpState,
  bidWinner: PlayerId,
  difficulty: AIDifficulty,
  mustPlayTrump: boolean
): { cardToPlay: Card; shouldRevealTrump: boolean } {
  const legalCards = player.hand.filter((c) =>
    isMoveLegal(c, player.hand, leadSuit, trumpState, mustPlayTrump).legal
  );

  if (legalCards.length === 0) {
    throw new Error(`AI player ${player.id} has no legal cards to play!`);
  }

  // Check if AI should reveal trump before playing
  const canReveal = canRevealTrump(
    player.id,
    player.hand,
    leadSuit,
    trumpState,
    bidWinner
  );

  let shouldReveal = false;

  // Decision logic for revealing trump
  if (canReveal && !trumpState.isRevealed && leadSuit) {
    // Current trick points
    const currentPoints = currentTrickCards.reduce((s, tc) => s + tc.card.points, 0);

    // Who is currently winning?
    const tempWinner = currentTrickCards.length > 0
      ? determineTrickWinner(currentTrickCards, leadSuit, trumpState).winner
      : null;

    const isPartnerWinning = tempWinner === (player.id === 'WEST' ? 'EAST' : player.id === 'EAST' ? 'WEST' : 'NORTH');

    if (!isPartnerWinning) {
      // Opponents are winning. Is trick worth cutting?
      // If trick has >= 2 points or opponents threw an Ace/Jack/9
      if (currentPoints >= 2 || difficulty === 'HARD') {
        // AI checks if they hold the secret trump (if they were bidder) or any cards of potential trump suits
        shouldReveal = true;
      }
    }
  }

  // If Easy AI, pick a legal card simply
  if (difficulty === 'EASY') {
    // Sort legal cards and pick lowest rank to avoid wasting points
    const sorted = [...legalCards].sort((a, b) => a.rankOrder - b.rankOrder);
    return { cardToPlay: sorted[0], shouldRevealTrump: false };
  }

  // Leading a trick
  if (!leadSuit || currentTrickCards.length === 0) {
    // Lead Ace if we have an Ace in a non-trump suit
    const solidAce = legalCards.find(
      (c) => c.rank === 'A' && (!trumpState.isRevealed || c.suit !== trumpState.suit)
    );
    if (solidAce) {
      return { cardToPlay: solidAce, shouldRevealTrump: false };
    }

    // If trump is revealed and AI has the top trump (Jack), lead it to draw out trumps
    if (trumpState.isRevealed) {
      const trumpJack = legalCards.find(
        (c) => c.suit === trumpState.suit && c.rank === 'J'
      );
      if (trumpJack && difficulty === 'HARD') {
        return { cardToPlay: trumpJack, shouldRevealTrump: false };
      }
    }

    // Otherwise lead a low card (7 or 8) in a suit with multiple cards
    const lowCard = [...legalCards].sort((a, b) => a.rankOrder - b.rankOrder)[0];
    return { cardToPlay: lowCard, shouldRevealTrump: false };
  }

  // Following an ongoing trick
  const currentBest = determineTrickWinner(currentTrickCards, leadSuit, trumpState);
  const partnerId: PlayerId =
    player.id === 'WEST' ? 'EAST' : player.id === 'EAST' ? 'WEST' : player.id === 'NORTH' ? 'SOUTH' : 'NORTH';
  const isPartnerWinning = currentBest.winner === partnerId;

  // 1. If Partner is currently winning the trick:
  if (isPartnerWinning) {
    // If partner's winning card is solid (Jack or 9), feed points (Ace or 10) if safe!
    if (currentBest.winningCard.rank === 'J' || currentBest.winningCard.rank === '9') {
      const pointCard = legalCards.find((c) => c.points > 0 && c.rank !== 'J');
      if (pointCard && currentTrickCards.length === 3) {
        // AI is the last player in the trick! Absolutely safe to feed points!
        return { cardToPlay: pointCard, shouldRevealTrump: false };
      }
    }

    // Otherwise duck with lowest card to save high cards
    const lowest = [...legalCards].sort((a, b) => a.rankOrder - b.rankOrder)[0];
    return { cardToPlay: lowest, shouldRevealTrump: false };
  }

  // 2. Opponents are winning:
  // Can AI beat the current highest card?
  // Check which legal cards beat the current highest
  const winningOptions = legalCards.filter((c) => {
    // Simulate playing this card
    const simTrick: TrickCard[] = [
      ...currentTrickCards,
      { player: player.id, card: c, playedAfterReveal: trumpState.isRevealed || shouldReveal },
    ];
    const simWinner = determineTrickWinner(
      simTrick,
      leadSuit,
      shouldReveal ? { ...trumpState, isRevealed: true } : trumpState
    );
    return simWinner.winner === player.id;
  });

  if (winningOptions.length > 0) {
    // Choose lowest winning card (e.g. use 9 instead of Jack if 9 already beats current high)
    winningOptions.sort((a, b) => a.rankOrder - b.rankOrder);
    return { cardToPlay: winningOptions[0], shouldRevealTrump: shouldReveal };
  }

  // Cannot beat current winning card: discard lowest point card (7, 8, Q, K)
  const nonPointCards = legalCards.filter((c) => c.points === 0);
  if (nonPointCards.length > 0) {
    nonPointCards.sort((a, b) => a.rankOrder - b.rankOrder);
    return { cardToPlay: nonPointCards[0], shouldRevealTrump: false };
  }

  // If forced to discard a point card, discard the lowest rank (10 or Ace, not 9 or Jack)
  const sorted = [...legalCards].sort((a, b) => a.rankOrder - b.rankOrder);
  return { cardToPlay: sorted[0], shouldRevealTrump: false };
}
