export type DashboardTaskTab = 'message' | 'report-due' | 'approvals' | 'outstanding' | 'follow-up'

export interface DashboardTaskTabConfig {
  id: DashboardTaskTab
  label: string
  badge?: number
}

export interface DashboardTaskMessage {
  id: string
  name: string
  time: string
  preview: string
}

export const DASHBOARD_TASK_TABS: DashboardTaskTabConfig[] = [
  { id: 'message', label: 'message', badge: 1 },
  { id: 'report-due', label: 'Report Due', badge: 3 },
  { id: 'approvals', label: 'approvals' },
  { id: 'outstanding', label: 'Outstanding' },
  { id: 'follow-up', label: 'follow-up' },
]

export const DASHBOARD_MESSAGES: DashboardTaskMessage[] = [
  {
    id: 'm1',
    name: 'Lena park',
    time: '2:00 pm',
    preview: "Quick question about Theo's inhaler dosing...",
  },
  {
    id: 'm2',
    name: 'Lena park',
    time: '2:00 pm',
    preview: "Quick question about Theo's inhaler dosing...",
  },
  {
    id: 'm3',
    name: 'Lena park',
    time: '2:00 pm',
    preview: "Quick question about Theo's inhaler dosing...",
  },
  {
    id: 'm4',
    name: 'Lena park',
    time: '2:00 pm',
    preview: "Quick question about Theo's inhaler dosing...",
  },
]

export const DASHBOARD_REPORT_DUE_ITEMS: DashboardTaskMessage[] = [
  {
    id: 'r1',
    name: 'Zoya Clinic',
    time: 'Due today',
    preview: 'Workcover progress report — mid-claim review',
  },
  {
    id: 'r2',
    name: 'Metro Health',
    time: 'Due tomorrow',
    preview: 'Initial assessment report pending sign-off',
  },
  {
    id: 'r3',
    name: 'Care Plus Clinic',
    time: 'Due Fri',
    preview: 'Discharge summary required',
  },
]
