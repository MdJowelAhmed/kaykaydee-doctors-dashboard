import { useMemo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Pagination } from '@/components/common/Pagination'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setPage, setLimit } from '@/redux/slices/scheduleSlice'
import { useUrlParams } from '@/hooks/useUrlState'
import type { ScheduleRecord } from '@/types'
import { ScheduleTable } from './components/ScheduleTable'
import { ScheduleDetailsModal } from './components/ScheduleDetailsModal'

export default function SchedulePage() {
  const dispatch = useAppDispatch()
  const { list, pagination } = useAppSelector((state) => state.schedule)
  const { getNumberParam, setParam } = useUrlParams()

  const page = getNumberParam('page', 1)
  const limit = getNumberParam('limit', 15)

  const [detailRow, setDetailRow] = useState<ScheduleRecord | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  useEffect(() => {
    dispatch(setPage(page))
  }, [page, dispatch])

  useEffect(() => {
    dispatch(setLimit(limit))
  }, [limit, dispatch])

  const totalPages = Math.max(1, Math.ceil(list.length / pagination.limit))

  const paginatedData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit
    return list.slice(startIndex, startIndex + pagination.limit)
  }, [list, pagination.page, pagination.limit])

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

          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Schedule</h1>
            <p className="text-sm text-muted-foreground">
              Duty roster by day, hours, and date range.
            </p>
          </div>
        </div>
      </div>

      <div className='p-4 bg-card rounded-3xl'>
        <ScheduleTable
          rows={paginatedData}
          onInfo={(row) => {
            setDetailRow(row)
            setDetailOpen(true)
          }}
        />
      </div>

      <Pagination
        currentPage={Math.min(pagination.page, totalPages)}
        totalPages={totalPages}
        totalItems={list.length}
        itemsPerPage={pagination.limit}
        onPageChange={handlePageChange}
        showItemsPerPage={false}
        variant="minimal"
        className="px-1"
      />

      <ScheduleDetailsModal
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
