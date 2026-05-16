import { useMemo, useState } from 'react'
import { cn } from '@/utils/cn'
import type { ClientNoteCategory, ClientProfile } from '@/types'

const FILTERS: { value: ClientNoteCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'SOAP', label: 'SOAP' },
  { value: 'AI', label: 'AI' },
  { value: 'Dictation', label: 'Dictation' },
  { value: 'Reports', label: 'Reports' },
]

const categoryStyles: Record<ClientNoteCategory, string> = {
  SOAP: 'text-emerald-600',
  AI: 'text-sky-600',
  Dictation: 'text-pink-600',
  Reports: 'text-primary',
}

interface NotesTabProps {
  profile: ClientProfile
}

export function NotesTab({ profile }: NotesTabProps) {
  const [filter, setFilter] = useState<ClientNoteCategory | 'all'>('all')
  const [selectedId, setSelectedId] = useState(profile.notes[0]?.id ?? '')

  const filteredNotes = useMemo(() => {
    if (filter === 'all') return profile.notes
    return profile.notes.filter((n) => n.category === filter)
  }, [filter, profile.notes])

  const selected =
    filteredNotes.find((n) => n.id === selectedId) ?? filteredNotes[0] ?? null

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(280px,360px)_1fr]">
      <div className="rounded-2xl bg-card p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                filter === f.value
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <ul className="max-h-[520px] space-y-1 overflow-y-auto">
          {filteredNotes.map((note) => (
            <li key={note.id}>
              <button
                type="button"
                onClick={() => setSelectedId(note.id)}
                className={cn(
                  'w-full rounded-xl px-3 py-3 text-left transition-colors',
                  selected?.id === note.id ? 'bg-muted' : 'hover:bg-muted/50'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={cn('text-xs font-semibold', categoryStyles[note.category])}>
                    {note.category === 'AI' ? 'AI summary' : note.category}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">{note.date}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-foreground">{note.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{note.practitioner}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-sm sm:p-6">
        {selected ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
              <span className={cn('font-semibold', categoryStyles[selected.category])}>
                {selected.category}
              </span>
              <span>{selected.date}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{selected.title}</h3>
              <p className="text-sm text-muted-foreground">{selected.practitioner}</p>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-foreground whitespace-pre-line">
              {selected.body}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No notes found.</p>
        )}
      </div>
    </div>
  )
}
