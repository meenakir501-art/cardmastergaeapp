// Hindi Speech Synthesis Engine for 28 Card Master

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

class SpeechEngine {
  public voiceEnabled: boolean = true;
  private cachedVoice: SpeechSynthesisVoice | null = null;
  private lastAnnouncedText: string | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoice();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoice();
      };
    }
  }

  private initVoice() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    // Prioritize Hindi Indian voices
    const hiVoice = voices.find(
      (v) =>
        v.lang === 'hi-IN' ||
        v.lang === 'hi_IN' ||
        v.lang.toLowerCase().includes('hi')
    );
    if (hiVoice) {
      this.cachedVoice = hiVoice;
    }
  }

  /**
   * Speaks the submitted bid aloud in Hindi:
   * e.g. "Guest1234565 ने अठारह की बोली लगाई।"
   * Or when passing:
   * e.g. "Guest7821943 पास।"
   */
  public speakBid(playerName: string, amount: number, isPass: boolean) {
    if (!this.voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    try {
      let text = '';
      if (isPass) {
        text = `${playerName} पास।`;
      } else {
        const hindiWord = HINDI_BID_NUMBERS[amount] || amount.toString();
        text = `${playerName} ने ${hindiWord} की बोली लगाई।`;
      }

      // Avoid immediate duplicate speech
      if (text === this.lastAnnouncedText) {
        return;
      }
      this.lastAnnouncedText = text;
      setTimeout(() => {
        this.lastAnnouncedText = null;
      }, 1500);

      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      if (!this.cachedVoice) {
        this.initVoice();
      }
      if (this.cachedVoice) {
        utterance.voice = this.cachedVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // SpeechSynthesis error catch
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speech = new SpeechEngine();
