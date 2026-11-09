import React, { useCallback, useEffect, useRef, useState } from 'react';
import { hindiSpeech } from '../audio/hindiSpeech';
import { sound } from '../audio/soundEngine';
import { aiChooseTrump, aiSelectCard, evaluateHandForBidding } from '../logic/ai';
import {
  calculateContractPoints,
  canRevealTrump,
  determineTrickWinner,
  isMoveLegal,
} from '../logic/rules';
import {
  BOT_AVATARS,
  Card,
  GamePhase,
  GameSettings,
  HandResult,
  HUMAN_AVATAR_OPTIONS,
  MatchScore,
  Player,
  PlayerId,
  Suit,
  Team,
  Trick,
  TrickCard,
  TrumpState,
} from '../types/game';
import {
  createDeck,
  getNextPlayer,
  PLAYER_ORDER,
  shuffleDeck,
  sortHand,
} from '../utils/deck';
import { generateFourGuestNames } from '../utils/guestName';
import { AboutModal } from './AboutModal';
import { BiddingPanel } from './BiddingPanel';
import { PlayerHand } from './PlayerHand';
import { PlayerSeat } from './PlayerSeat';
import { ResultScreen } from './ResultScreen';
import { ScoreBoard } from './ScoreBoard';
import { SettingsScreen } from './SettingsScreen';
import { TrickArea } from './TrickArea';
import { TrumpBox } from './TrumpBox';
import { TrumpRevealModal } from './TrumpRevealModal';
import { TrumpSelector } from './TrumpSelector';
import { TutorialScreen } from './TutorialScreen';

