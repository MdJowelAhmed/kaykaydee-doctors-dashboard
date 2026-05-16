import { useMemo, useRef } from 'react'
import { Bot, SendHorizonal, Trash2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { ZealthMessage } from '../types'

function formatTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

interface AiManagerChatProps {
  messages: ZealthMessage[]
  draft: string
  isTyping: boolean
  onDraftChange: (value: string) => void
  onSend: () => void
  onClear: () => void
}

export function AiManagerChat({
  messages,
  draft,
  isTyping,
  onDraftChange,
  onSend,
  onClear,
}: AiManagerChatProps) {
  const listRef = useRef<HTMLDivElement | null>(null)

  const recentPrompts = useMemo(
    () => messages.filter((m) => m.role === 'user').slice(-6).reverse(),
    [messages]
  )

  return (
    <div className="flex min-h-[560px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[1fr_260px]">
        <div className="flex min-h-[480px] flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6737BE]/20 to-[#E055FA]/20">
                <Bot className="h-5 w-5 text-[#6737BE]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Ask Your AI</p>
                <p className="text-xs text-muted-foreground">Free-form assistant</p>
              </div>
            </div>
            <Button type="button" variant="outline" className="rounded-xl" onClick={onClear}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>

          <div ref={listRef} className="flex-1 overflow-auto px-5 py-8">
            {messages.length <= 1 ? (
              <div className="mx-auto max-w-lg py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6737BE]/15 to-[#E055FA]/15">
                  <Bot className="h-7 w-7 text-[#6737BE]" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-foreground">Where should we start?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pick an action on the left or type a question below.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => {
                  const isUser = m.role === 'user'
                  return (
                    <div
                      key={m.id}
                      className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
                    >
                      <div
                        className={cn(
                          'max-w-[720px] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
                          isUser ? 'bg-[#6737BE] text-white' : 'bg-muted text-foreground'
                        )}
                      >
                        {m.content}
                        <div
                          className={cn(
                            'mt-2 text-[11px]',
                            isUser ? 'text-white/80' : 'text-muted-foreground'
                          )}
                        >
                          {formatTime(m.createdAt)}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {isTyping ? (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-muted px-4 py-3">
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/50" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:120ms]" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:240ms]" />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="border-t border-border p-4">
            <div className="flex items-end gap-3">
              <Textarea
                value={draft}
                onChange={(e) => onDraftChange(e.target.value)}
                placeholder="Ask a follow-up"
                className="min-h-[52px] max-h-[140px] resize-none rounded-2xl border-0 bg-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    onSend()
                  }
                }}
              />
              <Button
                type="button"
                onClick={onSend}
                disabled={!draft.trim() || isTyping}
                className="h-12 w-12 rounded-xl bg-[#6737BE] p-0 hover:bg-[#6737BE]/90"
                aria-label="Send"
              >
                <SendHorizonal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-muted/20 p-5 xl:border-l xl:border-t-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recent prompts
          </p>
          <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto scrollbar-thin">
            {recentPrompts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No prompts yet.</p>
            ) : (
              recentPrompts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="w-full rounded-xl border border-border bg-card p-3 text-left transition-colors hover:bg-muted/50"
                  onClick={() => onDraftChange(p.content)}
                >
                  <p className="line-clamp-2 text-sm text-foreground">{p.content}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{formatTime(p.createdAt)}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

