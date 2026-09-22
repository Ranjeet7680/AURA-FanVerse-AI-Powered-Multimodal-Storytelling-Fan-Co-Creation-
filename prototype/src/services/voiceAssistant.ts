// Voice-to-Voice (V2V) and Text-to-Voice (T2V) speech service using Web Speech APIs
// Native multi-language support for: English (en-US), Hindi (hi-IN), Spanish (es-ES), Arabic (ar-SA), Tamil (ta-IN)

import { SUPPORTED_LANGUAGES, type LanguageConfig } from '../data/tacticalLocalization';

export class VoiceAssistantEngine {
  private recognitionInstance: any = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  public isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  public isSpeechSynthesisSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window;
  }

  // Find best matching system voice for a given language code
  public getBestVoiceForLang(langCode: string): SpeechSynthesisVoice | null {
    if (!this.isSpeechSynthesisSupported()) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const langConf: LanguageConfig = SUPPORTED_LANGUAGES[langCode] || SUPPORTED_LANGUAGES.en;
    const hints = langConf.voiceLangHints;

    // 1. Exact match on BCP-47 tag
    for (const hint of hints) {
      const match = voices.find((v) => v.lang.toLowerCase() === hint.toLowerCase());
      if (match) return match;
    }

    // 2. Prefix match (e.g. 'hi' in 'hi-IN', 'ta' in 'ta-IN')
    for (const hint of hints) {
      const match = voices.find((v) => v.lang.toLowerCase().startsWith(hint.toLowerCase()));
      if (match) return match;
    }

    // 3. Fallback to any voice with language name in it
    const nameMatch = voices.find((v) =>
      v.name.toLowerCase().includes(langConf.name.toLowerCase())
    );
    if (nameMatch) return nameMatch;

    return null;
  }

  // Text-to-Voice: Speaks given text aloud with native language accent & pitch
  public speakText(
    text: string,
    langCode: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: () => void
  ): boolean {
    if (!this.isSpeechSynthesisSupported()) {
      onError?.();
      return false;
    }

    try {
      window.speechSynthesis.cancel();

      const langConf = SUPPORTED_LANGUAGES[langCode] || SUPPORTED_LANGUAGES.en;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langConf.bcp47;
      utterance.rate = langCode === 'ta' || langCode === 'hi' ? 0.95 : 1.02;
      utterance.pitch = 1.02;

      const voice = this.getBestVoiceForLang(langCode);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        onEnd?.();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        onError?.();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      onError?.();
      return false;
    }
  }

  // Cancel currently playing speech
  public stopSpeaking() {
    if (this.isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return !!this.currentUtterance;
  }

  // Voice-to-Voice Speech Recognition listener
  public startListening(
    langCode: string,
    onResult: (transcript: string) => void,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: any) => void
  ): boolean {
    if (!this.isSpeechRecognitionSupported()) return false;

    try {
      this.stopListening();

      const SpeechRecognitionClass =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      const recognition = new SpeechRecognitionClass();
      const langConf = SUPPORTED_LANGUAGES[langCode] || SUPPORTED_LANGUAGES.en;

      recognition.lang = langConf.bcp47;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        onStart?.();
      };

      recognition.onresult = (event: any) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          onResult(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        onError?.(event);
      };

      recognition.onend = () => {
        this.recognitionInstance = null;
        onEnd?.();
      };

      this.recognitionInstance = recognition;
      recognition.start();
      return true;
    } catch (err) {
      onError?.(err);
      return false;
    }
  }

  public stopListening() {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.abort();
      } catch {
        // ignore
      }
      this.recognitionInstance = null;
    }
  }
}

export const voiceAssistant = new VoiceAssistantEngine();
