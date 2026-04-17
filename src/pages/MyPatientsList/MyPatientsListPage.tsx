import { useMemo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { UserRound } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
import { setFilters, setPage, setLimit } from '@/redux/slices/myPatientsListSlice'
import { useUrlParams } from '@/hooks/useUrlState'
import type {
  MyPatientListRecord,
  MyAppointmentsDatePreset,
  PatientListVisitStatus,
} from '@/types'
import { PatientsListTable } from './components/PatientsListTable'
import { PatientListDetailsModal } from './components/PatientListDetailsModal'

const DATE_PRESET_OPTIONS: { value: MyAppointmentsDatePreset; label: string }[] = [
  { value: 'all', label: 'All dates' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
]

const STATUS_FILTER_OPTIONS: { value: PatientListVisitStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All status' },
  { value: 'complete', label: 'Complete' },
  { value: 'absent', label: 'Absent' },
]

export default function MyPatientsListPage() {
  const dispatch = useAppDispatch()
  const { filteredList, pagination } = useAppSelector((state) => state.myPatientsList)
  const { getParam, getNumberParam, setParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const datePreset = (getParam('date', 'all') || 'all') as MyAppointmentsDatePreset
  const statusFilter = (getParam('status', 'all') || 'all') as PatientListVisitStatus | 'all'
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  const [detailRow, setDetailRow] = useState<MyPatientListRecord | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  useEffect(() => {
    dispatch(
      setFilters({
        search,
        datePreset: DATE_PRESET_OPTIONS.some((o) => o.value === datePreset)
          ? datePreset
          : 'all',
        status: STATUS_FILTER_OPTIONS.some((o) => o.value === statusFilter)
          ? statusFilter
          : 'all',
      })
    )
  }, [search, datePreset, statusFilter, dispatch])

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

  const handleStatusFilter = (value: string) => {
    setParams({ status: value, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    setParam('page', newPage)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8EDF5] text-[#1A284B]">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">My Patients List</h1>
            <p className="text-sm text-muted-foreground">
              Search and filter your patient appointment records.
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-white border border-slate-100 shadow-sm overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-1 lg:flex-wrap">
              <SearchInput
                value={search}
                onChange={handleSearch}
                placeholder="Search here"
                className="w-full lg:flex-1 lg:max-w-md xl:max-w-xl"
                inputClassName="h-11 rounded-full border-slate-200 bg-white"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-1">
                <Select value={datePreset} onValueChange={handleDatePreset}>
                  <SelectTrigger className="h-11 w-full sm:w-44 rounded-full border-slate-200 bg-white">
                    <span className="text-xs font-semibold text-muted-foreground mr-1">Date</span>
                    <SelectValue placeholder="All dates" />
                  </SelectTrigger>
                  <SelectContent align="start">
                    {DATE_PRESET_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="h-11 w-full sm:w-44 rounded-full border-slate-200 bg-white">
                    <span className="text-xs font-semibold text-muted-foreground mr-1">Status</span>
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent align="start">
                    {STATUS_FILTER_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <PatientsListTable
        rows={paginatedData}
        onInfo={(row) => {
          setDetailRow(row)
          setDetailOpen(true)
        }}
      />

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

      <PatientListDetailsModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false)
          setDetailRow(null)
        }}
        record={detailRow}
      />
    </motion.div>
  )
}
