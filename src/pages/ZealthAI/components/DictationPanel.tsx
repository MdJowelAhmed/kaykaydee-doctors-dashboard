import { useState } from 'react'
import { Copy, Mic, MicOff, Pause, RotateCcw, Sparkles, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils/cn'
import { useSpeechDictation } from '../hooks/useSpeechDictation'
import { DICTATION_LANGUAGES } from '../speechRecognition'
import { formatDictationTranscript } from '../aiEngine'
import type { ZealthMessage } from '../types'

interface DictationPanelProps {
  history: ZealthMessage[]
  onSaveToChat: (content: string) => void
}

function formatElapsed(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function DictationPanel({ history, onSaveToChat }: DictationPanelProps) {
  const [language, setLanguage] = useState<string>('en-AU')
  const [output, setOutput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const dictation = useSpeechDictation({
    lang: language,
    onError: (msg) => toast.error(msg),
  })

  const fullPreview = [dictation.transcript, dictation.interimTranscript]
    .filter(Boolean)
    .join(dictation.transcript && dictation.interimTranscript ? ' ' : '')
    .trim()

  const wordCount = fullPreview ? fullPreview.split(/\s+/).filter(Boolean).length : 0

  const handleStart = () => {
    dictation.start()
    toast.message('Dictation started', {
      description: 'Speak clearly. Your words appear in the transcript below.',
    })
  }

  const handleStop = () => {
    dictation.stop()
    if (dictation.transcript.trim() || dictation.interimTranscript.trim()) {
      toast.success('Dictation stopped')
    }
  }

  const handleProcess = async () => {
    const raw = dictation.transcript.trim() || fullPreview
    if (!raw) {
      toast.error('Add or record dictation text first')
      return
    }
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 400))
    const formatted = formatDictationTranscript(raw, history)
    setOutput(formatted)
    setIsProcessing(false)
    toast.success('Dictation processed')
  }

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-lg font-semibold text-foreground">Start Dictation</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Use your microphone for live speech-to-text. Edit the transcript, then process it into
          clinical note format.
        </p>
      </div>

      <div className="space-y-5 p-5">
        {!dictation.supported ? (
          <div
            role="alert"
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100"
          >
            Speech recognition is not available in this browser. Use Chrome or Edge for live
            dictation, or type your notes in the box below.
          </div>
        ) : null}

        {dictation.errorMessage ? (
          <div
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {dictation.errorMessage}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2 sm:min-w-[200px]">
            <Label htmlFor="dictation-lang">Language</Label>
            <Select
              value={language}
              onValueChange={setLanguage}
              disabled={dictation.isListening}
            >
              <SelectTrigger id="dictation-lang" className="rounded-xl bg-input border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DICTATION_LANGUAGES.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!dictation.isListening && dictation.status !== 'paused' ? (
              <Button
                type="button"
                className="rounded-xl bg-[#6737BE] hover:bg-[#6737BE]/90"
                onClick={handleStart}
                disabled={!dictation.supported}
              >
                <Mic className="mr-2 h-4 w-4" />
                Start dictation
              </Button>
            ) : null}

            {dictation.isListening ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => dictation.pause()}
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="rounded-xl"
                  onClick={handleStop}
                >
                  <MicOff className="mr-2 h-4 w-4" />
                  Stop ({formatElapsed(dictation.elapsed)})
                </Button>
              </>
            ) : null}

            {dictation.status === 'paused' ? (
              <>
                <Button
                  type="button"
                  className="rounded-xl bg-[#6737BE] hover:bg-[#6737BE]/90"
                  onClick={handleStart}
                >
                  <Mic className="mr-2 h-4 w-4" />
                  Resume
                </Button>
                <Button type="button" variant="outline" className="rounded-xl" onClick={handleStop}>
                  Finish
                </Button>
              </>
            ) : null}

            <Button
              type="button"
              variant="ghost"
              className="rounded-xl"
              onClick={() => dictation.clear()}
              disabled={!dictation.transcript && !dictation.interimTranscript}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        {dictation.isListening ? (
          <div className="flex items-center gap-3 rounded-xl bg-[#6737BE]/10 px-4 py-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
            </span>
            <span className="text-sm font-medium text-foreground">Listening — speak now</span>
            <span className="ml-auto text-xs text-muted-foreground tabular-nums">
              {formatElapsed(dictation.elapsed)}
            </span>
          </div>
        ) : null}

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="dictation-transcript">Live transcript</Label>
            <span className="text-xs text-muted-foreground">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </span>
          </div>
          <Textarea
            id="dictation-transcript"
            value={
              dictation.isListening || dictation.interimTranscript
                ? fullPreview
                : dictation.transcript
            }
            onChange={(e) => {
              if (!dictation.isListening) {
                dictation.setTranscript(e.target.value)
              }
            }}
            readOnly={dictation.isListening}
            placeholder="Click Start dictation and speak, or type notes here…"
            className={cn(
              'min-h-[180px] resize-y rounded-xl border-0 bg-input font-medium leading-relaxed',
              dictation.isListening && 'cursor-default'
            )}
          />
          {dictation.interimTranscript && dictation.isListening ? (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-primary">Live:</span>{' '}
              <span className="italic">{dictation.interimTranscript}</span>
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="rounded-xl bg-[#6737BE] hover:bg-[#6737BE]/90"
            disabled={isProcessing || !fullPreview}
            onClick={() => void handleProcess()}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isProcessing ? 'Processing…' : 'Process dictation'}
          </Button>
          {output ? (
            <>
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => void handleCopy()}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  onSaveToChat(output)
                  toast.success('Saved to AI chat history')
                }}
              >
                Save to chat
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl"
                onClick={() => {
                  setOutput('')
                  toast.message('Output cleared')
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset output
              </Button>
            </>
          ) : null}
        </div>

        {output ? (
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Formatted clinical note
            </p>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
              {output}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  )
}
