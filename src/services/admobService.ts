/**
 * Google AdMob Integration Service
 * Configured with official Google AdMob Test Ad Units requested by user:
 * - Banner Test Ad Unit: ca-app-pub-3940256099942544/6300978111
 * - Rewarded Video Test Ad Unit: ca-app-pub-3940256099942544/5224354917
 */

export const ADMOB_CONFIG = {
  BANNER_TEST_ID: 'ca-app-pub-3940256099942544/6300978111',
  REWARDED_TEST_ID: 'ca-app-pub-3940256099942544/5224354917',
  INTERSTITIAL_TEST_ID: 'ca-app-pub-3940256099942544/1033173712',
  REWARD_AMOUNT: 500, // +500 Coins for watching a Rewarded Ad
};

const COIN_STORAGE_KEY = '28_card_master_coins';
const DEFAULT_COINS = 1200;

class AdMobService {
  private coins: number = DEFAULT_COINS;
  private coinListeners: Array<(coins: number) => void> = [];

  constructor() {
    this.initCoins();
  }

  private initCoins() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(COIN_STORAGE_KEY);
      if (stored !== null) {
        const val = parseInt(stored, 10);
        this.coins = isNaN(val) ? DEFAULT_COINS : Math.max(0, val);
      } else {
        this.coins = DEFAULT_COINS;
        localStorage.setItem(COIN_STORAGE_KEY, String(this.coins));
      }
    } catch {
      this.coins = DEFAULT_COINS;
    }
  }

  public getCoins(): number {
    return this.coins;
  }

  public addCoins(amount: number): number {
    this.coins = Math.max(0, this.coins + amount);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(COIN_STORAGE_KEY, String(this.coins));
      } catch {
        // LocalStorage fallback
      }
    }
    this.notifyCoinListeners();
    return this.coins;
  }

  public subscribeCoins(listener: (coins: number) => void): () => void {
    this.coinListeners.push(listener);
    listener(this.coins);
    return () => {
      this.coinListeners = this.coinListeners.filter((l) => l !== listener);
    };
  }

  private notifyCoinListeners() {
    for (const listener of this.coinListeners) {
      try {
        listener(this.coins);
      } catch {
        // Listener error catch
      }
    }
  }

  /**
   * Checks if running inside an Android WebView / Cordova / Capacitor environment with native AdMob
   */
  public hasNativeAdMob(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as unknown as { admob?: unknown; AdMob?: unknown; AndroidBridge?: unknown };
    return !!(win.admob || win.AdMob || win.AndroidBridge);
  }
}

export const admobService = new AdMobService();
