import { ModalWrapper } from '@/components/common/ModalWrapper'
import { format, parseISO } from 'date-fns'
import { cn } from '@/utils/cn'
import type { AvailabilityRecord, AvailabilityStatus } from '@/types'

interface AvailabilityDetailsModalProps {
  open: boolean
  onClose: () => void
  record: AvailabilityRecord | null
}

function formatCommaDate(iso: string): string {
  return format(parseISO(iso), 'd, MMM yyyy')
}

function formatRange(startIso: string, endIso: string): string {
  return `${formatCommaDate(startIso)} - ${formatCommaDate(endIso)}`
}

const statusLabel: Record<AvailabilityStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
}

const statusStyle: Record<AvailabilityStatus, string> = {
  pending: 'bg-muted-foreground/75 text-white',
  approved: 'bg-emerald-600 text-white',
  rejected: 'bg-red-500 text-white',
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-2 last:border-0 sm:flex-row sm:items-baseline sm:gap-4">
      <span className="shrink-0 text-sm font-medium text-muted-foreground sm:w-44">{label}</span>
      <span className="break-words text-sm text-foreground">{value}</span>
    </div>
  )
}

export function AvailabilityDetailsModal({ open, onClose, record }: AvailabilityDetailsModalProps) {
  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Availability details"
      description={record ? `Reference #${record.serialNo}` : undefined}
      size="lg"
    >
      {record ? (
        <div className="space-y-1 pt-1">
          <div className="pb-3">
            <span
              className={cn(
                'inline-flex rounded-md px-3 py-1 text-xs font-semibold',
                statusStyle[record.status]
              )}
            >
              {statusLabel[record.status]}
            </span>
          </div>
          <DetailRow label="Serial no." value={`#${record.serialNo}`} />
          <DetailRow label="Apply date" value={formatCommaDate(record.applyDate)} />
          <DetailRow label="Leave time" value={`${record.blockDays} Day`} />
          <DetailRow label="Leave duration" value={formatRange(record.rangeStart, record.rangeEnd)} />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No record selected.</p>
      )}
    </ModalWrapper>
  )
}
