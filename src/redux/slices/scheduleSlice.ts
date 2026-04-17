import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { addDays, format, getDay } from 'date-fns'
import type { ScheduleRecord, PaginationState } from '@/types'
import { DEFAULT_PAGINATION } from '@/utils/constants'

function buildMockSchedule(): ScheduleRecord[] {
  const rows: ScheduleRecord[] = []
  const baseMonday = new Date(2026, 0, 5)
  for (let i = 0; i < 150; i++) {
    const d = addDays(baseMonday, i)
    const day = getDay(d)
    const isSunday = day === 0
    const applyDay = format(d, 'EEEE')
    rows.push({
      id: `sch-${i + 1}`,
      serialNo: String(i + 1),
      applyDay,
      dutyHours: isSunday ? null : 3,
      rangeStart: isSunday ? null : d.toISOString(),
      rangeEnd: isSunday ? null : d.toISOString(),
    })
  }
  return rows
}

const mockList = buildMockSchedule()

const limit = 15

interface ScheduleState {
  list: ScheduleRecord[]
  pagination: PaginationState
}

const initialState: ScheduleState = {
  list: mockList,
  pagination: {
    ...DEFAULT_PAGINATION,
    page: 1,
    limit,
    total: mockList.length,
    totalPages: Math.max(1, Math.ceil(mockList.length / limit)),
  },
}

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload
      state.pagination.totalPages = Math.max(
        1,
        Math.ceil(state.list.length / action.payload)
      )
      state.pagination.page = 1
    },
  },
})

export const { setPage, setLimit } = scheduleSlice.actions

export default scheduleSlice.reducer
