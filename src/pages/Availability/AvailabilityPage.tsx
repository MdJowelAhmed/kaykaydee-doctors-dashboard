import { useMemo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarOff, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  setFilters,
  setPage,
  setLimit,
  addRecord,
  updateRecord,
  removeRecord,
} from '@/redux/slices/availabilitySlice'
import { useUrlParams } from '@/hooks/useUrlState'
import type { AvailabilityRecord, MyAppointmentsDatePreset, AvailabilityStatus } from '@/types'
import { AvailabilityTable } from './components/AvailabilityTable'
import { AvailabilityDetailsModal } from './components/AvailabilityDetailsModal'
import {
  AddEditAvailabilityModal,
  type AvailabilityFormPayload,
} from './components/AddEditAvailabilityModal'

const DATE_PRESET_OPTIONS: { value: MyAppointmentsDatePreset; label: string }[] = [
  { value: 'all', label: 'All dates' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
]

const STATUS_FILTER_OPTIONS: { value: AvailabilityStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

export default function AvailabilityPage() {
  const dispatch = useAppDispatch()
  const { filteredList, pagination } = useAppSelector((state) => state.availability)
  const { getParam, getNumberParam, setParam, setParams } = useUrlParams()

  const search = getParam('search', '')
  const datePreset = (getParam('date', 'all') || 'all') as MyAppointmentsDatePreset
  const statusFilter = (getParam('status', 'all') || 'all') as AvailabilityStatus | 'all'
  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  const [detailRecord, setDetailRecord] = useState<AvailabilityRecord | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add')
  const [editingRecord, setEditingRecord] = useState<AvailabilityRecord | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<AvailabilityRecord | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

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

  const openAdd = () => {
    setFormMode('add')
    setEditingRecord(null)
    setFormOpen(true)
  }

  const openEdit = (row: AvailabilityRecord) => {
    setFormMode('edit')
    setEditingRecord(row)
    setFormOpen(true)
  }

  const handleFormSave = (payload: AvailabilityFormPayload) => {
    if (formMode === 'edit' && editingRecord) {
      dispatch(
        updateRecord({
          id: editingRecord.id,
          applyDate: payload.applyDate,
          blockDays: payload.blockDays,
          rangeStart: payload.rangeStart,
          rangeEnd: payload.rangeEnd,
          status: payload.status,
        })
      )
      toast.success('Availability updated')
    } else {
      dispatch(
        addRecord({
          applyDate: payload.applyDate,
          blockDays: payload.blockDays,
          rangeStart: payload.rangeStart,
          rangeEnd: payload.rangeEnd,
          status: payload.status,
        })
      )
      toast.success('Availability added')
    }
    setFormOpen(false)
    setEditingRecord(null)
  }

  const openDelete = (row: AvailabilityRecord) => {
    setDeleteTarget(row)
    setDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      dispatch(removeRecord(deleteTarget.id))
      toast.success('Record removed')
      setDeleteOpen(false)
      setDeleteTarget(null)
    } finally {
      setDeleteLoading(false)
    }
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
            <CalendarOff className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Availability</h1>
            <p className="text-sm text-muted-foreground">
              Manage time off and unavailability blocks.
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-white border border-slate-100 shadow-sm overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
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
            <Button
              type="button"
              onClick={openAdd}
              className="h-11 shrink-0 rounded-full bg-[#1A284B] px-5 text-white hover:bg-[#1A284B]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Availability
            </Button>
          </div>
        </CardContent>
      </Card>

      <AvailabilityTable
        rows={paginatedData}
        onInfo={(row) => {
          setDetailRecord(row)
          setDetailOpen(true)
        }}
        onEdit={openEdit}
        onDelete={openDelete}
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

      <AvailabilityDetailsModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false)
          setDetailRecord(null)
        }}
        record={detailRecord}
      />

      <AddEditAvailabilityModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingRecord(null)
        }}
        mode={formMode}
        record={editingRecord}
        onSave={handleFormSave}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false)
          setDeleteTarget(null)
        }}
        onConfirm={confirmDelete}
        title="Delete availability"
        description={
          deleteTarget
            ? `Remove block #${deleteTarget.serialNo}? This cannot be undone.`
            : ''
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteLoading}
      />
    </motion.div>
  )
}
