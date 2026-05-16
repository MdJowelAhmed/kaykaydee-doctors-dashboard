export type AiManagerAction = 'dictation' | 'report' | 'summary' | 'draft'

export const AI_MANAGER_ACTIONS: { id: AiManagerAction; label: string }[] = [
  { id: 'dictation', label: 'Start Dictation' },
  { id: 'report', label: 'Create Report' },
  { id: 'summary', label: 'Generate Summary' },
  { id: 'draft', label: 'Draft' },
]

export function isAiManagerAction(value: string | null): value is AiManagerAction {
  return value === 'dictation' || value === 'report' || value === 'summary' || value === 'draft'
}
