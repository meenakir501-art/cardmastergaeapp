import { Card, PlayerId, Suit, Trick, TrickCard, TrumpState } from '../types/game';

/**
 * Validates whether a card can be legally played from the player's hand.
 *
 * Rules:
 * 1. Must follow suit if player holds any card of the led suit.
 * 2. If player has no card of the led suit:
 *    - If trump was just revealed in this turn by this player:
 *      - Player MUST play a trump if they possess one!
 *      - If they do not possess any trumps, they may play any card.
 *    - Otherwise, they may play any card from hand.
 */
export function isMoveLegal(
  card: Card,
  hand: Card[],
  leadSuit: Suit | null,
  trumpState: TrumpState,
  mustPlayTrump: boolean
): { legal: boolean; reason?: string } {
  // Check if card is actually in hand
  if (!hand.some((c) => c.id === card.id)) {
    return { legal: false, reason: 'Card is not in your hand.' };
  }

  // If this is the lead card of the trick, any card in hand is valid
  if (!leadSuit) {
    return { legal: true };
  }

  const hasLeadSuit = hand.some((c) => c.suit === leadSuit);

  // If player has cards of the led suit, they MUST follow suit
  if (hasLeadSuit) {
    if (card.suit !== leadSuit) {
      return {
        legal: false,
        reason: `Must follow suit! You have cards of ${leadSuit.toLowerCase()}.`,
      };
    }
    return { legal: true };
  }

  // If player just requested trump reveal in this trick, they MUST play a trump if they hold one
  if (mustPlayTrump && trumpState.suit) {
    const hasTrumpCard = hand.some((c) => c.suit === trumpState.suit);
    if (hasTrumpCard && card.suit !== trumpState.suit) {
      return {
        legal: false,
        reason: `You revealed trump (${trumpState.suit.toLowerCase()}) and must play a trump card!`,
      };
    }
  }

  // If cannot follow suit and not forced to play trump, any card is valid
  return { legal: true };
}

/**
 * Determines the winning card and player of a completed trick.
 *
 * Rules:
 * - If trump is active (revealed):
 *   - Only trumps played AFTER exposure (or in tricks subsequent to exposure) count as trumps!
 *   - The highest trump among valid trump plays wins the trick.
 * - If no valid trump was played:
 *   - The highest card of the led suit wins the trick.
 */
export function determineTrickWinner(
  cards: TrickCard[],
  leadSuit: Suit,
  trumpState: TrumpState
): { winner: PlayerId; winningCard: Card; points: number } {
  if (cards.length === 0) {
    throw new Error('Cannot determine winner of empty trick');
  }

  let highestCard: Card = cards[0].card;
  let winner: PlayerId = cards[0].player;
  let highestIsTrump = false;

  // Total points in this trick
  const points = cards.reduce((sum, tc) => sum + tc.card.points, 0);

  for (let i = 0; i < cards.length; i++) {
    const { card, player, playedAfterReveal } = cards[i];

    // Card counts as a trump ONLY if trump is revealed AND this card was played after reveal
    const isValidTrumpPlay =
      trumpState.isRevealed &&
      card.suit === trumpState.suit &&
      playedAfterReveal;

    if (isValidTrumpPlay) {
      if (!highestIsTrump) {
        // First valid trump beats any lead suit card
        highestIsTrump = true;
        highestCard = card;
        winner = player;
      } else if (card.rankOrder > highestCard.rankOrder) {
        // Higher trump overtakes lower trump
        highestCard = card;
        winner = player;
      }
    } else if (!highestIsTrump && card.suit === leadSuit) {
      // Compare cards of the led suit
      if (highestCard.suit !== leadSuit || card.rankOrder > highestCard.rankOrder) {
        highestCard = card;
        winner = player;
      }
    }
  }

  return { winner, winningCard: highestCard, points };
}

/**
 * Checks if a player is allowed to ask for / reveal trump.
 *
 * A player may reveal trump if:
 * 1. Trump is NOT yet revealed.
 * 2. There is an active trick in progress with a led suit.
 * 3. The player CANNOT follow suit (is void in lead suit).
 * OR: The bidder themselves is on turn and wants to expose trump.
 */
export function canRevealTrump(
  playerId: PlayerId,
  hand: Card[],
  leadSuit: Suit | null,
  trumpState: TrumpState,
  bidWinner: PlayerId | null
): boolean {
  if (trumpState.isRevealed) return false;
  if (!leadSuit) {
    // If leading a trick, only bidder can expose trump if they have no other options or choose to
    return playerId === bidWinner;
  }
  // If not leading, player can reveal if void in lead suit
  const hasLeadSuit = hand.some((c) => c.suit === leadSuit);
  return !hasLeadSuit;
}

/**
 * Calculates game points awarded for meeting/failing a contract.
 */
export function calculateContractPoints(bid: number, met: boolean): number {
  let basePoints = 1;
  if (bid >= 24) {
    basePoints = 3;
  } else if (bid >= 20) {
    basePoints = 2;
  }

  return met ? basePoints : -basePoints;
}
