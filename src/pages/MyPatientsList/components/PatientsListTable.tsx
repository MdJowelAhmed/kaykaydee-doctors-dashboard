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
      return 'bg-slate-400 text-white'
  }
}

function statusLabel(status: PatientListVisitStatus): string {
  return status === 'complete' ? 'Complete' : 'Absent'
}

interface PatientsListTableProps {
  rows: MyPatientListRecord[]
  onInfo: (row: MyPatientListRecord) => void
}

export function PatientsListTable({ rows, onInfo }: PatientsListTableProps) {
  return (
    <div className="w-full overflow-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full min-w-[1100px]">
        <thead>
          <tr className="bg-slate-100 text-slate-800">
            <th className="px-5 py-3.5 text-left text-sm font-semibold first:rounded-tl-2xl">
              S. No
            </th>
            <th className="px-5 py-3.5 text-left text-sm font-semibold">User ID</th>
            <th className="px-5 py-3.5 text-left text-sm font-semibold">Patient Name</th>
            <th className="px-5 py-3.5 text-left text-sm font-semibold">Contact No</th>
            <th className="px-5 py-3.5 text-left text-sm font-semibold">Service</th>
            <th className="px-5 py-3.5 text-left text-sm font-semibold">Appoint Date</th>
            <th className="px-5 py-3.5 text-left text-sm font-semibold">Room No</th>
            <th className="px-5 py-3.5 text-left text-sm font-semibold">Status</th>
            <th className="px-5 py-3.5 text-center text-sm font-semibold last:rounded-tr-2xl w-[100px]">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-5 py-12 text-center text-slate-500 text-sm">
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
                  'transition-colors hover:bg-slate-50/80',
                  index % 2 === 1 && 'bg-slate-50/40'
                )}
              >
                <td className="px-5 py-3.5">
                  <span className="text-sm font-medium text-slate-700">#{row.serialNo}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm tabular-nums text-slate-800">{row.userId}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-slate-800">{row.patientName}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-slate-700">{row.contactNo}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-slate-800">{row.service}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-slate-700">{formatAppointDate(row.appointmentDate)}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-slate-700 lowercase">{row.roomNo}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                      statusBadgeClass(row.status)
                    )}
                  >
                    {statusLabel(row.status)}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full border border-slate-200 text-[#1A284B] hover:bg-slate-100"
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
