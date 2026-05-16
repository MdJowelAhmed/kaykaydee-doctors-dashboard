import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getSpeechErrorMessage,
  getSpeechRecognitionCtor,
  isSpeechRecognitionSupported,
  type BrowserSpeechRecognition,
  type SpeechRecognitionResultEvent,
} from '../speechRecognition'

export type DictationStatus = 'idle' | 'listening' | 'paused' | 'error'

interface UseSpeechDictationOptions {
  lang?: string
  onError?: (message: string) => void
}

export function useSpeechDictation(options: UseSpeechDictationOptions = {}) {
  const { lang = 'en-AU', onError } = options

  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [status, setStatus] = useState<DictationStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)

  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null)
  const wantsListeningRef = useRef(false)
  const transcriptRef = useRef('')

  const supported = isSpeechRecognitionSupported()

  useEffect(() => {
    transcriptRef.current = transcript
  }, [transcript])

  useEffect(() => {
    if (status !== 'listening') return
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [status])

  const destroyRecognition = useCallback(() => {
    const rec = recognitionRef.current
    if (!rec) return
    rec.onresult = null
    rec.onerror = null
    rec.onend = null
    rec.onstart = null
    try {
      rec.abort()
    } catch {
      /* ignore */
    }
    recognitionRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      wantsListeningRef.current = false
      destroyRecognition()
    }
  }, [destroyRecognition])

  const appendFinalPhrase = useCallback((phrase: string) => {
    const trimmed = phrase.trim()
    if (!trimmed) return
    setTranscript((prev) => {
      const base = prev.trimEnd()
      if (!base) return trimmed
      const needsSpace = !/[.!?]$/.test(base)
      return `${base}${needsSpace ? ' ' : ' '}${trimmed}`
    })
  }, [])

  const createRecognition = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) return null

    const recognition = new Ctor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = lang
    recognition.maxAlternatives = 1

    recognition.onresult = (event: SpeechRecognitionResultEvent) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0]?.transcript ?? ''
        if (result.isFinal) {
          appendFinalPhrase(text)
        } else {
          interim += text
        }
      }
      setInterimTranscript(interim.trim())
    }

    recognition.onerror = (event) => {
      if (event.error === 'aborted') return
      if (event.error === 'no-speech' && wantsListeningRef.current) {
        return
      }
      const msg = getSpeechErrorMessage(event.error)
      setErrorMessage(msg)
      setStatus('error')
      wantsListeningRef.current = false
      onError?.(msg)
    }

    recognition.onend = () => {
      setInterimTranscript('')
      if (wantsListeningRef.current) {
        try {
          recognition.start()
        } catch {
          wantsListeningRef.current = false
          setStatus('idle')
        }
      } else {
        setStatus((s) => (s === 'listening' ? 'idle' : s))
      }
    }

    recognition.onstart = () => {
      setStatus('listening')
      setErrorMessage(null)
    }

    return recognition
  }, [appendFinalPhrase, lang, onError])

  const start = useCallback(() => {
    if (!supported) {
      const msg = 'Speech recognition is not supported in this browser. Use Chrome or Edge, or type your notes manually.'
      setErrorMessage(msg)
      setStatus('error')
      onError?.(msg)
      return
    }

    destroyRecognition()
    const recognition = createRecognition()
    if (!recognition) return

    recognitionRef.current = recognition
    wantsListeningRef.current = true
    setInterimTranscript('')
    setErrorMessage(null)
    setElapsed(0)

    try {
      recognition.start()
      setStatus('listening')
    } catch {
      const msg = 'Could not start microphone. Check permissions and try again.'
      setErrorMessage(msg)
      setStatus('error')
      onError?.(msg)
    }
  }, [createRecognition, destroyRecognition, onError, supported])

  const flushInterim = useCallback(() => {
    setInterimTranscript((interim) => {
      if (interim.trim()) appendFinalPhrase(interim)
      return ''
    })
  }, [appendFinalPhrase])

  const pause = useCallback(() => {
    wantsListeningRef.current = false
    flushInterim()
    const rec = recognitionRef.current
    if (rec) {
      try {
        rec.stop()
      } catch {
        /* ignore */
      }
    }
    setStatus('paused')
  }, [flushInterim])

  const stop = useCallback(() => {
    wantsListeningRef.current = false
    flushInterim()
    const rec = recognitionRef.current
    if (rec) {
      try {
        rec.stop()
      } catch {
        /* ignore */
      }
    }
    destroyRecognition()
    setStatus('idle')
  }, [destroyRecognition])

  const clear = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
    setErrorMessage(null)
    if (status === 'error') setStatus('idle')
  }, [status])

  const setTranscriptManual = useCallback((value: string) => {
    setTranscript(value)
    setInterimTranscript('')
  }, [])

  const isListening = status === 'listening'

  return {
    supported,
    transcript,
    interimTranscript,
    status,
    isListening,
    errorMessage,
    elapsed,
    start,
    pause,
    stop,
    clear,
    setTranscript: setTranscriptManual,
  }
}
