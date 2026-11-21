// Interactive Web Audio and Speech Synthesis engine for Voice Campaigns

class VoiceEngine {
  private synth: SpeechSynthesis | null = null;
  private isSpeaking: boolean = false;
  private onStateChange: ((speaking: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public playVoice(
    text: string,
    gender: 'male' | 'female',
    style: 'executive' | 'sales' | 'consultant',
    language: 'english' | 'urdu',
    onEnd?: () => void
  ) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      if (onEnd) setTimeout(onEnd, 3000);
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set language code
    if (language === 'urdu') {
      utterance.lang = 'ur-PK';
    } else {
      utterance.lang = 'en-US';
    }

    // Adjust rate and pitch based on gender and style
    if (gender === 'female') {
      utterance.pitch = style === 'sales' ? 1.2 : style === 'executive' ? 1.05 : 1.1;
    } else {
      utterance.pitch = style === 'executive' ? 0.85 : style === 'sales' ? 0.95 : 0.9;
    }

    if (style === 'sales') {
      utterance.rate = 1.08;
    } else if (style === 'consultant') {
      utterance.rate = 0.96;
    } else {
      utterance.rate = 1.0;
    }

    // Try to pick appropriate voice if available
    const voices = this.synth.getVoices();
    if (voices.length > 0) {
      const match = voices.find((v) => {
        if (language === 'urdu' && (v.lang.startsWith('ur') || v.name.toLowerCase().includes('urdu'))) {
          return true;
        }
        if (language === 'english') {
          if (gender === 'female') {
            return (
              v.lang.startsWith('en') &&
              (v.name.toLowerCase().includes('female') ||
                v.name.toLowerCase().includes('samantha') ||
                v.name.toLowerCase().includes('zira') ||
                v.name.toLowerCase().includes('karen') ||
                v.name.toLowerCase().includes('victoria'))
            );
          } else {
            return (
              v.lang.startsWith('en') &&
              (v.name.toLowerCase().includes('male') ||
                v.name.toLowerCase().includes('david') ||
                v.name.toLowerCase().includes('daniel') ||
                v.name.toLowerCase().includes('george') ||
                v.name.toLowerCase().includes('alex'))
            );
          }
        }
        return false;
      });

      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onStateChange) this.onStateChange(true);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange(false);
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange(false);
    }
  }

  public getIsSpeaking() {
    return this.isSpeaking;
  }

  public registerStateChange(cb: (speaking: boolean) => void) {
    this.onStateChange = cb;
  }
}

export const voiceEngine = new VoiceEngine();
