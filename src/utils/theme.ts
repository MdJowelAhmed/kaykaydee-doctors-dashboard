export const THEME_STORAGE_KEY = 'doctor-dashboard-theme' as const

export type ThemeMode = 'light' | 'dark'

export function getThemeFromStorage(): ThemeMode {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function applyThemeClass(theme: ThemeMode): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

export function persistTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    /* ignore quota / private mode */
  }
}
