import { RootState } from '../store'
import { canAccessDashboard } from '@/types/roles'
import { Car } from '@/types'

export const selectRoleBasedCars = (state: RootState): Car[] => {
  if (!state.auth.user) return []
  return []
}

export const selectPaginatedRoleBasedCars = (state: RootState): Car[] =>
  selectRoleBasedCars(state)

export const selectRoleBasedCarsCount = (state: RootState): number =>
  selectRoleBasedCars(state).length

export const selectRoleBasedTotalPages = (state: RootState): number => {
  const count = selectRoleBasedCarsCount(state)
  if (count === 0) return 1
  return 1
}

export const selectCanModifyItem = (
  state: RootState,
  itemBusinessId?: string
): boolean => {
  const { user } = state.auth
  if (!user) return false

  void itemBusinessId
  return canAccessDashboard(user.role)
}
