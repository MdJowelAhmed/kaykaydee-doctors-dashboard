import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utils/cn'
import type { DoctorAppointment, DoctorAppointmentStatus } from '@/types'

const STATUS_OPTIONS: { value: DoctorAppointmentStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

function statusTriggerClass(status: DoctorAppointmentStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-orange-500 text-white border-transparent hover:bg-orange-500/90'
    case 'confirmed':
      return 'bg-teal-500 text-white border-transparent hover:bg-teal-500/90'
    case 'completed':
      return 'bg-emerald-600 text-white border-transparent hover:bg-emerald-600/90'
    case 'cancelled':
      return 'bg-red-500 text-white border-transparent hover:bg-red-500/90'
    default:
      return ''
  }
}

export interface DashboardAppointmentRow extends DoctorAppointment {
  patientType: string
}

interface DashboardAppointmentsTableProps {
  rows: DashboardAppointmentRow[]
  onStatusChange: (id: string, status: DoctorAppointmentStatus) => void
  onInfo: (row: DashboardAppointmentRow) => void
}

const headerBg = 'bg-[#E9EBF0] dark:bg-background'
const headerCell =
  'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-5 sm:py-3.5 align-middle'
const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-5'

export function DashboardAppointmentsTable({
  rows,
  onStatusChange,
  onInfo,
}: DashboardAppointmentsTableProps) {
  return (
    <div className="w-full overflow-auto rounded-2xl bg-card">
      <table className="w-full min-w-[800px]">
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
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                No appointments today
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-muted/40">
                <td className={bodyCell}>
                  <span className="font-medium text-muted-foreground">#{row.serialNo}</span>
                </td>
                <td className={bodyCell}>{row.userId}</td>
                <td className={bodyCell}>{row.patientName}</td>
                <td className={bodyCell}>{row.service}</td>
                <td className={bodyCell}>{row.patientType}</td>
                <td className={bodyCell}>
                  <Select
                    value={row.status}
                    onValueChange={(v) => onStatusChange(row.id, v as DoctorAppointmentStatus)}
                  >
                    <SelectTrigger
                      className={cn(
                        'h-8 w-[min(100%,7.5rem)] rounded-full border-0 px-3 text-xs font-semibold shadow-none [&_svg]:text-white/90',
                        statusTriggerClass(row.status)
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start">
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className={bodyCell}>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full border border-border"
                      onClick={() => onInfo(row)}
                      aria-label="Appointment details"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
