export type Suit = 'SPADES' | 'HEARTS' | 'DIAMONDS' | 'CLUBS';

export type Rank = 'J' | '9' | 'A' | '10' | 'K' | 'Q' | '8' | '7';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  points: number;
  rankOrder: number; // J: 8, 9: 7, A: 6, 10: 5, K: 4, Q: 3, 8: 2, 7: 1
}

export type PlayerId = 'SOUTH' | 'WEST' | 'NORTH' | 'EAST';

export type Team = 'TEAM_A' | 'TEAM_B'; // TEAM_A = SOUTH + NORTH, TEAM_B = WEST + EAST

export interface Player {
  id: PlayerId;
  name: string;
  isHuman: boolean;
  team: Team;
  avatar: string;
  hand: Card[];
}

export interface Bid {
  bidder: PlayerId;
  amount: number;
  isPass: boolean;
}

export interface TrumpState {
  suit: Suit | null;
  chosenCard: Card | null;
  isRevealed: boolean;
  revealedBy: PlayerId | null;
  revealedInTrick: number | null; // which trick index (0-7)
  revealedAtCardIndex: number | null; // 0-3 within trick
}

export interface TrickCard {
  player: PlayerId;
  card: Card;
  playedAfterReveal: boolean;
}

export interface Trick {
  trickNumber: number; // 1 to 8
  leadPlayer: PlayerId;
  leadSuit: Suit | null;
  cards: TrickCard[];
  winner: PlayerId | null;
  points: number;
}

export type GamePhase =
  | 'MENU'
  | 'DEALING_FIRST'
  | 'BIDDING'
  | 'TRUMP_SELECTION'
  | 'DEALING_SECOND'
  | 'PLAYING'
  | 'TRUMP_REVEALING'
  | 'TRICK_RESOLVING'
  | 'HAND_COMPLETE'
  | 'MATCH_COMPLETE';

export type AIDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface GameSettings {
  difficulty: AIDifficulty;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  vibrationEnabled: boolean;
  animationSpeed: 'FAST' | 'NORMAL' | 'SLOW';
  cardBack: 'BLUE' | 'RED';
  playerName: string;
  playerAvatar: string;
}

export interface HandResult {
  biddingTeam: Team;
  bidWinner: PlayerId;
  contractBid: number;
  teamAPoints: number;
  teamBPoints: number;
  teamATricks: number;
  teamBTricks: number;
  isContractMet: boolean;
  gamePointsDiff: number; // e.g. +1, +2, -1, -2
}

export interface MatchScore {
  teamAGamePoints: number; // Target +6 or -6
  teamBGamePoints: number;
  handsPlayed: number;
  history: HandResult[];
}

export const BOT_AVATARS = {
  PARTNER: '/src/assets/images/bot_avatar_chachaji_1793887774830.jpg',
  OPPONENT_1: '/src/assets/images/bot_avatar_sharmaji_1793887776087.jpg',
  OPPONENT_2: '/src/assets/images/bot_avatar_vermaji_1793887777074.jpg',
};

export const HUMAN_AVATAR_OPTIONS = [
  { id: 'avatar_1', name: 'Avatar 1', url: '/src/assets/images/player_avatar_arjun_1793887790731.jpg' },
  { id: 'avatar_2', name: 'Avatar 2', url: '/src/assets/images/player_avatar_priya_1793887791114.jpg' },
  { id: 'avatar_3', name: 'Avatar 3', url: '/src/assets/images/player_avatar_kabir_1793887791970.jpg' },
];
