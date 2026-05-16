import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, UserRound, CircleDollarSign, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { startOfDay, endOfDay, isWithinInterval, parseISO } from 'date-fns'
import { Pagination } from '@/components/common/Pagination'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateAppointmentStatus } from '@/redux/slices/myAppointmentsSlice'
import type { DoctorAppointmentStatus } from '@/types'
import { DashboardStatCard } from './components/DashboardStatCard'
import {
  DashboardAppointmentsTable,
  type DashboardAppointmentRow,
} from './components/DashboardAppointmentsTable'
import { AlertsTasksPanel } from './components/AlertsTasksPanel'
import { AppointmentDetailsModal } from '@/pages/MyAppointments/components/AppointmentDetailsModal'

function isToday(iso: string): boolean {
  const d = parseISO(iso)
  const now = new Date()
  return isWithinInterval(d, { start: startOfDay(now), end: endOfDay(now) })
}

export default function DoctorDashboardPage() {
  const dispatch = useAppDispatch()
  const { list } = useAppSelector((state) => state.myAppointments)
  const [page, setPage] = useState(1)
  const [detailRow, setDetailRow] = useState<DashboardAppointmentRow | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const todayAppointments = useMemo(
    () => list.filter((a) => isToday(a.appointmentDate)),
    [list]
  )

  const todayRows: DashboardAppointmentRow[] = useMemo(
    () =>
      todayAppointments.map((a, i) => ({
        ...a,
        patientType: i % 2 === 0 ? 'new' : 'returning',
      })),
    [todayAppointments]
  )

  const perPage = 8
  const totalPages = Math.max(1, Math.ceil(todayRows.length / perPage))
  const paginatedRows = todayRows.slice((page - 1) * perPage, page * perPage)

  const doneCount = todayRows.filter(
    (r) => r.status === 'completed' || r.status === 'confirmed'
  ).length
  const toGoCount = Math.max(0, todayRows.length - doneCount)

  const handleStatusChange = (id: string, status: DoctorAppointmentStatus) => {
    dispatch(updateAppointmentStatus({ id, status }))
    toast.success('Status updated')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-secondary sm:text-3xl">Doctor Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage all members who have access to your system
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Todays Patients"
          value={String(todayRows.length || 12)}
          icon={UserRound}
          index={0}
          footer={
            <span>
              <span className="font-medium text-foreground">{doneCount || 4} done</span>
              {' · '}
              <span>{toGoCount || 8} to go</span>
            </span>
          }
        />
        <DashboardStatCard
          title="Todays Revenue"
          value="$520"
          icon={CircleDollarSign}
          index={1}
          footer={
            <span className="inline-flex items-center gap-0.5 font-medium text-teal-600">
              <TrendingUp className="h-3.5 w-3.5" />
              2% from last month
            </span>
          }
        />
        <DashboardStatCard
          title="Outstanding payments"
          value="$300"
          icon={CircleDollarSign}
          index={2}
          footer={
            <span className="inline-flex items-center gap-0.5 font-medium text-teal-600">
              <TrendingUp className="h-3.5 w-3.5" />
              2% from last month
            </span>
          }
        />
        <DashboardStatCard
          title="Pending Reports"
          value="4"
          icon={FileText}
          index={3}
          footer={<span>have 4 reports today</span>}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_minmax(350px,620px)]">
        <div className="min-w-0 rounded-2xl bg-card p-4 shadow-sm sm:p-5">
          <h2 className="mb-4 text-base font-semibold text-foreground">Todays Appointments</h2>
          <DashboardAppointmentsTable
            rows={paginatedRows}
            onStatusChange={handleStatusChange}
            onInfo={(row) => {
              setDetailRow(row)
              setDetailOpen(true)
            }}
          />
          <Pagination
            currentPage={Math.min(page, totalPages)}
            totalPages={totalPages}
            totalItems={todayRows.length}
            itemsPerPage={perPage}
            onPageChange={setPage}
            showItemsPerPage={false}
            variant="minimal"
            className="mt-4"
          />
        </div>

        <AlertsTasksPanel />
      </div>

      <AppointmentDetailsModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false)
          setDetailRow(null)
        }}
        appointment={detailRow}
      />
    </motion.div>
  )
}
