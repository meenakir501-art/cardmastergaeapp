/**
 * Hindi Speech Synthesis for 28 Card Master Game
 * STRICT REQUIREMENT:
 * Speaks ONLY the Hindi number word for accepted bids submitted by the HUMAN player (ME).
 * Examples: 16 = "सोलह", 18 = "अठारह", 20 = "बीस", 21 = "इक्कीस", 25 = "पच्चीस", 28 = "अट्ठाईस".
 * - NO Guest numbers or player names.
 * - NO sentences like "Guest ने बोली लगाई".
 * - AI bids remain completely silent.
 * - PASS remains completely silent.
 * - Rejected bids remain silent.
 * - Stepper/slider adjustments remain silent.
 */

export const HINDI_BID_NUMBERS: Record<number, string> = {
  16: 'सोलह',
  17: 'सत्रह',
  18: 'अठारह',
  19: 'उन्नीस',
  20: 'बीस',
  21: 'इक्कीस',
  22: 'बाईस',
  23: 'तेईस',
  24: 'चौबीस',
  25: 'पच्चीस',
  26: 'छब्बीस',
  27: 'सत्ताईस',
  28: 'अट्ठाईस',
};

class HindiSpeechAnnouncer {
  private lastAnnouncedNumber: number | null = null;
  private lastAnnouncedTime: number = 0;

  /**
   * Speaks ONLY the Hindi word for the human player's accepted bid amount.
   */
  public speakHumanBidNumber(amount: number, voiceEnabled: boolean = true): void {
    if (!voiceEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (amount < 16 || amount > 28) return;

    const hindiWord = HINDI_BID_NUMBERS[amount];
    if (!hindiWord) return;

    // Prevent duplicate announcement of same bid within 600ms
    const now = Date.now();
    if (this.lastAnnouncedNumber === amount && now - this.lastAnnouncedTime < 600) {
      return;
    }
    this.lastAnnouncedNumber = amount;
    this.lastAnnouncedTime = now;

    try {
      // Cancel previous speech to prevent backlog or overlap
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(hindiWord);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Select hi-IN voice if available in browser
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice =
        voices.find((v) => v.lang === 'hi-IN' || v.lang === 'hi_IN') ||
        voices.find((v) => v.lang.startsWith('hi')) ||
        voices.find((v) => v.name.toLowerCase().includes('hindi'));

      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Silent fallback
    }
  }

  public reset(): void {
    this.lastAnnouncedNumber = null;
    this.lastAnnouncedTime = 0;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }
}

export const hindiSpeech = new HindiSpeechAnnouncer();
