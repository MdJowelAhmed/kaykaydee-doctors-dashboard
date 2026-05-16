/** Web Speech API helpers (Chrome, Edge, Safari). */

export type SpeechRecognitionErrorCode =
  | 'no-speech'
  | 'audio-capture'
  | 'not-allowed'
  | 'network'
  | 'aborted'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'language-not-supported'
  | string

export interface SpeechRecognitionResultEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

export interface BrowserSpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onaudiostart: ((ev: Event) => void) | null
  onaudioend: ((ev: Event) => void) | null
  onstart: ((ev: Event) => void) | null
  onend: ((ev: Event) => void) | null
  onerror: ((ev: Event & { error: SpeechRecognitionErrorCode; message?: string }) => void) | null
  onresult: ((ev: SpeechRecognitionResultEvent) => void) | null
}

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

export function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionCtor() != null
}

export function getSpeechErrorMessage(code: SpeechRecognitionErrorCode): string {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone access was denied. Allow the mic in your browser settings and try again.'
    case 'no-speech':
      return 'No speech detected. Move closer to the microphone and try again.'
    case 'audio-capture':
      return 'No microphone found. Connect a microphone and try again.'
    case 'network':
      return 'Network error during speech recognition. Check your connection.'
    case 'aborted':
      return 'Dictation was stopped.'
    case 'language-not-supported':
      return 'Selected language is not supported for dictation.'
    default:
      return `Speech recognition error: ${code}`
  }
}

export const DICTATION_LANGUAGES = [
  { value: 'en-AU', label: 'English (Australia)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
] as const
