// Auth roles — dashboard access is for doctor + staff only
export enum UserRole {
  DOCTOR = 'doctor',
  STAFF = 'staff',
}

/** Legacy API/storage values (older dashboards). */
export const LEGACY_ADMIN_ROLE_KEY = 'host' as const
export const LEGACY_SUPER_ADMIN_ROLE_KEY = 'super-admin' as const
export const LEGACY_ADMIN_ROLE_KEY_2 = 'admin' as const

export const DASHBOARD_ALLOWED_ROLES: readonly UserRole[] = [
  UserRole.DOCTOR,
  UserRole.STAFF,
]

/** Map legacy roles to current keys for permission checks and persisted sessions. */
export function normalizeRoleKey(role: string): string {
  if (role === UserRole.DOCTOR) return UserRole.DOCTOR
  if (role === UserRole.STAFF) return UserRole.STAFF

  if (role === LEGACY_SUPER_ADMIN_ROLE_KEY) return UserRole.DOCTOR
  if (role === LEGACY_ADMIN_ROLE_KEY_2) return UserRole.STAFF
  if (role === LEGACY_ADMIN_ROLE_KEY) return UserRole.STAFF

  return role
}

export function canAccessDashboard(role: string): boolean {
  const key = normalizeRoleKey(role)
  return DASHBOARD_ALLOWED_ROLES.includes(key as UserRole)
}



export interface RoutePermission {
  path: string
  allowedRoles: UserRole[]
  description?: string
}

/** Route → allowed roles (extend as you add routes) */
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  // '/dashboard': ALL_DASHBOARD_ROLES,
  // Former "super-admin only" areas now treated as Doctor-only
  // '/users': [UserRole.DOCTOR],
  // '/clinic-management': [UserRole.DOCTOR],
  // '/controller': [UserRole.DOCTOR],
  // '/subscription-packages': [UserRole.DOCTOR],
  // '/subscription-invoice': [UserRole.DOCTOR],
  // '/subscription-manage': [UserRole.DOCTOR],
  // '/admin-manage': [UserRole.DOCTOR],
  // '/agency-management': [UserRole.DOCTOR],
  // '/transactions-history': [UserRole.DOCTOR],
  // '/settings/faq': [UserRole.DOCTOR],
  // '/settings/terms': ALL_DASHBOARD_ROLES,
  // '/settings/privacy': ALL_DASHBOARD_ROLES,
  // '/settings/about-us': ALL_DASHBOARD_ROLES,
  // '/cars': ALL_DASHBOARD_ROLES,
  // '/booking-management': ALL_DASHBOARD_ROLES,
  // '/my-listing': ALL_DASHBOARD_ROLES,
  
  '/dashboard-overview': [UserRole.DOCTOR, UserRole.STAFF],
  '/my-appointments': [UserRole.DOCTOR,UserRole.STAFF],
  '/calender': [UserRole.DOCTOR, ],
  '/notification': [UserRole.DOCTOR,UserRole.STAFF],
  '/support': [UserRole.DOCTOR,UserRole.STAFF],
  '/zealth-ai': [UserRole.DOCTOR,UserRole.STAFF],
  '/availability': [UserRole.DOCTOR,UserRole.STAFF],
  '/my-patients-list': [UserRole.DOCTOR,UserRole.STAFF],
  '/schedule': [UserRole.DOCTOR,UserRole.STAFF],
  '/settings/profile': [UserRole.DOCTOR,UserRole.STAFF],
  '/settings/password': [UserRole.DOCTOR,UserRole.STAFF],
 
}

export const getDefaultRouteForRole = (role: string): string => {
  if (canAccessDashboard(role)) return '/my-appointments'
  return '/auth/login'
}

export const hasRouteAccess = (userRole: string, routePath: string): boolean => {
  const role = normalizeRoleKey(userRole) as UserRole
  if (ROUTE_PERMISSIONS[routePath]) {
    return ROUTE_PERMISSIONS[routePath].includes(role)
  }

  const matchingRoute = Object.keys(ROUTE_PERMISSIONS).find((route) =>
    routePath.startsWith(route)
  )

  if (matchingRoute) {
    return ROUTE_PERMISSIONS[matchingRoute].includes(role)
  }

  return false
}

export const shouldFilterData = (userRole: string, routePath: string): boolean => {
  void userRole
  void routePath
  return false
}
