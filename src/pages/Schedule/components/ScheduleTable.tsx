import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format, parseISO } from 'date-fns'
import { cn } from '@/utils/cn'
import type { ScheduleRecord } from '@/types'

function formatScheduleDate(iso: string): string {
  const d = parseISO(iso)
  return `${format(d, 'd')},${format(d, 'MMM').toLowerCase()} ${format(d, 'yyyy')}`
}

function formatDuration(row: ScheduleRecord): string {
  if (row.dutyHours === null || !row.rangeStart || !row.rangeEnd) return '--'
  return `${formatScheduleDate(row.rangeStart)} - ${formatScheduleDate(row.rangeEnd)}`
}

interface ScheduleTableProps {
  rows: ScheduleRecord[]
  onInfo: (row: ScheduleRecord) => void
}

export function ScheduleTable({ rows, onInfo }: ScheduleTableProps) {
  return (
    <div className="w-full overflow-auto rounded-2xl border border-border bg-card shadow-sm">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="bg-primary text-accent-foreground">
            <th className="px-5 py-3.5 text-left text-sm font-semibold first:rounded-tl-2xl">
              S. No
            </th>
            <th className="px-5 py-3.5 text-left text-sm font-semibold">Apply Date</th>
            <th className="px-5 py-3.5 text-left text-sm font-semibold">Duty Time</th>
            <th className="px-5 py-3.5 text-left text-sm font-semibold">Duration</th>
            <th className="px-5 py-3.5 text-right text-sm font-semibold last:rounded-tr-2xl w-[100px]">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-5 py-12 text-center text-sm text-muted-foreground">
                No schedule rows
              </td>
            </tr>
          ) : (
            rows.map((row, index) => {
              const isOff = row.dutyHours === null
              return (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.02 * index }}
                  className="transition-colors hover:bg-muted/45"
                >
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-medium text-muted-foreground">#{row.serialNo}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-foreground">{row.applyDay}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {isOff ? (
                      <span className="text-sm font-medium text-destructive dark:text-red-400">
                        Off Day
                      </span>
                    ) : (
                      <span className="text-sm text-foreground">
                        {row.dutyHours} hour{row.dutyHours === 1 ? '' : 's'}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        'text-sm',
                        isOff ? 'text-muted-foreground/70' : 'text-muted-foreground'
                      )}
                    >
                      {formatDuration(row)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full border border-border text-foreground hover:bg-muted"
                        onClick={() => onInfo(row)}
                        aria-label="Schedule details"
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
