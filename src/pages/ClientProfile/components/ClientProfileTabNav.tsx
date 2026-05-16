import {
  User,
  Calendar,
  FolderOpen,
  BarChart3,
  Zap,
  Receipt,
  Target,
  StickyNote,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import type { ClientProfileTab } from '@/types'

const TABS: { id: ClientProfileTab; label: string; icon: typeof User }[] = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'sessions', label: 'Sessions', icon: Calendar },
  { id: 'notes', label: 'Notes', icon: StickyNote },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
  { id: 'report', label: 'Report', icon: BarChart3 },
  { id: 'exercises', label: 'Exercises', icon: Zap },
  { id: 'invoice', label: 'Invoice', icon: Receipt },
  { id: 'outcome', label: 'Outcome', icon: Target },
]

interface ClientProfileTabNavProps {
  activeTab: ClientProfileTab
  onTabChange: (tab: ClientProfileTab) => void
}

export function ClientProfileTabNav({ activeTab, onTabChange }: ClientProfileTabNavProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-secondary text-secondary-foreground shadow-sm'
                : 'bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
