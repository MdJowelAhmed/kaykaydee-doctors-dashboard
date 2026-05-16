import { useState } from 'react'
import { cn } from '@/utils/cn'
import {
  DASHBOARD_MESSAGES,
  DASHBOARD_REPORT_DUE_ITEMS,
  DASHBOARD_TASK_TABS,
  type DashboardTaskMessage,
  type DashboardTaskTab,
} from '../doctorDashboardData'

function TaskMessageCard({ item }: { item: DashboardTaskMessage }) {
  return (
    <div className="rounded-xl bg-muted/50 px-4 py-3 transition-colors hover:bg-muted/70">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">{item.name}</p>
        <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.preview}</p>
    </div>
  )
}

export function AlertsTasksPanel() {
  const [activeTab, setActiveTab] = useState<DashboardTaskTab>('message')

  const listItems =
    activeTab === 'message'
      ? DASHBOARD_MESSAGES
      : activeTab === 'report-due'
        ? DASHBOARD_REPORT_DUE_ITEMS
        : []

  return (
    <div className="flex h-full flex-col rounded-2xl bg-card p-4 shadow-sm sm:p-5">
      <h3 className="mb-4 text-base font-semibold text-foreground">Alerts &amp; Tasks</h3>

      <div className="mb-4 flex flex-wrap gap-2 border-b border-border pb-3">
        {DASHBOARD_TASK_TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors',
                isActive
                  ? 'bg-teal-500 text-white'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              )}
            >
              {tab.label}
              {tab.badge != null && tab.badge > 0 ? (
                <span
                  className={cn(
                    'ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold',
                    isActive ? 'bg-white text-teal-600' : 'bg-red-500 text-white'
                  )}
                >
                  {tab.badge}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto scrollbar-thin">
        {listItems.length > 0 ? (
          listItems.map((item) => <TaskMessageCard key={item.id} item={item} />)
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No items in this section yet.
          </p>
        )}
      </div>
    </div>
  )
}
