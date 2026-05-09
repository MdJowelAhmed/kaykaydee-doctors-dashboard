import { useMemo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarCheck } from 'lucide-react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  setFilters,
  setPage,
  setLimit,
  updateAppointmentStatus,
} from '@/redux/slices/myAppointmentsSlice'
import { useUrlParams } from '@/hooks/useUrlState'
import type { DoctorAppointment, DoctorAppointmentStatus, MyAppointmentsDatePreset } from '@/types'
import { AppointmentsTable } from './components/AppointmentsTable'
import { AppointmentDetailsModal } from './components/AppointmentDetailsModal'

const DATE_PRESET_OPTIONS: { value: MyAppointmentsDatePreset; label: string }[] = [
  { value: 'all', label: 'All dates' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
]

export default function MyAppointmentsPage() {
  const dispatch = useAppDispatch()
  const { filteredList, pagination } = useAppSelector((state) => state.myAppointments)
  const { getParam, getNumberParam, setParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const datePreset = (getParam('date', 'all') || 'all') as MyAppointmentsDatePreset
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 10)

  const [detailRow, setDetailRow] = useState<DoctorAppointment | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  useEffect(() => {
    dispatch(
      setFilters({
        search,
        datePreset: DATE_PRESET_OPTIONS.some((o) => o.value === datePreset)
          ? datePreset
          : 'all',
      })
    )
  }, [search, datePreset, dispatch])

  useEffect(() => {
    dispatch(setPage(page))
  }, [page, dispatch])

  useEffect(() => {
    dispatch(setLimit(limit))
  }, [limit, dispatch])

  const totalPages = Math.max(1, Math.ceil(filteredList.length / pagination.limit))

  const paginatedData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit
    return filteredList.slice(startIndex, startIndex + pagination.limit)
  }, [filteredList, pagination.page, pagination.limit])

  const handleSearch = (value: string) => {
    setParams({ search: value, page: 1 })
  }

  const handleDatePreset = (value: string) => {
    setParams({ date: value, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    setParam('page', newPage)
  }

  const handleStatusChange = (id: string, status: DoctorAppointmentStatus) => {
    dispatch(updateAppointmentStatus({ id, status }))
    toast.success('Status updated')
  }

  const handleInfo = (row: DoctorAppointment) => {
    setDetailRow(row)
    setDetailOpen(true)
  }

  const filterInputClass =  'h-11 rounded-xl border-border bg-white dark:bg-background text-accent shadow-sm placeholder:text-accent'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        
      </div>

      <div className="overflow-hidden flex items-center justify-between gap-4 ">
      <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-card text-accent shadow-sm ring-1 ring-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-400/25"
          >
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">My Appointments</h1>
            <p className="text-sm text-accent">
              Search, filter by date, and manage appointment status.
            </p>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder="Search here"
              className="w-full lg:flex-1 lg:max-w-xl"
              inputClassName={filterInputClass}
            />
            <Select value={datePreset} onValueChange={handleDatePreset}>
              <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[160px] ${filterInputClass}`}>
                <span className="text-xs font-semibold text-muted-foreground shrink-0"></span>
                <SelectValue placeholder="All dates" />
              </SelectTrigger>
              <SelectContent align="end">
                {DATE_PRESET_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

   <div className='p-4 bg-card rounded-3xl'>
   <AppointmentsTable
        appointments={paginatedData}
        onStatusChange={handleStatusChange}
        onInfo={handleInfo}
      />
   </div>

      <Pagination
        currentPage={Math.min(pagination.page, totalPages)}
        totalPages={totalPages}
        totalItems={filteredList.length}
        itemsPerPage={pagination.limit}
        onPageChange={handlePageChange}
        showItemsPerPage={false}
        variant="minimal"
        className="px-1"
      />

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
