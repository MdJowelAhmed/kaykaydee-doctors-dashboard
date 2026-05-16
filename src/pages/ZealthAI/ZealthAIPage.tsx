import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { createId } from '@/utils/id'
import { generateZealthResponse } from './aiEngine'
import { clearZealthChat, loadZealthChat, saveZealthChat } from './storage'
import type { ZealthMessage } from './types'
import { isAiManagerAction, type AiManagerAction } from './aiActions'
import { AiManagerActionPanel } from './components/AiManagerActionPanel'
import { AiManagerChat } from './components/AiManagerChat'
import { AiManagerWorkspace } from './components/AiManagerWorkspace'

function initialMessages(): ZealthMessage[] {
  const saved = loadZealthChat()
  if (saved?.messages?.length) return saved.messages
  return [
    {
      id: createId(),
      role: 'assistant',
      content: 'Hi! I’m AI Manager. Choose an action on the left or ask me anything in chat.',
      createdAt: new Date().toISOString(),
    },
  ]
}

export default function ZealthAIPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const actionParam = searchParams.get('action')
  const activeAction = isAiManagerAction(actionParam) ? actionParam : null

  const [messages, setMessages] = useState<ZealthMessage[]>(initialMessages)
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [clearOpen, setClearOpen] = useState(false)

  useEffect(() => {
    saveZealthChat({ messages })
  }, [messages])

  const setAction = (action: AiManagerAction | null) => {
    if (action) {
      setSearchParams({ action })
    } else {
      setSearchParams({})
    }
  }

  const appendMessage = (role: ZealthMessage['role'], content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: createId(), role, content, createdAt: new Date().toISOString() },
    ])
  }

  const handleSaveToChat = (content: string, action: AiManagerAction) => {
    appendMessage('assistant', `[${action}]\n\n${content}`)
    setAction(null)
  }

  const sendMessage = async () => {
    const text = draft.trim()
    if (!text || isTyping) return

    const userMsg: ZealthMessage = {
      id: createId(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMsg])
    setDraft('')
    setIsTyping(true)

    await new Promise((r) => setTimeout(r, 650))

    setMessages((prev) => {
      const replyText = generateZealthResponse(text, [...prev, userMsg])
      return [
        ...prev,
        {
          id: createId(),
          role: 'assistant',
          content: replyText,
          createdAt: new Date().toISOString(),
        },
      ]
    })
    setIsTyping(false)
  }

  const handleClear = () => {
    clearZealthChat()
    setMessages(initialMessages())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Manager</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dictation, reports, summaries, and drafts powered by Zealth AI
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(240px,280px)_1fr] lg:items-start">
        <div className="lg:sticky lg:top-4">
          <AiManagerActionPanel activeAction={activeAction} onSelectAction={setAction} />
        </div>

        <div className="min-w-0">
          {activeAction ? (
            <AiManagerWorkspace
              action={activeAction}
              history={messages}
              onSaveToChat={handleSaveToChat}
            />
          ) : (
            <AiManagerChat
              messages={messages}
              draft={draft}
              isTyping={isTyping}
              onDraftChange={setDraft}
              onSend={() => void sendMessage()}
              onClear={() => setClearOpen(true)}
            />
          )}
        </div>
      </div>

      <ConfirmDialog
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        onConfirm={handleClear}
        onSuccess={() => setClearOpen(false)}
        title="Clear chat"
        description="Remove all messages from this chat?"
        confirmText="Clear"
        cancelText="Cancel"
        variant="warning"
      />
    </motion.div>
  )
}
