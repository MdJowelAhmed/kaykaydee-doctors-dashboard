import { ModalWrapper } from '@/components/common/ModalWrapper'
import { format, parseISO } from 'date-fns'
import type { ScheduleRecord } from '@/types'

function formatScheduleDate(iso: string): string {
  const d = parseISO(iso)
  return `${format(d, 'd')},${format(d, 'MMM').toLowerCase()} ${format(d, 'yyyy')}`
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm font-medium text-muted-foreground shrink-0 sm:w-36">{label}</span>
      <span className="text-sm text-slate-900 break-words">{value}</span>
    </div>
  )
}

interface ScheduleDetailsModalProps {
  open: boolean
  onClose: () => void
  record: ScheduleRecord | null
}

export function ScheduleDetailsModal({ open, onClose, record }: ScheduleDetailsModalProps) {
  const isOff = record?.dutyHours === null

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Schedule details"
      description={record ? `Row #${record.serialNo} · ${record.applyDay}` : undefined}
      size="md"
    >
      {record ? (
        <div className="space-y-1 pt-1">
          <DetailRow label="S. No." value={`#${record.serialNo}`} />
          <DetailRow label="Apply date" value={record.applyDay} />
          <DetailRow
            label="Duty time"
            value={
              isOff ? 'Off Day' : `${record.dutyHours} hour${record.dutyHours === 1 ? '' : 's'}`
            }
          />
          <DetailRow
            label="Duration"
            value={
              isOff || !record.rangeStart || !record.rangeEnd
                ? '—'
                : `${formatScheduleDate(record.rangeStart)} - ${formatScheduleDate(record.rangeEnd)}`
            }
          />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No row selected.</p>
      )}
    </ModalWrapper>
  )
}
