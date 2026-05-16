import { Brain } from 'lucide-react'
import { cn } from '@/utils/cn'
import { AI_MANAGER_ACTIONS, type AiManagerAction } from '../aiActions'

const GRADIENT = 'linear-gradient(135deg, #6737BE 0%, #9B4DCC 45%, #E055FA 100%)'

interface AiManagerActionPanelProps {
  activeAction: AiManagerAction | null
  onSelectAction: (action: AiManagerAction | null) => void
  className?: string
}

export function AiManagerActionPanel({
  activeAction,
  onSelectAction,
  className,
}: AiManagerActionPanelProps) {
  const chatActive = activeAction === null

  const actionButtonClass = (isActive: boolean) =>
    cn(
      'w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors backdrop-blur-sm',
      isActive
        ? 'border-white bg-white text-[#6737BE] shadow-sm'
        : 'border-white/25 bg-white/20 text-white hover:bg-white/30 active:bg-white/35'
    )

  return (
    <div
      className={cn('relative overflow-hidden rounded-2xl p-4 shadow-md', className)}
      style={{ background: GRADIENT }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.22),transparent_55%)]" />

      <div className="relative flex flex-col gap-3">
        <button
          type="button"
          onClick={() => onSelectAction(null)}
          className={cn(
            'inline-flex w-full items-center gap-2 rounded-full px-3 py-1.5 shadow-sm transition-colors',
            chatActive ? 'bg-white ring-2 ring-white/50' : 'bg-white/90 hover:bg-white'
          )}
        >
          <Brain className="h-4 w-4 shrink-0 text-[#6737BE]" strokeWidth={2} />
          <span className="text-sm font-semibold text-[#6737BE]">AI Manager</span>
        </button>

        <div className="flex flex-col gap-2">
          {AI_MANAGER_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => onSelectAction(action.id)}
              className={actionButtonClass(activeAction === action.id)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

