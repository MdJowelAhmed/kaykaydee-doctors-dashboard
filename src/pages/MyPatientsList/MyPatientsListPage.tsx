import { useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
import type { MyAppointmentsDatePreset, PatientListVisitStatus } from '@/types'
import { PatientsListTable } from './components/PatientsListTable'

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
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { filteredList, pagination } = useAppSelector((state) => state.myPatientsList)
  const { getParam, getNumberParam, setParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const datePreset = (getParam('date', 'all') || 'all') as MyAppointmentsDatePreset
  const statusFilter = (getParam('status', 'all') || 'all') as PatientListVisitStatus | 'all'
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

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
  const filterInputClass =  'h-11 rounded-xl border-border bg-white dark:bg-background text-accent shadow-sm placeholder:text-accent'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >


      <div className="overflow-hidden ">
        <div className="">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center justify-end">
              <SearchInput
                value={search}
                onChange={handleSearch}
                placeholder="Search here"
                className="w-full lg:flex-1 lg:max-w-md xl:max-w-xl"
                inputClassName={filterInputClass}
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-1">
                <Select value={datePreset} onValueChange={handleDatePreset}>
                  <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[160px] ${filterInputClass}`}>
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
                  <SelectTrigger className={`h-11 w-full shrink-0 sm:w-[160px] ${filterInputClass}`}>
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
        </div>
      </div>

 <div className='p-4 bg-card rounded-3xl'>
 <PatientsListTable
        rows={paginatedData}
        onInfo={(row) => navigate(`/my-patients-list/${row.id}`)}
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

    </motion.div>
  )
}
