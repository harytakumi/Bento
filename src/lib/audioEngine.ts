/* Mesin audio Bento Ceria! — efek suara Web Audio API murni & pembaca suara Bahasa Indonesia (Web Speech API) */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted = false;
  private speakingListeners = new Set<(speaking: boolean) => void>();
  private fallbackTimer: ReturnType<typeof setTimeout> | null = null;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {
        /* Abaikan jika browser belum mengizinkan resume */
      });
    }
    return this.ctx;
  }

  public unlock(): void {
    this.ensureContext();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.getVoices();
      } catch {
        /* Abaikan error inisialisasi voice */
      }
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stopSpeech();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public subscribeSpeaking(listener: (speaking: boolean) => void): () => void {
    this.speakingListeners.add(listener);
    return () => {
      this.speakingListeners.delete(listener);
    };
  }

  private notifySpeaking(speaking: boolean): void {
    this.speakingListeners.forEach((cb) => cb(speaking));
  }

  /* Bunyi pop ceria saat menyentuh makanan atau tombol */
  public playPop(): void {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(760, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  /* Nada ding-dong lembut saat pilihan tepat */
  public playDingDong(): void {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { freq: 659.25, start: 0, dur: 0.16 }, // E5
      { freq: 880.0, start: 0.12, dur: 0.28 }, // A5
    ];

    notes.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0.001, now + start);
      gain.gain.linearRampToValueAtTime(0.22, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.02);
    });
  }

  /* Bunyi boing lucu saat mencoba lagi */
  public playBoing(): void {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.25);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  /* Melodi fanfare ceria saat menyelesaikan 3 ronde mini-game */
  public playFanfare(): void {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const melody = [
      { freq: 523.25, start: 0.0, dur: 0.14 }, // C5
      { freq: 659.25, start: 0.13, dur: 0.14 }, // E5
      { freq: 783.99, start: 0.26, dur: 0.14 }, // G5
      { freq: 1046.5, start: 0.4, dur: 0.42 }, // C6
    ];

    melody.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0.001, now + start);
      gain.gain.linearRampToValueAtTime(0.24, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.02);
    });
  }

  public stopSpeech(): void {
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* Abaikan */
      }
    }
    this.notifySpeaking(false);
  }

  /* Membacakan teks Bahasa Indonesia secara otomatis dan membatalkan suara sebelumnya agar tidak bertumpuk */
  public speak(text: string): void {
    const clean = text.trim();
    if (!clean) return;

    this.stopSpeech();

    if (this.isMuted) {
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.notifySpeaking(true);
      this.fallbackTimer = setTimeout(() => this.notifySpeaking(false), 1800);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'id-ID';
      utterance.rate = 0.88; // Tempo agak lambat agar mudah dipahami anak TK
      utterance.pitch = 1.15; // Nada ceria

      const voices = window.speechSynthesis.getVoices();
      const idVoice =
        voices.find((v) => v.lang.toLowerCase() === 'id-id') ||
        voices.find((v) => v.lang.toLowerCase().startsWith('id'));
      if (idVoice) {
        utterance.voice = idVoice;
      }

      utterance.onstart = () => {
        this.notifySpeaking(true);
      };
      utterance.onend = () => {
        if (this.fallbackTimer) {
          clearTimeout(this.fallbackTimer);
          this.fallbackTimer = null;
        }
        this.notifySpeaking(false);
      };
      utterance.onerror = () => {
        if (this.fallbackTimer) {
          clearTimeout(this.fallbackTimer);
          this.fallbackTimer = null;
        }
        this.notifySpeaking(false);
      };

      window.speechSynthesis.speak(utterance);

      // Pengaman jika browser tertentu tidak memicu onend
      const approxMs = Math.min(7000, Math.max(1600, clean.length * 85));
      this.fallbackTimer = setTimeout(() => {
        this.notifySpeaking(false);
      }, approxMs);
    } catch {
      this.notifySpeaking(false);
    }
  }
}

export const audioEngine = new AudioEngine();
