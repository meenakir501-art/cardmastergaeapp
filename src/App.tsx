import React, { useEffect, useState } from 'react';
import { sound } from './audio/soundEngine';
import { AboutModal } from './components/AboutModal';
import { RewardedAdModal } from './components/ads/RewardedAdModal';
import { GameScreen } from './components/GameScreen';
import { MainMenu } from './components/MainMenu';
import { MatchmakingScreen } from './components/MatchmakingScreen';
import { OnlineRoomModal } from './components/OnlineRoomModal';
import { SettingsScreen } from './components/SettingsScreen';
import { TutorialScreen } from './components/TutorialScreen';
import { GameSettings, HUMAN_AVATAR_OPTIONS, PlayerId } from './types/game';
import { generateGuestName } from './utils/guestName';

const DEFAULT_SETTINGS: GameSettings = {
  difficulty: 'MEDIUM',
  soundEnabled: true,
  voiceEnabled: true,
  vibrationEnabled: true,
  animationSpeed: 'NORMAL',
  cardBack: 'BLUE',
  playerName: generateGuestName(),
  playerAvatar: HUMAN_AVATAR_OPTIONS[0].url,
};

export default function App() {
  const [screen, setScreen] = useState<'MENU' | 'MATCHMAKING' | 'GAME'>('MENU');
  const [isQuickPlay, setIsQuickPlay] = useState<boolean>(false);
  const [onlineRoomCode, setOnlineRoomCode] = useState<string | null>(null);
  const [seatAssignments, setSeatAssignments] = useState<
    Record<PlayerId, { name: string; isAI: boolean; avatar: string }> | null
  >(null);

  // Settings with localStorage persistence and Guest username enforcement
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('28_card_master_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Enforce Guest + 7 digits format, discarding any legacy personal names
        if (!parsed.playerName || !/^Guest\d{7}$/.test(parsed.playerName)) {
          parsed.playerName = generateGuestName();
        }
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch {
      // LocalStorage error fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Modals on Main Menu
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showTutorialModal, setShowTutorialModal] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [showOnlineRoomModal, setShowOnlineRoomModal] = useState<boolean>(false);
  const [showRewardedAdModal, setShowRewardedAdModal] = useState<boolean>(false);

  // Sync sound engine enabled flag
  useEffect(() => {
    sound.enabled = settings.soundEnabled;
    sound.vibrationEnabled = settings.vibrationEnabled;
  }, [settings.soundEnabled, settings.vibrationEnabled]);

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('28_card_master_settings', JSON.stringify(updated));
      } catch {
        // LocalStorage error fallback
      }
      return updated;
    });
  };

  const handleStartGame = () => {
    sound.playClick();
    setIsQuickPlay(false);
    setOnlineRoomCode(null);
    setSeatAssignments(null);
    // Every new game session generates a fresh unique Guest username
    const freshGuest = generateGuestName();
    updateSettings({ playerName: freshGuest });
    // Immediately start offline game with 3 AI players - no matchmaking or searching delay
    setScreen('GAME');
  };

  const handleMatchFound = (
    roomCode: string,
    seats: Record<PlayerId, { name: string; isAI: boolean; avatar: string }>
  ) => {
    setOnlineRoomCode(roomCode);
    setSeatAssignments(seats);
    setIsQuickPlay(false);
    setScreen('GAME');
  };

  const handlePlayOffline = () => {
    sound.playClick();
    setIsQuickPlay(false);
    setOnlineRoomCode(null);
    setSeatAssignments(null);
    const freshGuest = generateGuestName();
    updateSettings({ playerName: freshGuest });
    setScreen('GAME');
  };

  const handleQuickPlay = () => {
    sound.playClick();
    setIsQuickPlay(true);
    setOnlineRoomCode(null);
    setSeatAssignments(null);
    // Every new game session generates a fresh unique Guest username
    const freshGuest = generateGuestName();
    updateSettings({ playerName: freshGuest });
    setScreen('GAME');
  };

  const handleStartRoomGame = (
    roomCode: string,
    seats: Record<PlayerId, { name: string; isAI: boolean; avatar: string }>
  ) => {
    sound.playClick();
    setOnlineRoomCode(roomCode);
    setSeatAssignments(seats);
    setShowOnlineRoomModal(false);
    setIsQuickPlay(false);
    // Ensure room session host uses their room guest identity
    if (seats.SOUTH?.name) {
      updateSettings({ playerName: seats.SOUTH.name });
    }
    setScreen('GAME');
  };

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] bg-black flex items-center justify-center overflow-hidden">
      {/* 9:16 Portrait Canvas Container */}
      <div className="relative w-full h-full max-h-[100dvh] sm:max-w-md sm:h-[94vh] sm:max-h-[900px] sm:rounded-3xl sm:border-4 sm:border-amber-900/40 shadow-2xl overflow-hidden flex flex-col">
        {screen === 'MENU' ? (
          <MainMenu
            onStartGame={handleStartGame}
            onQuickPlay={handleQuickPlay}
            onOpenOnlineRoom={() => setShowOnlineRoomModal(true)}
            onOpenTutorial={() => setShowTutorialModal(true)}
            onOpenSettings={() => setShowSettingsModal(true)}
            onOpenAbout={() => setShowAboutModal(true)}
            onWatchRewardedAd={() => setShowRewardedAdModal(true)}
            soundEnabled={settings.soundEnabled}
            onToggleSound={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          />
        ) : screen === 'MATCHMAKING' ? (
          <MatchmakingScreen
            settings={settings}
            onMatchFound={handleMatchFound}
            onCancel={() => setScreen('MENU')}
            onPlayOfflineFallback={handlePlayOffline}
          />
        ) : (
          <GameScreen
            settings={settings}
            onUpdateSettings={updateSettings}
            onMainMenu={() => {
              setOnlineRoomCode(null);
              setSeatAssignments(null);
              setScreen('MENU');
            }}
            isQuickPlay={isQuickPlay}
            onlineRoomCode={onlineRoomCode}
            seatAssignments={seatAssignments}
          />
        )}

        {/* Global Modals from Menu */}
        {showTutorialModal && (
          <TutorialScreen onClose={() => setShowTutorialModal(false)} />
        )}

        {showOnlineRoomModal && (
          <OnlineRoomModal
            onClose={() => setShowOnlineRoomModal(false)}
            onStartRoomGame={handleStartRoomGame}
            settings={settings}
          />
        )}

        {showSettingsModal && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={updateSettings}
            onClose={() => setShowSettingsModal(false)}
            onRestartMatch={() => {}}
            onMainMenu={() => setScreen('MENU')}
            isInGame={false}
          />
        )}

        {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)} />}

        {/* Google AdMob Rewarded Video Ad Modal (ca-app-pub-3940256099942544/5224354917) */}
        <RewardedAdModal
          isOpen={showRewardedAdModal}
          onClose={() => setShowRewardedAdModal(false)}
        />
      </div>
    </div>
  );
}
