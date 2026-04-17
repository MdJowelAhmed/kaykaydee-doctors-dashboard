import { useMemo } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { UserRole, canAccessDashboard } from '@/types/roles'

interface DataItem {
  [key: string]: string | number | undefined
}

/** Doctor and Staff see all rows; other roles are denied on this dashboard. */
export const useRoleBasedData = <T extends DataItem>(data: T[]): T[] => {
  const { user } = useAppSelector((state) => state.auth)

  return useMemo(() => {
    if (!user) return []

    if (canAccessDashboard(user.role)) {
      return data
    }

    return []
  }, [data, user])
}

/** True when the logged-in user is Staff. */
export const useIsStaff = (): boolean => {
  const { user } = useAppSelector((state) => state.auth)
  return user?.role === UserRole.STAFF
}

/** @deprecated Use `useIsStaff` (legacy name for the staff role). */
export const useIsHost = (): boolean => {
  const { user } = useAppSelector((state) => state.auth)
  return user?.role === UserRole.STAFF
}

/** True when the logged-in user is Doctor. */
export const useIsDoctor = (): boolean => {
  const { user } = useAppSelector((state) => state.auth)
  return user?.role === UserRole.DOCTOR
}

export const useCanModifyItem = (item: DataItem): boolean => {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) return false

  void item
  return canAccessDashboard(user.role)
}
