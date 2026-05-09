import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format, parseISO } from 'date-fns'
import { cn } from '@/utils/cn'
import type { MyPatientListRecord, PatientListVisitStatus } from '@/types'

function formatAppointDate(iso: string): string {
  return format(parseISO(iso), 'd, MMM yyyy')
}

function statusBadgeClass(status: PatientListVisitStatus): string {
  switch (status) {
    case 'complete':
      return 'bg-emerald-600 text-white'
    case 'absent':
      return 'bg-red-500 text-white'
    default:
      return 'bg-muted-foreground/75 text-white'
  }
}

function statusLabel(status: PatientListVisitStatus): string {
  return status === 'complete' ? 'Complete' : 'Absent'
}

interface PatientsListTableProps {
  rows: MyPatientListRecord[]
  onInfo: (row: MyPatientListRecord) => void
}

const headerBg = 'bg-[#E9EBF0] dark:bg-background'
const headerCell = 'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle'
const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'

export function PatientsListTable({ rows, onInfo }: PatientsListTableProps) {
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
          {rows.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-5 py-12 text-center text-sm text-accent-foreground">
                No patients found
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.02 * index }}
                className={cn(
                  'transition-colors hover:bg-muted/45',
                  index % 2 === 1 && 'bg-muted/25 dark:bg-muted/15'
                )}
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
                  <span className="text-sm text-muted-foreground">{formatAppointDate(row.appointmentDate)}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-muted-foreground lowercase">{row.roomNo}</span>
                </td>
                <td className={bodyCell}>
                  <span
                    className={cn(
                      'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                      statusBadgeClass(row.status)
                    )}
                  >
                    {statusLabel(row.status)}
                  </span>
                </td>
                  <td className={bodyCell}>
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full border border-border text-foreground hover:bg-muted"
                      onClick={() => onInfo(row)}
                      aria-label="Patient details"
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
