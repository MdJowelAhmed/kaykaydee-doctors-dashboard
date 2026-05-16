import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ClientProfile, ClientProfileTab } from '@/types'
import { ClientProfileTabNav } from './ClientProfileTabNav'

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

interface ClientProfileShellProps {
  profile: ClientProfile
  activeTab: ClientProfileTab
  onTabChange: (tab: ClientProfileTab) => void
  backHref?: string
  backLabel?: string
  pageTitle?: string
  showActions?: boolean
  onEdit?: () => void
  onDelete?: () => void
  children: ReactNode
}

export function ClientProfileShell({
  profile,
  activeTab,
  onTabChange,
  backHref = '/my-patients-list',
  backLabel = 'Back to patients management',
  pageTitle = 'Clients Profile',
  showActions = true,
  onEdit,
  onDelete,
  children,
}: ClientProfileShellProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">{pageTitle}</h1>
          <Link
            to={backHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </div>
        {showActions ? (
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl border-border bg-card px-4"
              onClick={onEdit}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl border-border bg-card px-4 text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {getInitials(profile.name)}
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">Patient ID: {profile.patientId}</p>
            </div>
            <div className="max-w-md space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Session</span>
                <span className="text-muted-foreground">{profile.sessionProgress}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-teal-500 transition-all"
                  style={{ width: `${profile.sessionProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ClientProfileTabNav activeTab={activeTab} onTabChange={onTabChange} />

      <div>{children}</div>
    </div>
  )
}
