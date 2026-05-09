import { motion } from 'framer-motion'
import { Info, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { format, parseISO } from 'date-fns'
import { cn } from '@/utils/cn'
import type { AvailabilityRecord, AvailabilityStatus } from '@/types'

function statusPillClass(status: AvailabilityStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-muted-foreground/75 text-white'
    case 'approved':
      return 'bg-emerald-600 text-white'
    case 'rejected':
      return 'bg-red-500 text-white'
    default:
      return 'bg-muted-foreground/75 text-white'
  }
}

function statusLabel(status: AvailabilityStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function formatCommaDate(iso: string): string {
  return format(parseISO(iso), 'd, MMM yyyy')
}

function formatRange(startIso: string, endIso: string): string {
  return `${formatCommaDate(startIso)} - ${formatCommaDate(endIso)}`
}

interface AvailabilityTableProps {
  rows: AvailabilityRecord[]
  onInfo: (row: AvailabilityRecord) => void
  onEdit: (row: AvailabilityRecord) => void
  onDelete: (row: AvailabilityRecord) => void
}

export function AvailabilityTable({ rows, onInfo, onEdit, onDelete }: AvailabilityTableProps) {
  const headerBg = 'bg-[#E9EBF0] dark:bg-background'
  const headerCell = 'border-x-0 border-t-0 px-4 text-sm font-semibold text-accent sm:px-6 sm:py-4 align-middle'
  const bodyCell = 'border-b border-border px-4 py-3 text-sm text-accent sm:px-6 sm:py-4'
  return (
    <div className="w-full overflow-auto rounded-2xl   bg-card ">
      <table className="w-full min-w-[960px]">
        <thead>
          <tr className="">
            <th className={cn(headerCell, headerBg, 'text-left rounded-l-full')}>
              S. No
            </th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Apply Date</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Leave Time</th>
              <th className={cn(headerCell, headerBg, 'text-left')}>Leave Duration</th>
            <th className={cn(headerCell, headerBg, 'text-left')}>Status</th>
            <th className={cn(headerCell, headerBg, 'text-right rounded-r-full')}>
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-card text-accent-foreground">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-sm text-accent-foreground">
                No availability records found
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
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
                  <span className="text-sm text-foreground">{formatCommaDate(row.applyDate)}</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-foreground">{row.blockDays} Day</span>
                </td>
                <td className={bodyCell}>
                  <span className="text-sm text-muted-foreground">{formatRange(row.rangeStart, row.rangeEnd)}</span>
                </td>
                <td className={bodyCell}>
                  <span
                    className={cn(
                      'inline-flex rounded-md px-3 py-1 text-xs font-semibold capitalize',
                      statusPillClass(row.status)
                    )}
                  >
                    {statusLabel(row.status)}
                  </span>
                </td>
                    <td className={bodyCell}>
                  <div className="flex justify-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-muted-foreground hover:bg-muted hover:text-foreground"
                          onClick={() => onInfo(row)}
                          aria-label="Details"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Details</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-muted-foreground hover:bg-muted hover:text-foreground"
                          onClick={() => onEdit(row)}
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-slate-500 hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onDelete(row)}
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
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
