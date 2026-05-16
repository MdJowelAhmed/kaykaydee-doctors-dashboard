import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  User,
  Lock,
  FileText,
  Shield,
  Info,
  LogOut,
  HelpCircle,
  CalendarCheck,
  CalendarOff,
  UserRound,
  CalendarRange,
  Calendar,
  Brain,
  LayoutDashboard,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toggleSidebar } from '@/redux/slices/uiSlice'
import { cn } from '@/utils/cn'
import { UserRole, normalizeRoleKey } from '@/types/roles'
import { Button } from '../ui/button'
import { logout } from '@/redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import {
  DASHBOARD_HEADER_H,
  DASHBOARD_HEADER_SIDEBAR_GAP,
  DASHBOARD_SIDEBAR_V_INSET,
} from '@/components/layout/dashboardLayoutTokens'
import { getRoleDisplayName } from '@/utils/roleHelpers'

// const COL_CARD_FROM = '#44A9C4'
// const COL_CARD_MID = '#48DAC9'
// const COL_CARD_TO = '#E055FA'
// const COL_PROGRESS_FILL = '#48DAC9'

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  allowedRoles?: UserRole[]
}

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard Overview',
    href: '/dashboard-overview',
    icon: LayoutDashboard,
    allowedRoles: [UserRole.DOCTOR, UserRole.STAFF],
  },
  {
    title: 'My Appointments',
    href: '/my-appointments',
    icon: CalendarCheck,
    allowedRoles: [UserRole.DOCTOR, UserRole.STAFF],
  },
  {
    title: 'Calendar',
    href: '/calender',
    icon: Calendar,
    allowedRoles: [UserRole.DOCTOR, UserRole.STAFF],
  },
  {
    title: 'My Patients List',
    href: '/my-patients-list',
    icon: UserRound,
    allowedRoles: [UserRole.DOCTOR, UserRole.STAFF],
  },
  {
    title: 'Schedule',
    href: '/schedule',
    icon: CalendarRange,
    allowedRoles: [UserRole.DOCTOR, UserRole.STAFF],
  },
  {
    title: 'Availability',
    href: '/availability',
    icon: CalendarOff,
    allowedRoles: [UserRole.DOCTOR, UserRole.STAFF],
  },
]

const aiItem: NavItem = {
  title: 'AI Manager',
  href: '/zealth-ai',
  icon: Brain,
  allowedRoles: [UserRole.DOCTOR, UserRole.STAFF],
}

const settingsItems: NavItem[] = [
  {
    title: 'Profile',
    href: '/settings/profile',
    icon: User,
    allowedRoles: [UserRole.DOCTOR, UserRole.STAFF],
  },
  {
    title: 'About Us',
    href: '/settings/about-us',
    icon: Info,
    allowedRoles: [UserRole.DOCTOR, UserRole.STAFF],
  },
  {
    title: 'FAQ',
    href: '/settings/faq',
    icon: HelpCircle,
    allowedRoles: [UserRole.DOCTOR],
  },
  {
    title: 'Password',
    href: '/settings/password',
    icon: Lock,
    allowedRoles: [UserRole.DOCTOR, UserRole.STAFF],
  },
  {
    title: 'Terms',
    href: '/settings/terms',
    icon: FileText,
    allowedRoles: [UserRole.DOCTOR, UserRole.STAFF],
  },
  {
    title: 'Privacy',
    href: '/settings/privacy',
    icon: Shield,
    allowedRoles: [UserRole.DOCTOR, UserRole.STAFF],
  },
]

function filterByRole(items: NavItem[], user: { role: string } | null): NavItem[] {
  if (!items.length) return []
  return items.filter((item) => {
    if (!item.allowedRoles) return true
    if (!user) return false
    const role = normalizeRoleKey(user.role) as UserRole
    return item.allowedRoles.includes(role)
  })
}

