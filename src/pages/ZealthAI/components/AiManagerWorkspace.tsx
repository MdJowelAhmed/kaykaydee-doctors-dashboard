import { useEffect, useState } from 'react'
import { Copy, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { AiManagerAction } from '../aiActions'
import { generateActionOutput } from '../aiEngine'
import type { ZealthMessage } from '../types'
import { DictationPanel } from './DictationPanel'

const ACTION_META: Record<
  AiManagerAction,
  { title: string; description: string; inputLabel: string; inputPlaceholder: string; cta: string }
> = {
  dictation: {
    title: 'Start Dictation',
    description: 'Record or type clinical notes. AI formats a transcript for your review.',
    inputLabel: 'Live notes / transcript',
    inputPlaceholder: 'Speak or type patient observations here…',
    cta: 'Process dictation',
  },
  report: {
    title: 'Create Report',
    description: 'Generate a structured clinical report draft from your session notes.',
    inputLabel: 'Presenting concern / session focus',
    inputPlaceholder: 'e.g. Mid-claim lumbar review, week 4',
    cta: 'Generate report',
  },
  summary: {
    title: 'Generate Summary',
    description: 'Condense lengthy notes into a short clinical summary.',
    inputLabel: 'Notes to summarize',
    inputPlaceholder: 'Paste SOAP notes or bullet points…',
    cta: 'Generate summary',
  },
  draft: {
    title: 'Draft',
    description: 'Quickly draft a follow-up note or message for the patient record.',
    inputLabel: 'Draft prompt',
    inputPlaceholder: 'e.g. Follow-up after exercise programme review',
    cta: 'Create draft',
  },
}

interface AiManagerWorkspaceProps {
  action: AiManagerAction
  history: ZealthMessage[]
  onSaveToChat: (content: string, action: AiManagerAction) => void
}

export function AiManagerWorkspace({ action, history, onSaveToChat }: AiManagerWorkspaceProps) {
  const meta = ACTION_META[action]
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    setInput('')
    setOutput('')
  }, [action])

  if (action === 'dictation') {
    return (
      <DictationPanel
        history={history}
        onSaveToChat={(content) => onSaveToChat(content, 'dictation')}
      />
    )
  }

  const handleGenerate = async () => {
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 500))
    const result = generateActionOutput(action, input, history)
    setOutput(result)
    setIsProcessing(false)
  }

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-lg font-semibold text-foreground">{meta.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{meta.description}</p>
      </div>

      <div className="space-y-5 p-5">
        {action === 'report' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report type</Label>
              <Input
                id="report-type"
                className="rounded-xl border-0 bg-input"
                defaultValue="Progress report"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-ref">Patient reference</Label>
              <Input
                id="patient-ref"
                className="rounded-xl border-0 bg-input"
                placeholder="PID646"
              />
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="ai-input">{meta.inputLabel}</Label>
          <Textarea
            id="ai-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={meta.inputPlaceholder}
            className="min-h-[140px] resize-y rounded-xl border-0 bg-input"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="rounded-xl bg-[#6737BE] hover:bg-[#6737BE]/90"
            disabled={isProcessing}
            onClick={() => void handleGenerate()}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isProcessing ? 'Working…' : meta.cta}
          </Button>
          {output ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => void handleCopy()}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  onSaveToChat(output, action)
                  toast.success('Saved to AI chat history')
                }}
              >
                Save to chat
              </Button>
            </>
          ) : null}
        </div>

        {output ? (
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Output
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
