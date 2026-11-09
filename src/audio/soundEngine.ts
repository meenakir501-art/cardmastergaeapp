class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public voiceEnabled: boolean = true;
  public vibrationEnabled: boolean = true;

  private cardFlipBuffer: AudioBuffer | null = null;
  private cardFlipLoading: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    this.preloadCardFlipAudio();
  }

  private preloadCardFlipAudio() {
    if (this.cardFlipBuffer || this.cardFlipLoading || typeof window === 'undefined') return;
    this.cardFlipLoading = true;
    fetch('/assets/aistudio/freesound_community-flipcard-91468_1c04e419.mp3')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load card flip sound');
        return res.arrayBuffer();
      })
      .then((arrayBuffer) => {
        if (!this.ctx) return;
        return this.ctx.decodeAudioData(arrayBuffer);
      })
      .then((decoded) => {
        if (decoded) {
          this.cardFlipBuffer = decoded;
        }
      })
      .catch(() => {
        // Fallback handled in playCardFlip
      })
      .finally(() => {
        this.cardFlipLoading = false;
      });
  }

  public vibrate(pattern: number | number[]) {
    if (!this.vibrationEnabled || typeof window === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors
    }
  }

  /**
   * 1. Card Shuffling Sound
   * Riffle shuffle simulation: rapid interleaved paper fluttering noise bursts
   */
  public playCardShuffle() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const numFlicks = 18;
      for (let i = 0; i < numFlicks; i++) {
        const time = now + (i * 0.022) + (Math.random() * 0.008);
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.025);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize * 0.25));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800 + Math.random() * 800, time);
        filter.Q.setValueAtTime(3.5, time);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.14 + (i / numFlicks) * 0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(time);
      }
      this.vibrate([10, 20, 10, 20, 10]);
    } catch {
      // Audio error catch
    }
  }

  /**
   * Real Physical Playing Card Flip / Deal / Place Sound
   * Plays the authentic recorded card flip MP3 (freesound_community-flipcard-91468_1c04e419.mp3)
   * Completely replaces the synthetic "kit kit" noise.
   */
  public playCardFlip(playbackRate: number = 1.0, volume: number = 0.95) {
    if (!this.enabled) return;
    this.initCtx();

    const variedRate = playbackRate * (0.97 + Math.random() * 0.06);

    if (this.cardFlipBuffer && this.ctx) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = this.cardFlipBuffer;
        source.playbackRate.setValueAtTime(variedRate, this.ctx.currentTime);

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);

        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(0);
        this.vibrate(15);
        return;
      } catch {
        // Fallback to HTML Audio
      }
    }

    // Direct HTML Audio fallback for instant response
    try {
      const audio = new Audio('/assets/aistudio/freesound_community-flipcard-91468_1c04e419.mp3');
      audio.volume = Math.min(1.0, Math.max(0.1, volume));
      audio.playbackRate = variedRate;
      audio.play().catch(() => {});
      this.vibrate(15);
    } catch {
      // Audio play error catch
    }
  }

  /**
   * 2. Card Dealt One by One
   * Uses real recorded card flip sound instead of synthetic kit-kit clicks
   */
  public playCardDeal(variation: number = 0) {
    this.playCardFlip(1.0 + (variation % 4) * 0.04, 0.92);
  }

  /**
   * Deal sequence: smooth physical card distribution with real card flip sound
   */
  public playDealSequence(count: number = 4, intervalMs: number = 180) {
    if (!this.enabled) return;
    const deals = Math.min(count, 4);
    for (let i = 0; i < deals; i++) {
      setTimeout(() => {
        this.playCardDeal(i);
      }, i * intervalMs);
    }
  }

  /**
   * 3. Card Sliding Across a Table
   * Smooth friction of card sliding across wool casino felt
   */
  public playCardSlide() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.09);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.linearRampToValueAtTime(1600, now + 0.09);
      filter.Q.setValueAtTime(2.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch {
      // Audio error catch
    }
  }

  /**
   * 4. Card Being Placed On The Table
   * Uses the authentic recorded card flip MP3 sound
   */
  public playCardPlace() {
    this.playCardFlip(1.0, 0.95);
  }

  /**
   * 5. Four Cards Being Collected After a Trick
   * Gathering cards: multiple quick paper sweeps followed by a clean stack thump
   */
  public playTrickCollect() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Quick gathering sweeps
      [0, 0.04, 0.08, 0.12].forEach((offset, idx) => {
        if (!this.ctx) return;
        const time = now + offset;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.03);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400 + idx * 200, time);
        filter.Q.setValueAtTime(3.0, time);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(time);
      });

      // Final stack squaring thump
      const thumpTime = now + 0.16;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, thumpTime);
      osc.frequency.exponentialRampToValueAtTime(60, thumpTime + 0.08);

      oscGain.gain.setValueAtTime(0.28, thumpTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, thumpTime + 0.08);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(thumpTime);
      osc.stop(thumpTime + 0.09);

      this.vibrate([15, 30]);
    } catch {
      // Audio error catch
    }
  }

  /**
   * 6. Button Press Sound
   * Mechanical tactile switch click
   */
  public playButtonPress() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.035);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
      this.vibrate(8);
    } catch {
      // Audio error catch
    }
  }

  // Alias for backward compatibility
  public playClick() {
    this.playButtonPress();
  }

  public playCardSnap() {
    this.playCardPlace();
  }

  public playTrumpReveal() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.4);
      });
      this.vibrate([40, 60, 80]);
    } catch {
      // Audio error catch
    }
  }

  public playTrickWin() {
    this.playTrickCollect();
  }

  public playBidSound() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.1);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch {
      // Audio error catch
    }
  }

  public playVictory() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [
        { f: 523.25, d: 0.15 },
        { f: 659.25, d: 0.15 },
        { f: 783.99, d: 0.15 },
        { f: 1046.5, d: 0.45 },
      ];
      let t = this.ctx.currentTime;
      notes.forEach((note) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.24, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + note.d);
        t += note.d * 0.85;
      });
      this.vibrate([80, 50, 120, 50, 200]);
    } catch {
      // Audio error catch
    }
  }

  public playDefeat() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [
        { f: 440, d: 0.2 },
        { f: 415.3, d: 0.2 },
        { f: 392, d: 0.2 },
        { f: 349.23, d: 0.5 },
      ];
      let t = this.ctx.currentTime;
      notes.forEach((note) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + note.d);
        t += note.d * 0.9;
      });
      this.vibrate([100, 100, 150]);
    } catch {
      // Audio error catch
    }
  }

  public playError() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(140, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
      this.vibrate([40, 30, 40]);
    } catch {
      // Audio error catch
    }
  }
}

export const sound = new SoundEngine();