export function Sidebar() {
  const dispatch = useAppDispatch()
  const { sidebarCollapsed } = useAppSelector((state) => state.ui)
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const filteredMain = filterByRole(mainNavItems, user)
  const filteredSettings = filterByRole(settingsItems, user)
  const filteredAi = filterByRole([aiItem], user)
  const showAi = filteredAi.length > 0

  const belowHeaderGap = `calc(${DASHBOARD_HEADER_H} + ${DASHBOARD_HEADER_SIDEBAR_GAP})`
  const sidebarTop = `calc(${belowHeaderGap} + ${DASHBOARD_SIDEBAR_V_INSET})`

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email || ''
    : ''

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      dispatch(logout())
      toast.success('User logged out successfully')
      navigate('/auth/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity',
          sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
        style={{ top: belowHeaderGap }}
        onClick={() => dispatch(toggleSidebar())}
      />

      <aside
        className={cn(
          'fixed left-0 z-40 flex flex-col overflow-hidden  bg-card shadow-lg transition-all duration-300',
          'ml-4 rounded-[2rem] lg:ml-5',
          sidebarCollapsed ? 'w-[80px]' : 'w-[230px]',
          'lg:translate-x-0',
          sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
        )}
        style={{ top: sidebarTop, bottom: DASHBOARD_SIDEBAR_V_INSET }}
      >
   

        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-thin px-3 pb-2 pt-4">
          {filteredMain.map((item) => (
            <SidebarNavItem key={item.href} item={item} collapsed={sidebarCollapsed} />
          ))}

          {filteredMain.length > 0 && (filteredSettings.length > 0 || showAi) && (
            <SidebarDivider />
          )}

          {filteredSettings.map((item) => (
            <SidebarNavItem key={item.href} item={item} collapsed={sidebarCollapsed} />
          ))}

          {showAi &&
            (filteredMain.length > 0 || filteredSettings.length > 0) && <SidebarDivider />}

          {showAi &&
            filteredAi.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                collapsed={sidebarCollapsed}
                variant="ai"
              />
            ))}

          {/* {!sidebarCollapsed && (
            <div className="mt-3 px-1">
              <div
                className="relative overflow-hidden rounded-2xl p-4 text-white shadow-md"
                style={{
                  background: `linear-gradient(to right, ${COL_CARD_FROM}, ${COL_CARD_MID}, ${COL_CARD_TO})`,
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(255,255,255,0.2),transparent_50%)]" />
                <div className="relative flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <Crown className="h-5 w-5 text-white" strokeWidth={1.75} />
                  </div>
                  <span className="text-sm font-semibold tracking-tight text-white">
                    50% Completed
                  </span>
                </div>
                <div className="relative mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full shadow-sm transition-all duration-500"
                    style={{ width: '50%', backgroundColor: COL_PROGRESS_FILL }}
                  />
                </div>
              </div>
            </div>
          )} */}
        </nav>

        <div className="mt-auto space-y-3 border-t border-border px-3 py-3">
          {!sidebarCollapsed && user && (
            <div className="flex items-center gap-3 rounded-2xl px-2 py-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-inner ring-2 ring-background">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-white" strokeWidth={1.75} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-accent">{displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {getRoleDisplayName(user.role)}
                </p>
              </div>
            </div>
          )}

          {sidebarCollapsed && user && (
            <div className="flex justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex h-11 w-11 cursor-default items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-inner ring-2 ring-background">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-white" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-accent">
                  <p className="font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {getRoleDisplayName(user.role)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {sidebarCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mx-auto flex h-10 w-10 text-accent hover:text-accent"
                  onClick={() => setLogoutDialogOpen(true)}
                  aria-label="Log Out"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-accent">
                Log Out
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              type="button"
              onClick={() => setLogoutDialogOpen(true)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                'text-accent transition-colors',
                'hover:bg-muted/60 hover:text-accent'
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </aside>

      <ConfirmDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        onSuccess={() => setLogoutDialogOpen(false)}
        title="Confirm logout"
        description="Are you sure you want to log out?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        variant="danger"
        isLoading={isLoggingOut}
      />
    </>
  )
}

function SidebarDivider() {
  return <div className="my-3 border-t border-border" role="presentation" />
}

interface SidebarNavItemProps {
  item: NavItem
  collapsed: boolean
  variant?: 'default' | 'ai'
}

function SidebarNavItem({ item, collapsed, variant = 'default' }: SidebarNavItemProps) {
  const Icon = item.icon

  const linkContent = (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-200',
          collapsed && 'justify-center px-2',
          variant === 'default' && [
            'text-accent hover:bg-muted/50 hover:text-accent',
            isActive && 'bg-background font-medium text-accent shadow-sm',
          ],
          variant === 'ai' && [
            'hover:bg-[#6737BE]/10',
            isActive && 'bg-[#6737BE]/15 font-medium shadow-sm dark:bg-[#6737BE]/20',
          ]
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'h-[1.125rem] w-[1.125rem] shrink-0 stroke-[1.75]',
              variant === 'default' &&
                (isActive ? 'text-accent' : 'text-muted-foreground'),
              variant === 'ai' &&
                (isActive
                  ? 'text-[#E055FA]'
                  : 'text-[#6737BE] dark:text-[#b794f6]')
            )}
            aria-hidden
          />
          {!collapsed &&
            (variant === 'ai' ? (
              <span className="bg-gradient-to-r from-[#6737BE] to-[#E055FA] bg-clip-text font-medium text-transparent">
                {item.title}
              </span>
            ) : (
              <span>{item.title}</span>
            ))}
        </>
      )}
    </NavLink>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" className="text-accent">
          {item.title}
        </TooltipContent>
      </Tooltip>
    )
  }

  return linkContent
}