interface GameScreenProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onMainMenu: () => void;
  isQuickPlay?: boolean;
  onlineRoomCode?: string | null;
  seatAssignments?: Record<PlayerId, { name: string; isAI: boolean; avatar: string }> | null;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  settings,
  onUpdateSettings,
  onMainMenu,
  isQuickPlay = false,
  onlineRoomCode = null,
  seatAssignments = null,
}) => {
  // Players with unique session Guest usernames (format: Guest + 7 digits)
  const [players, setPlayers] = useState<Player[]>(() => {
    const sessionGuestNames = generateFourGuestNames();

    if (seatAssignments) {
      return [
        {
          id: 'SOUTH',
          name: seatAssignments.SOUTH?.name || settings.playerName || sessionGuestNames.SOUTH,
          isHuman: true,
          team: 'TEAM_A',
          avatar: seatAssignments.SOUTH?.avatar || settings.playerAvatar || HUMAN_AVATAR_OPTIONS[0].url,
          hand: [],
        },
        {
          id: 'EAST',
          name: seatAssignments.EAST?.name || sessionGuestNames.EAST,
          isHuman: !seatAssignments.EAST?.isAI,
          team: 'TEAM_B',
          avatar: seatAssignments.EAST?.avatar || BOT_AVATARS.OPPONENT_2,
          hand: [],
        },
        {
          id: 'NORTH',
          name: seatAssignments.NORTH?.name || sessionGuestNames.NORTH,
          isHuman: !seatAssignments.NORTH?.isAI,
          team: 'TEAM_A',
          avatar: seatAssignments.NORTH?.avatar || BOT_AVATARS.PARTNER,
          hand: [],
        },
        {
          id: 'WEST',
          name: seatAssignments.WEST?.name || sessionGuestNames.WEST,
          isHuman: !seatAssignments.WEST?.isAI,
          team: 'TEAM_B',
          avatar: seatAssignments.WEST?.avatar || BOT_AVATARS.OPPONENT_1,
          hand: [],
        },
      ];
    }

    const southName =
      settings.playerName && /^Guest\d{7}$/.test(settings.playerName)
        ? settings.playerName
        : sessionGuestNames.SOUTH;

    return [
      {
        id: 'SOUTH',
        name: southName,
        isHuman: true,
        team: 'TEAM_A',
        avatar: settings.playerAvatar || HUMAN_AVATAR_OPTIONS[0].url,
        hand: [],
      },
      {
        id: 'EAST',
        name: sessionGuestNames.EAST,
        isHuman: false,
        team: 'TEAM_B',
        avatar: BOT_AVATARS.OPPONENT_2,
        hand: [],
      },
      {
        id: 'NORTH',
        name: sessionGuestNames.NORTH,
        isHuman: false,
        team: 'TEAM_A',
        avatar: BOT_AVATARS.PARTNER,
        hand: [],
      },
      {
        id: 'WEST',
        name: sessionGuestNames.WEST,
        isHuman: false,
        team: 'TEAM_B',
        avatar: BOT_AVATARS.OPPONENT_1,
        hand: [],
      },
    ];
  });

  // Dealer and Turn State
  const [dealer, setDealer] = useState<PlayerId>('WEST');
  const [currentTurn, setCurrentTurn] = useState<PlayerId>('SOUTH');
  const [phase, setPhase] = useState<GamePhase>('DEALING_FIRST');

  // Deck
  const deckRef = useRef<Card[]>([]);
  const [remainingDeck, setRemainingDeck] = useState<Card[]>([]);

  // Bidding State
  const [currentBidder, setCurrentBidder] = useState<PlayerId>('SOUTH');
  const [currentHighestBid, setCurrentHighestBid] = useState<number>(0);
  const [highestBidder, setHighestBidder] = useState<PlayerId | null>(null);
  const [consecutivePasses, setConsecutivePasses] = useState<number>(0);
  const [playerSpeech, setPlayerSpeech] = useState<Record<PlayerId, string | null>>({
    SOUTH: null,
    EAST: null,
    NORTH: null,
    WEST: null,
  });
  const [playerCallOrPass, setPlayerCallOrPass] = useState<Record<PlayerId, string | null>>({
    SOUTH: null,
    EAST: null,
    NORTH: null,
    WEST: null,
  });

  // Trump State
  const [trumpState, setTrumpState] = useState<TrumpState>({
    suit: null,
    chosenCard: null,
    isRevealed: false,
    revealedBy: null,
    revealedInTrick: null,
    revealedAtCardIndex: null,
  });
  const [reservedTrumpCard, setReservedTrumpCard] = useState<{
    bidder: PlayerId;
    card: Card;
  } | null>(null);
  const [mustPlayTrump, setMustPlayTrump] = useState<boolean>(false);
  const [showTrumpRevealModal, setShowTrumpRevealModal] = useState<boolean>(false);

  // Trick State
  const [currentTrickNumber, setCurrentTrickNumber] = useState<number>(1);
  const [currentTrickCards, setCurrentTrickCards] = useState<TrickCard[]>([]);
  const [leadSuit, setLeadSuit] = useState<Suit | null>(null);
  const [lastTrickWinner, setLastTrickWinner] = useState<PlayerId | null>(null);
  const [isResolvingTrick, setIsResolvingTrick] = useState<boolean>(false);

  // Points & Tricks in Current Hand
  const [teamACardPoints, setTeamACardPoints] = useState<number>(0);
  const [teamBCardPoints, setTeamBCardPoints] = useState<number>(0);
  const [teamATricks, setTeamATricks] = useState<number>(0);
  const [teamBTricks, setTeamBTricks] = useState<number>(0);

  // Match Score
  const [matchScore, setMatchScore] = useState<MatchScore>({
    teamAGamePoints: 0,
    teamBGamePoints: 0,
    handsPlayed: 0,
    history: [],
  });
  const [handResult, setHandResult] = useState<HandResult | null>(null);
  const [isMatchComplete, setIsMatchComplete] = useState<boolean>(false);
  const [matchWinner, setMatchWinner] = useState<Team | null>(null);

  // UI Interactive States
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [illegalMoveReason, setIllegalMoveReason] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);

  // Helper for announcements
  const announceSpeech = (playerId: PlayerId, text: string) => {
    setPlayerSpeech((prev) => ({ ...prev, [playerId]: text }));
    setTimeout(() => {
      setPlayerSpeech((prev) => ({ ...prev, [playerId]: null }));
    }, 1800);
  };

  // 1. Start a New Hand
  const startNewHand = useCallback(() => {
    sound.playCardShuffle();
    setTimeout(() => {
      sound.playDealSequence(4, 180);
    }, 320);

    // Reset hand state
    const newDeck = shuffleDeck(createDeck());
    deckRef.current = newDeck;

    // Deal first 4 cards to each of the 4 players (16 cards total)
    // Order: starting from player next to dealer
    const firstBidder = getNextPlayer(dealer);

    const hands: Record<PlayerId, Card[]> = {
      SOUTH: [],
      EAST: [],
      NORTH: [],
      WEST: [],
    };

    let cardIdx = 0;
    // Deal 4 cards to each player
    for (let i = 0; i < 4; i++) {
      for (const pid of PLAYER_ORDER) {
        hands[pid].push(newDeck[cardIdx++]);
      }
    }

    setRemainingDeck(newDeck.slice(16));

    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        hand: sortHand(hands[p.id]),
      }))
    );

    // Reset trick and trump state
    setTrumpState({
      suit: null,
      chosenCard: null,
      isRevealed: false,
      revealedBy: null,
      revealedInTrick: null,
      revealedAtCardIndex: null,
    });
    setReservedTrumpCard(null);
    setMustPlayTrump(false);
    setCurrentTrickNumber(1);
    setCurrentTrickCards([]);
    setLeadSuit(null);
    setLastTrickWinner(null);
    setIsResolvingTrick(false);
    setTeamACardPoints(0);
    setTeamBCardPoints(0);
    setTeamATricks(0);
    setTeamBTricks(0);
    setHandResult(null);
    setSelectedCard(null);
    setIllegalMoveReason(null);
    setPlayerCallOrPass({
      SOUTH: isQuickPlay ? 'CALL 16' : null,
      EAST: null,
      NORTH: null,
      WEST: null,
    });

    // If Quick Play, automatically assign bid 16 to Partner or You
    if (isQuickPlay) {
      setCurrentHighestBid(16);
      setHighestBidder('SOUTH');
      setPhase('TRUMP_SELECTION');
    } else {
      setCurrentHighestBid(0);
      setHighestBidder(null);
      setConsecutivePasses(0);
      setCurrentBidder(firstBidder);
      setPhase('BIDDING');
    }
  }, [dealer, isQuickPlay]);

  // Initial hand setup on mount only — prevents duplicate bidding or accidental resets
  const hasInitializedRef = useRef<boolean>(false);
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      startNewHand();
    }
  }, [startNewHand]);

  // 2. Bidding Cycle
  const handleBidSubmit = (bidderId: PlayerId, amount: number, isPass: boolean) => {
    if (isPass) {
      sound.playButtonPress();
      announceSpeech(bidderId, 'Pass');
      // Pass is completely silent (no speech)
      setPlayerCallOrPass((prev) => ({ ...prev, [bidderId]: 'PASS' }));
      const newPasses = consecutivePasses + 1;
      setConsecutivePasses(newPasses);

      // If 3 consecutive passes after someone bid, auction ends!
      if (currentHighestBid > 0 && newPasses >= 3) {
        finishBidding(highestBidder!, currentHighestBid);
        return;
      }

      // If all 4 players pass initially with no bid, first player forced to bid 16 (range: 16-28)
      if (currentHighestBid === 0 && newPasses >= 4) {
        announceSpeech(bidderId, 'Opening Bid 16');
        if (bidderId === 'SOUTH') {
          hindiSpeech.speakHumanBidNumber(16, settings.voiceEnabled !== false);
        }
        setPlayerCallOrPass((prev) => ({ ...prev, [bidderId]: 'CALL 16' }));
        finishBidding(bidderId, 16);
        return;
      }

      // Next bidder
      const next = getNextPlayer(bidderId);
      setCurrentBidder(next);
    } else {
      // Valid bid between 16 and 28
      sound.playBidSound();
      announceSpeech(bidderId, `Bids ${amount}`);
      // Announce ONLY the human player's accepted bid amount in Hindi ("सोलह", "बीस", etc.)
      // AI bids remain completely silent
      if (bidderId === 'SOUTH') {
        hindiSpeech.speakHumanBidNumber(amount, settings.voiceEnabled !== false);
      }
      setPlayerCallOrPass((prev) => ({ ...prev, [bidderId]: `CALL ${amount}` }));
      setCurrentHighestBid(amount);
      setHighestBidder(bidderId);
      setConsecutivePasses(0);

      // If bid reached max 28, auction ends immediately
      if (amount === 28) {
        finishBidding(bidderId, 28);
        return;
      }

      // Next bidder
      const next = getNextPlayer(bidderId);
      setCurrentBidder(next);
    }
  };

  const finishBidding = (winner: PlayerId, finalBid: number) => {
    setCurrentHighestBid(finalBid);
    setHighestBidder(winner);
    setPlayerCallOrPass((prev) => ({ ...prev, [winner]: `CALL ${finalBid}` }));
    setCurrentTurn(winner);

    // Move to Trump Selection
    if (winner === 'SOUTH') {
      setPhase('TRUMP_SELECTION');
    } else {
      // AI chooses trump
      setTimeout(() => {
        const aiPlayer = players.find((p) => p.id === winner)!;
        const trumpChoice = aiChooseTrump(aiPlayer.hand);
        setTrumpState((prev) => ({
          ...prev,
          suit: trumpChoice.suit,
          chosenCard: trumpChoice.card,
        }));
        setReservedTrumpCard({
          bidder: winner,
          card: trumpChoice.card,
        });

        // Remove the reserved card from AI's active hand until revealed
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === winner
              ? { ...p, hand: p.hand.filter((c) => c.id !== trumpChoice.card.id) }
              : p
          )
        );

        dealRemainingCards(winner);
      }, 800);
    }
  };

  // Human confirmed trump selection
  const handleHumanSelectTrump = (suit: Suit, card: Card) => {
    sound.playCardSnap();
    setTrumpState((prev) => ({
      ...prev,
      suit,
      chosenCard: card,
    }));
    setReservedTrumpCard({
      bidder: 'SOUTH',
      card,
    });

    // Remove the reserved card from human hand until revealed
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === 'SOUTH' ? { ...p, hand: p.hand.filter((c) => c.id !== card.id) } : p
      )
    );

    dealRemainingCards('SOUTH');
  };

  // 3. Deal remaining 4 cards to each player
  const dealRemainingCards = (bidWinnerId: PlayerId) => {
    sound.playDealSequence(4, 180);

    const remaining = deckRef.current.slice(16, 32);
    let cardIdx = 0;

    setPlayers((prev) =>
      prev.map((p) => {
        const extraCards = remaining.slice(cardIdx, cardIdx + 4);
        cardIdx += 4;
        return {
          ...p,
          hand: sortHand([...p.hand, ...extraCards]),
        };
      })
    );

    setRemainingDeck([]);

    // Play starts with the first player next to dealer (traditional) or bidder
    // In 28, leader of the first trick is player next to dealer (counter-clockwise)
    const firstLead = getNextPlayer(dealer);
    setCurrentTurn(firstLead);
    setPhase('PLAYING');
  };

  // 4. AI Turns for Bidding
  useEffect(() => {
    if (phase === 'BIDDING' && currentBidder !== 'SOUTH') {
      const timer = setTimeout(() => {
        const aiPlayer = players.find((p) => p.id === currentBidder);
        if (!aiPlayer) return;

        const evalResult = evaluateHandForBidding(
          aiPlayer.hand,
          settings.difficulty,
          currentHighestBid
        );

        if (evalResult.recommendedBid > currentHighestBid) {
          handleBidSubmit(currentBidder, evalResult.recommendedBid, false);
        } else {
          handleBidSubmit(currentBidder, 0, true);
        }
      }, 900);

      return () => clearTimeout(timer);
    }
  }, [phase, currentBidder, currentHighestBid, consecutivePasses, players, settings.difficulty]);

  // 5. Trump Exposure Action
  const handleRevealTrump = useCallback(
    (playerId: PlayerId) => {
      sound.playTrumpReveal();
      setShowTrumpRevealModal(true);

      setTrumpState((prev) => ({
        ...prev,
        isRevealed: true,
        revealedBy: playerId,
        revealedInTrick: currentTrickNumber,
        revealedAtCardIndex: currentTrickCards.length,
      }));

      // If the bidder has a reserved concealed card, return it to their hand now!
      if (reservedTrumpCard) {
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === reservedTrumpCard.bidder
              ? {
                  ...p,
                  hand: sortHand([...p.hand, reservedTrumpCard.card]),
                }
              : p
          )
        );
      }

      // The player who revealed trump is obligated to play a trump if they have one!
      if (playerId === currentTurn) {
        setMustPlayTrump(true);
      }
    },
    [currentTrickNumber, currentTrickCards.length, reservedTrumpCard, currentTurn]
  );

  // 6. Playing a Card
  const executeCardPlay = useCallback(
    (playerId: PlayerId, card: Card, didRevealJustNow: boolean = false) => {
      sound.playCardSnap();

      // Check if this card was played after reveal
      const isAfterReveal = trumpState.isRevealed || didRevealJustNow;

      const newTrickCard: TrickCard = {
        player: playerId,
        card,
        playedAfterReveal: isAfterReveal,
      };

      const updatedTrickCards = [...currentTrickCards, newTrickCard];
      setCurrentTrickCards(updatedTrickCards);

      // If first card of the trick, establish the lead suit
      const effectiveLeadSuit = leadSuit || card.suit;
      if (!leadSuit) {
        setLeadSuit(card.suit);
      }

      // Remove card from player hand
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === playerId ? { ...p, hand: p.hand.filter((c) => c.id !== card.id) } : p
        )
      );

      // Reset selection and temporary flags
      setSelectedCard(null);
      setIllegalMoveReason(null);
      setMustPlayTrump(false);

      // Check if trick is complete (4 cards played)
      if (updatedTrickCards.length === 4) {
        setIsResolvingTrick(true);
        setPhase('TRICK_RESOLVING');

        const { winner, points } = determineTrickWinner(
          updatedTrickCards,
          effectiveLeadSuit,
          trumpState
        );

        setLastTrickWinner(winner);

        // Award points and trick count to winning team
        const isTeamA = winner === 'SOUTH' || winner === 'NORTH';
        if (isTeamA) {
          setTeamACardPoints((prev) => prev + points);
          setTeamATricks((prev) => prev + 1);
        } else {
          setTeamBCardPoints((prev) => prev + points);
          setTeamBTricks((prev) => prev + 1);
        }

        // Delay to allow players to see the completed trick
        setTimeout(() => {
          sound.playTrickWin();

          // Check if this was the 8th (final) trick
          if (currentTrickNumber === 8) {
            handleCompleteHand(
              isTeamA ? teamACardPoints + points : teamACardPoints,
              !isTeamA ? teamBCardPoints + points : teamBCardPoints,
              isTeamA ? teamATricks + 1 : teamATricks,
              !isTeamA ? teamBTricks + 1 : teamBTricks
            );
          } else {
            // Next trick
            setCurrentTrickNumber((prev) => prev + 1);
            setCurrentTrickCards([]);
            setLeadSuit(null);
            setIsResolvingTrick(false);
            setCurrentTurn(winner);
            setPhase('PLAYING');
          }
        }, 1200);
      } else {
        // Advance to next player
        const next = getNextPlayer(playerId);
        setCurrentTurn(next);
      }
    },
    [
      currentTrickCards,
      leadSuit,
      trumpState,
      currentTrickNumber,
      teamACardPoints,
      teamBCardPoints,
      teamATricks,
      teamBTricks,
    ]
  );

  // Human player taps "Play" or double-taps card
  const handleHumanPlayCard = (card: Card) => {
    if (phase !== 'PLAYING' || currentTurn !== 'SOUTH') return;

    const validation = isMoveLegal(
      card,
      players.find((p) => p.id === 'SOUTH')!.hand,
      leadSuit,
      trumpState,
      mustPlayTrump
    );

    if (!validation.legal) {
      sound.playError();
      setIllegalMoveReason(validation.reason || 'Illegal move!');
      return;
    }

    executeCardPlay('SOUTH', card);
  };

  // 7. AI Play Loop
  useEffect(() => {
    if (phase === 'PLAYING' && currentTurn !== 'SOUTH' && !isResolvingTrick) {
      const delay = settings.animationSpeed === 'FAST' ? 450 : settings.animationSpeed === 'SLOW' ? 1100 : 750;

      const timer = setTimeout(() => {
        const aiPlayer = players.find((p) => p.id === currentTurn);
        if (!aiPlayer || aiPlayer.hand.length === 0) return;

        try {
          const { cardToPlay, shouldRevealTrump } = aiSelectCard(
            aiPlayer,
            currentTrickCards,
            leadSuit,
            trumpState,
            highestBidder || 'SOUTH',
            settings.difficulty,
            mustPlayTrump
          );

          if (shouldRevealTrump && !trumpState.isRevealed) {
            handleRevealTrump(currentTurn);
            // Delay slightly after reveal to play card
            setTimeout(() => {
              executeCardPlay(currentTurn, cardToPlay, true);
            }, 600);
          } else {
            executeCardPlay(currentTurn, cardToPlay, false);
          }
        } catch {
          // Fallback legal play if any issue
          const fallback = aiPlayer.hand[0];
          executeCardPlay(currentTurn, fallback, false);
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [
    phase,
    currentTurn,
    isResolvingTrick,
    currentTrickCards,
    leadSuit,
    trumpState,
    highestBidder,
    mustPlayTrump,
    settings.difficulty,
    settings.animationSpeed,
    players,
    executeCardPlay,
    handleRevealTrump,
  ]);

  // 8. Hand Complete Evaluation
  const handleCompleteHand = (
    finalTeamAPoints: number,
    finalTeamBPoints: number,
    finalTeamATricks: number,
    finalTeamBTricks: number
  ) => {
    setPhase('HAND_COMPLETE');

    const bidder = highestBidder || 'SOUTH';
    const biddingTeam: Team = bidder === 'SOUTH' || bidder === 'NORTH' ? 'TEAM_A' : 'TEAM_B';
    const contract = currentHighestBid;

    const biddingTeamPoints = biddingTeam === 'TEAM_A' ? finalTeamAPoints : finalTeamBPoints;
    const isContractMet = biddingTeamPoints >= contract;

    const gamePointsDelta = calculateContractPoints(contract, isContractMet);

    // Update match score
    const newTeamAGamePoints =
      biddingTeam === 'TEAM_A'
        ? matchScore.teamAGamePoints + gamePointsDelta
        : matchScore.teamAGamePoints - (isContractMet ? 0 : gamePointsDelta);

    const newTeamBGamePoints =
      biddingTeam === 'TEAM_B'
        ? matchScore.teamBGamePoints + gamePointsDelta
        : matchScore.teamBGamePoints - (isContractMet ? 0 : gamePointsDelta);

    const result: HandResult = {
      biddingTeam,
      bidWinner: bidder,
      contractBid: contract,
      teamAPoints: finalTeamAPoints,
      teamBPoints: finalTeamBPoints,
      teamATricks: finalTeamATricks,
      teamBTricks: finalTeamBTricks,
      isContractMet,
      gamePointsDiff: gamePointsDelta,
    };

    setHandResult(result);

    const updatedMatchScore: MatchScore = {
      teamAGamePoints: newTeamAGamePoints,
      teamBGamePoints: newTeamBGamePoints,
      handsPlayed: matchScore.handsPlayed + 1,
      history: [...matchScore.history, result],
    };
    setMatchScore(updatedMatchScore);

    // Check Match victory condition (+6 points)
    if (newTeamAGamePoints >= 6 || newTeamBGamePoints <= -6) {
      setIsMatchComplete(true);
      setMatchWinner('TEAM_A');
      sound.playVictory();
    } else if (newTeamBGamePoints >= 6 || newTeamAGamePoints <= -6) {
      setIsMatchComplete(true);
      setMatchWinner('TEAM_B');
      sound.playDefeat();
    } else {
      if (isContractMet && biddingTeam === 'TEAM_A') {
        sound.playVictory();
      } else {
        sound.playDefeat();
      }
    }
  };

  // Move to next hand
  const handleNextHand = () => {
    // Rotate dealer counter-clockwise
    setDealer(getNextPlayer(dealer));
    startNewHand();
  };

  // Restart match from scratch with fresh guest names for new session
  const handleRestartMatch = () => {
    const freshGuestNames = generateFourGuestNames();
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        name: freshGuestNames[p.id],
      }))
    );
    onUpdateSettings({ playerName: freshGuestNames.SOUTH });
    setMatchScore({
      teamAGamePoints: 0,
      teamBGamePoints: 0,
      handsPlayed: 0,
      history: [],
    });
    setIsMatchComplete(false);
    setMatchWinner(null);
    setDealer('WEST');
    startNewHand();
  };

  const humanPlayer = players.find((p) => p.id === 'SOUTH')!;
  const partnerPlayer = players.find((p) => p.id === 'NORTH')!;
  const westPlayer = players.find((p) => p.id === 'WEST')!;
  const eastPlayer = players.find((p) => p.id === 'EAST')!;

  const canHumanRevealTrump = canRevealTrump(
    'SOUTH',
    humanPlayer.hand,
    leadSuit,
    trumpState,
    highestBidder
  );

  const leadPlayerName =
    currentTrickCards.length > 0
      ? players.find((p) => p.id === currentTrickCards[0].player)?.name
      : null;

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none overflow-hidden text-slate-100 felt-table">
      {/* 1. TOP HUD / SCOREBOARD */}
      <ScoreBoard
        teamACardPoints={teamACardPoints}
        teamBCardPoints={teamBCardPoints}
        teamATricks={teamATricks}
        teamBTricks={teamBTricks}
        contractBid={currentHighestBid}
        bidWinner={highestBidder}
        biddingTeam={
          highestBidder
            ? highestBidder === 'SOUTH' || highestBidder === 'NORTH'
              ? 'TEAM_A'
              : 'TEAM_B'
            : null
        }
        teamAGamePoints={matchScore.teamAGamePoints}
        teamBGamePoints={matchScore.teamBGamePoints}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
        onOpenSettings={() => setShowSettings(true)}
        onOpenHelp={() => setShowTutorial(true)}
        roomCode={onlineRoomCode}
        trumpSuit={trumpState.suit}
        isTrumpRevealed={trumpState.isRevealed}
      />

      {/* 2. GAME TABLE (CENTER 4-PLAYER VIEW) */}
      <main className="relative flex-1 w-full max-w-md mx-auto flex flex-col items-center justify-between px-2 py-0.5 overflow-hidden min-h-0">
        {/* TOP ROW: Partner (Player 2) + Corner Trump Box */}
        <div className="relative w-full flex items-center justify-between px-2 pt-0.5 min-h-[56px]">
          {/* Left balance spacer */}
          <div className="w-12 sm:w-14 invisible pointer-events-none" />

          {/* TOP SEAT: Player 2 (North Partner) */}
          <div className="z-10 flex justify-center">
            <PlayerSeat
              player={partnerPlayer}
              isTurn={currentTurn === 'NORTH'}
              isDealer={dealer === 'NORTH'}
              isBidWinner={highestBidder === 'NORTH'}
              bidAmount={currentHighestBid}
              callOrPassStatus={playerCallOrPass.NORTH}
              speechText={playerSpeech.NORTH}
              position="TOP"
              cardCount={partnerPlayer.hand.length}
            />
          </div>

          {/* Trump Box in Top Right Corner */}
          <div className="z-20 w-12 sm:w-14 flex justify-end">
            <TrumpBox
              trumpState={trumpState}
              bidWinner={highestBidder}
              contractBid={currentHighestBid}
              canReveal={canHumanRevealTrump && currentTurn === 'SOUTH' && phase === 'PLAYING'}
              onRevealTrump={() => handleRevealTrump('SOUTH')}
              isHumanBidder={highestBidder === 'SOUTH'}
            />
          </div>
        </div>

        {/* MIDDLE SECTION: Player 3 (West) - Trick Area - Player 4 (East) */}
        <div className="relative w-full flex items-center justify-between px-1.5 my-auto">
          {/* LEFT SEAT: Player 3 (Opponent 1 - West) */}
          <div className="z-10 shrink-0 flex justify-start">
            <PlayerSeat
              player={westPlayer}
              isTurn={currentTurn === 'WEST'}
              isDealer={dealer === 'WEST'}
              isBidWinner={highestBidder === 'WEST'}
              bidAmount={currentHighestBid}
              callOrPassStatus={playerCallOrPass.WEST}
              speechText={playerSpeech.WEST}
              position="LEFT"
              cardCount={westPlayer.hand.length}
            />
          </div>

          {/* TRICK AREA (CENTER TABLE) */}
          <div className="relative z-10 flex flex-col items-center px-0.5">
            <TrickArea
              currentTrickCards={currentTrickCards}
              leadSuit={leadSuit}
              leadPlayerName={leadPlayerName}
              trickNumber={currentTrickNumber}
              trumpState={trumpState}
              isResolvingTrick={isResolvingTrick}
              winningPlayerId={lastTrickWinner}
            />
          </div>

          {/* RIGHT SEAT: Player 4 (Opponent 2 - East) */}
          <div className="z-10 shrink-0 flex justify-end">
            <PlayerSeat
              player={eastPlayer}
              isTurn={currentTurn === 'EAST'}
              isDealer={dealer === 'EAST'}
              isBidWinner={highestBidder === 'EAST'}
              bidAmount={currentHighestBid}
              callOrPassStatus={playerCallOrPass.EAST}
              speechText={playerSpeech.EAST}
              position="RIGHT"
              cardCount={eastPlayer.hand.length}
            />
          </div>
        </div>

        {/* BOTTOM SEAT: My Player (South) Status & Trick Tracker */}
        <div className="z-10 mb-0.5 flex items-center justify-between w-full px-2">
          <PlayerSeat
            player={humanPlayer}
            isTurn={currentTurn === 'SOUTH'}
            isDealer={dealer === 'SOUTH'}
            isBidWinner={highestBidder === 'SOUTH'}
            bidAmount={currentHighestBid}
            callOrPassStatus={playerCallOrPass.SOUTH}
            speechText={playerSpeech.SOUTH}
            position="BOTTOM"
            cardCount={humanPlayer.hand.length}
          />

          {/* Active Hand Trick Indicator */}
          <div className="text-[10px] text-amber-200/90 font-mono-nums bg-slate-900/80 px-2 py-0.5 rounded-full border border-amber-500/20 shadow-xs">
            Trick {currentTrickNumber} of 8
          </div>
        </div>

        {/* 3. HUMAN CARDS & ONE-TAP PLAY */}
        <div className="w-full z-20 pb-0.5">
          <PlayerHand
            hand={humanPlayer.hand}
            isTurn={currentTurn === 'SOUTH' && phase === 'PLAYING'}
            leadSuit={leadSuit}
            trumpState={trumpState}
            mustPlayTrump={mustPlayTrump}
            canRevealTrump={canHumanRevealTrump}
            onRevealTrump={() => handleRevealTrump('SOUTH')}
            onPlayCard={handleHumanPlayCard}
            illegalMoveReason={illegalMoveReason}
            onIllegalMove={(reason) => {
              sound.playError();
              setIllegalMoveReason(reason);
              setTimeout(() => setIllegalMoveReason(null), 2500);
            }}
          />
        </div>
      </main>

      {/* 4. BIDDING MODAL PANEL */}
      {phase === 'BIDDING' && (
        <BiddingPanel
          currentBidder={currentBidder}
          currentHighestBid={currentHighestBid}
          highestBidder={highestBidder}
          players={players}
          isHumanTurn={currentBidder === 'SOUTH'}
          onBid={(amt) => handleBidSubmit('SOUTH', amt, false)}
          onPass={() => handleBidSubmit('SOUTH', 0, true)}
        />
      )}

      {/* 5. TRUMP SELECTION MODAL (HUMAN BIDDER) */}
      {phase === 'TRUMP_SELECTION' && highestBidder === 'SOUTH' && (
        <TrumpSelector
          hand={humanPlayer.hand}
          contractBid={currentHighestBid}
          onSelectTrump={handleHumanSelectTrump}
        />
      )}

      {/* 6. TRUMP REVEAL FULL ANIMATION */}
      {showTrumpRevealModal && trumpState.suit && (
        <TrumpRevealModal
          suit={trumpState.suit}
          card={trumpState.chosenCard}
          revealedBy={trumpState.revealedBy || 'SOUTH'}
          revealedByName={
            players.find((p) => p.id === trumpState.revealedBy)?.name || 'Unknown'
          }
          onDismiss={() => setShowTrumpRevealModal(false)}
        />
      )}

      {/* 7. HAND / MATCH RESULT MODAL */}
      {(phase === 'HAND_COMPLETE' || isMatchComplete) && handResult && (
        <ResultScreen
          handResult={handResult}
          matchScore={matchScore}
          isMatchComplete={isMatchComplete}
          matchWinner={matchWinner}
          onNextHand={handleNextHand}
          onRestartMatch={handleRestartMatch}
          onMainMenu={onMainMenu}
        />
      )}

      {/* 8. SETTINGS MODAL */}
      {showSettings && (
        <SettingsScreen
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          onClose={() => setShowSettings(false)}
          onRestartMatch={handleRestartMatch}
          onMainMenu={onMainMenu}
          isInGame={true}
        />
      )}

      {/* 9. TUTORIAL MODAL */}
      {showTutorial && <TutorialScreen onClose={() => setShowTutorial(false)} />}

      {/* 10. ABOUT MODAL */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
};
