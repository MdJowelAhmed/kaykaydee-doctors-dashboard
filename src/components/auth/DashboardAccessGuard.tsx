import { ReactNode, useLayoutEffect, useRef } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { logout } from '@/redux/slices/authSlice'
import { canAccessDashboard } from '@/types/roles'

function UnauthorizedRoleRedirect() {
  const dispatch = useAppDispatch()
  const didLogout = useRef(false)

  useLayoutEffect(() => {
    if (didLogout.current) return
    didLogout.current = true
    dispatch(logout())
    toast.error('This dashboard is only for Doctor and Staff users.')
  }, [dispatch])

  return <Navigate to="/auth/login" replace />
}

interface DashboardAccessGuardProps {
  children: ReactNode
}

/** Only Doctor and Staff may use the dashboard shell. */
export function DashboardAccessGuard({ children }: DashboardAccessGuardProps) {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (!canAccessDashboard(user.role)) {
    return <UnauthorizedRoleRedirect />
  }

  return <>{children}</>
}
