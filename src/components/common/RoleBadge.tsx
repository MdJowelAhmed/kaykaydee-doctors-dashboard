import { Badge } from '@/components/ui/badge'
import { Stethoscope, Users, BadgeHelp } from 'lucide-react'
import { cn } from '@/utils/cn'
import { UserRole, normalizeRoleKey } from '@/types/roles'
import { getRoleDisplayName } from '@/utils/roleHelpers'

interface RoleBadgeProps {
  role: string
  className?: string
  showIcon?: boolean
}

type BadgeTier = 'doctor' | 'staff' | 'unknown'

function badgeTier(role: string): BadgeTier {
  const normalized = normalizeRoleKey(role)
  if (normalized === UserRole.DOCTOR) return 'doctor'
  if (normalized === UserRole.STAFF) return 'staff'
  return 'unknown'
}

export function RoleBadge({ role, className, showIcon = true }: RoleBadgeProps) {
  const tier = badgeTier(role)

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1 font-medium border-0',
        tier === 'doctor' && 'bg-amber-100 text-amber-900 hover:bg-amber-200/90',
        tier === 'staff' && 'bg-purple-100 text-purple-800 hover:bg-purple-200/90',
        tier === 'unknown' && 'bg-slate-100 text-slate-800 hover:bg-slate-200/90',
        className
      )}
    >
      {showIcon &&
        (tier === 'doctor' ? (
          <Stethoscope className="h-3 w-3" />
        ) : tier === 'staff' ? (
          <Users className="h-3 w-3" />
        ) : (
          <BadgeHelp className="h-3 w-3" />
        ))}
      {getRoleDisplayName(role)}
    </Badge>
  )
}
