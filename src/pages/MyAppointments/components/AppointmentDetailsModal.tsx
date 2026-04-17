import { ModalWrapper } from '@/components/common/ModalWrapper'
import { formatDate } from '@/utils/formatters'
import { cn } from '@/utils/cn'
import type { DoctorAppointment, DoctorAppointmentStatus } from '@/types'

interface AppointmentDetailsModalProps {
  open: boolean
  onClose: () => void
  appointment: DoctorAppointment | null
}

const statusLabel: Record<DoctorAppointmentStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const statusStyle: Record<DoctorAppointmentStatus, string> = {
  pending: 'bg-teal-500 text-white',
  confirmed: 'bg-sky-600 text-white',
  completed: 'bg-emerald-600 text-white',
  cancelled: 'bg-red-500 text-white',
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm font-medium text-muted-foreground shrink-0 sm:w-40">{label}</span>
      <span className="text-sm text-slate-900 break-words">{value}</span>
    </div>
  )
}

export function AppointmentDetailsModal({
  open,
  onClose,
  appointment,
}: AppointmentDetailsModalProps) {
  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Appointment details"
      description={appointment ? `Reference #${appointment.serialNo}` : undefined}
      size="lg"
    >
      {appointment ? (
        <div className="space-y-1 pt-1">
          <div className="pb-3">
            <span
              className={cn(
                'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                statusStyle[appointment.status]
              )}
            >
              {statusLabel[appointment.status]}
            </span>
          </div>
          <DetailRow label="Serial no." value={`#${appointment.serialNo}`} />
          <DetailRow label="User ID" value={appointment.userId} />
          <DetailRow label="Patient name" value={appointment.patientName} />
          <DetailRow label="Contact" value={appointment.contactNo} />
          <DetailRow label="Service" value={appointment.service} />
          <DetailRow
            label="Appointment date"
            value={formatDate(appointment.appointmentDate, 'd MMM yyyy')}
          />
          <DetailRow label="Room no." value={appointment.roomNo} />
          {appointment.notes ? (
            <DetailRow label="Notes" value={appointment.notes} />
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No appointment selected.</p>
      )}
    </ModalWrapper>
  )
}
