import { useState } from 'react'
import { Info, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/common/Pagination'
import { cn } from '@/utils/cn'
import type { ClientProfile, ClientSessionAppointment } from '@/types'

function statusBadge(status: ClientSessionAppointment['status']) {
  if (status === 'pending') {
    return 'bg-orange-500 text-white'
  }
  return 'bg-teal-500 text-white'
}

function statusLabel(status: ClientSessionAppointment['status']) {
  return status === 'pending' ? 'Pending' : 'Confirmed'
}

interface SessionsTabProps {
  profile: ClientProfile
}

export function SessionsTab({ profile }: SessionsTabProps) {
  const [page, setPage] = useState(1)
  const perPage = 6
  const totalPages = Math.max(1, Math.ceil(profile.sessions.length / perPage))
  const rows = profile.sessions.slice((page - 1) * perPage, page * perPage)

  const headerBg = 'bg-[#E9EBF0] dark:bg-background'
  const headerCell =
    'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-5 sm:py-3.5 align-middle'
  const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-5'

  const stats = [
    { label: 'Approved', value: profile.sessionStats.approved },
    { label: 'Attended', value: profile.sessionStats.attended },
    { label: 'No Shows', value: profile.sessionStats.noShows },
    { label: 'Remaining', value: profile.sessionStats.remaining },
  ]

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
      <div className="rounded-2xl bg-card p-4 shadow-sm sm:p-5">
        <h3 className="mb-4 text-base font-semibold text-foreground">Todays Appointments</h3>
        <div className="w-full overflow-auto rounded-xl">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr>
                <th className={cn(headerCell, headerBg, 'text-left rounded-l-full')}>S. No</th>
                <th className={cn(headerCell, headerBg, 'text-left')}>User ID</th>
                <th className={cn(headerCell, headerBg, 'text-left')}>Patient Name</th>
                <th className={cn(headerCell, headerBg, 'text-left')}>Service</th>
                <th className={cn(headerCell, headerBg, 'text-left')}>Patient Type</th>
                <th className={cn(headerCell, headerBg, 'text-left')}>Status</th>
                <th className={cn(headerCell, headerBg, 'text-right rounded-r-full')}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30">
                  <td className={bodyCell}>#{row.serialNo}</td>
                  <td className={bodyCell}>{row.userId}</td>
                  <td className={bodyCell}>{row.patientName}</td>
                  <td className={bodyCell}>{row.service}</td>
                  <td className={bodyCell}>{row.patientType}</td>
                  <td className={bodyCell}>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
                        statusBadge(row.status)
                      )}
                    >
                      {statusLabel(row.status)}
                      <ChevronDown className="h-3 w-3 opacity-80" />
                    </span>
                  </td>
                  <td className={bodyCell}>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full border border-border"
                        aria-label="Appointment info"
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={profile.sessions.length}
          itemsPerPage={perPage}
          onPageChange={setPage}
          showItemsPerPage={false}
          variant="minimal"
          className="mt-4"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center rounded-2xl bg-card p-4 shadow-sm"
            >
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              <span className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
        <div className="min-h-[200px] flex-1 rounded-2xl bg-card shadow-sm" />
      </div>
    </div>
  )
}
