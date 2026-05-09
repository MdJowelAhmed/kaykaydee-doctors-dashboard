import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate } from '@/utils/formatters'
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
      return 'bg-teal-500 text-white border-transparent hover:bg-teal-500/90 focus:ring-teal-300 data-[placeholder]:text-white'
    case 'confirmed':
      return 'bg-sky-600 text-white border-transparent hover:bg-sky-600/90 focus:ring-sky-300'
    case 'completed':
      return 'bg-emerald-600 text-white border-transparent hover:bg-emerald-600/90 focus:ring-emerald-300'
    case 'cancelled':
      return 'bg-red-500 text-white border-transparent hover:bg-red-500/90 focus:ring-red-300'
    default:
      return ''
  }
}

interface AppointmentsTableProps {
  appointments: DoctorAppointment[]
  onStatusChange: (id: string, status: DoctorAppointmentStatus) => void
  onInfo: (row: DoctorAppointment) => void
}

export function AppointmentsTable({
  appointments,
  onStatusChange,
  onInfo,
}: AppointmentsTableProps) {
  const headerBg = 'bg-[#E9EBF0] dark:bg-background'
  const headerCell = 'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle'
  const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'

  return (
    <div className="w-full overflow-auto rounded-2xl   bg-card ">
      <table className="w-full min-w-[1100px]">
        <thead>
          <tr className="">
            <th className={cn(headerCell, headerBg, 'text-left rounded-l-full')}>
              S. No
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>User ID</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Patient Name</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Contact No</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Service</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Appoint Date</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Room No</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Status</th>
            <th className={cn(headerCell, headerBg, 'text-right rounded-r-full')}>
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-card text-accent-foreground">
          {appointments.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-5 py-12 text-center text-sm text-accent-foreground">
                No appointments found
              </td>
            </tr>
          ) : (
            appointments.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.02 * index }}
                className="transition-colors hover:bg-muted/45"
              >
                <td className={bodyCell}>
                  <span className="text-sm font-medium text-muted-foreground">#{row.serialNo}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm tabular-nums text-foreground">{row.userId}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-foreground">{row.patientName}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-muted-foreground">{row.contactNo}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-foreground">{row.service}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(row.appointmentDate, 'd MMM yyyy')}
                  </span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-muted-foreground lowercase">{row.roomNo}</span>
                </td>
                <td className={bodyCell}>
                  <Select
                    value={row.status}
                    onValueChange={(v) => onStatusChange(row.id, v as DoctorAppointmentStatus)}
                  >
                    <SelectTrigger
                      className={cn(
                        'h-9 w-[min(100%,9rem)] rounded-full border-0 px-3 text-xs font-semibold shadow-none data-[state=open]:opacity-95 [&_svg]:text-white/90',
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
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full border border-border text-foreground hover:bg-muted"
                      onClick={() => onInfo(row)}
                      aria-label="Appointment details"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
