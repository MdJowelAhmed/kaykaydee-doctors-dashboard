import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface ProfileSectionCardProps {
  title: string
  icon: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function ProfileSectionCard({
  title,
  icon,
  action,
  children,
  className,
}: ProfileSectionCardProps) {
  return (
    <div className={cn('rounded-2xl bg-card p-5 shadow-sm', className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </span>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}
