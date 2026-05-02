import { ModalWrapper } from '@/components/common/ModalWrapper'
import { format, parseISO } from 'date-fns'
import { cn } from '@/utils/cn'
import type { MyPatientListRecord, PatientListVisitStatus } from '@/types'

interface PatientListDetailsModalProps {
  open: boolean
  onClose: () => void
  record: MyPatientListRecord | null
}

function formatAppointDate(iso: string): string {
  return format(parseISO(iso), 'd, MMM yyyy')
}

const statusLabel: Record<PatientListVisitStatus, string> = {
  complete: 'Complete',
  absent: 'Absent',
}

const statusStyle: Record<PatientListVisitStatus, string> = {
  complete: 'bg-emerald-600 text-white',
  absent: 'bg-red-500 text-white',
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-2 last:border-0 sm:flex-row sm:items-baseline sm:gap-4">
      <span className="shrink-0 text-sm font-medium text-muted-foreground sm:w-40">{label}</span>
      <span className="break-words text-sm text-foreground">{value}</span>
    </div>
  )
}

export function PatientListDetailsModal({
  open,
  onClose,
  record,
}: PatientListDetailsModalProps) {
  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Patient details"
      description={record ? `Reference #${record.serialNo}` : undefined}
      size="lg"
    >
      {record ? (
        <div className="space-y-1 pt-1">
          <div className="pb-3">
            <span
              className={cn(
                'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                statusStyle[record.status]
              )}
            >
              {statusLabel[record.status]}
            </span>
          </div>
          <DetailRow label="Serial no." value={`#${record.serialNo}`} />
          <DetailRow label="User ID" value={record.userId} />
          <DetailRow label="Patient name" value={record.patientName} />
          <DetailRow label="Contact" value={record.contactNo} />
          <DetailRow label="Service" value={record.service} />
          <DetailRow label="Appointment date" value={formatAppointDate(record.appointmentDate)} />
          <DetailRow label="Room no." value={record.roomNo} />
          {record.notes ? <DetailRow label="Notes" value={record.notes} /> : null}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No patient selected.</p>
      )}
    </ModalWrapper>
  )
}
