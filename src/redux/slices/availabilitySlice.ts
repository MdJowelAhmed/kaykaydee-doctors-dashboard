import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
} from 'date-fns'
import type {
  AvailabilityFilters,
  AvailabilityRecord,
  AvailabilityStatus,
  MyAppointmentsDatePreset,
  PaginationState,
} from '@/types'
import { DEFAULT_PAGINATION } from '@/utils/constants'

function matchesDatePreset(
  iso: string,
  preset: MyAppointmentsDatePreset
): boolean {
  if (preset === 'all') return true
  const d = parseISO(iso)
  const now = new Date()
  if (preset === 'today') {
    return isWithinInterval(d, { start: startOfDay(now), end: endOfDay(now) })
  }
  if (preset === 'week') {
    return isWithinInterval(d, {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    })
  }
  if (preset === 'month') {
    return isWithinInterval(d, { start: startOfMonth(now), end: endOfMonth(now) })
  }
  return true
}

function applyFilters(list: AvailabilityRecord[], filters: AvailabilityFilters): AvailabilityRecord[] {
  let filtered = [...list]

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase().trim()
    filtered = filtered.filter((r) => {
      const rangeText = `${r.rangeStart} ${r.rangeEnd}`.toLowerCase()
      return (
        r.serialNo.includes(q) ||
        String(r.blockDays).includes(q) ||
        rangeText.includes(q) ||
        r.status.toLowerCase().includes(q)
      )
    })
  }

  filtered = filtered.filter((r) => matchesDatePreset(r.applyDate, filters.datePreset))

  if (filters.status !== 'all') {
    filtered = filtered.filter((r) => r.status === filters.status)
  }

  return filtered
}

function recomputePagination(state: {
  filteredList: AvailabilityRecord[]
  pagination: PaginationState
}) {
  state.pagination.total = state.filteredList.length
  state.pagination.totalPages = Math.max(
    1,
    Math.ceil(state.filteredList.length / state.pagination.limit)
  )
  if (state.pagination.page > state.pagination.totalPages) {
    state.pagination.page = state.pagination.totalPages
  }
}

function buildMockAvailability(): AvailabilityRecord[] {
  const rows: AvailabilityRecord[] = []
  for (let i = 0; i < 150; i++) {
    const apply = new Date()
    apply.setHours(12, 0, 0, 0)
    apply.setDate(apply.getDate() - (i % 70))

    const blockDays = 1 + (i % 5)
    const start = new Date(apply)
    start.setDate(start.getDate() + (i % 4))
    const end = new Date(start)
    end.setDate(end.getDate() + blockDays - 1)

    const roll = i % 7
    const status: AvailabilityStatus =
      roll === 0 ? 'approved' : roll === 1 ? 'rejected' : 'pending'

    rows.push({
      id: `avail-${i + 1}`,
      serialNo: String(880100 + i),
      applyDate: apply.toISOString(),
      blockDays,
      rangeStart: start.toISOString(),
      rangeEnd: end.toISOString(),
      status,
    })
  }
  return rows
}

const mockList = buildMockAvailability()

const limit = 15

const initialFilters: AvailabilityFilters = {
  search: '',
  datePreset: 'all',
  status: 'all',
}

const initialFiltered = applyFilters(mockList, initialFilters)

interface AvailabilityState {
  list: AvailabilityRecord[]
  filteredList: AvailabilityRecord[]
  filters: AvailabilityFilters
  pagination: PaginationState
}

const initialState: AvailabilityState = {
  list: mockList,
  filteredList: initialFiltered,
  filters: initialFilters,
  pagination: {
    ...DEFAULT_PAGINATION,
    page: 1,
    limit,
    total: initialFiltered.length,
    totalPages: Math.max(1, Math.ceil(initialFiltered.length / limit)),
  },
}

const availabilitySlice = createSlice({
  name: 'availability',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<AvailabilityFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.filteredList = applyFilters(state.list, state.filters)
      state.pagination.page = 1
      recomputePagination(state)
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload
      state.pagination.page = 1
      recomputePagination(state)
    },
    addRecord: (
      state,
      action: PayloadAction<{
        applyDate: string
        blockDays: number
        rangeStart: string
        rangeEnd: string
        status?: AvailabilityStatus
      }>
    ) => {
      const nextSerial = String(
        state.list.reduce((m, r) => Math.max(m, Number(r.serialNo) || 0), 0) + 1
      )
      const id = `avail-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      const row: AvailabilityRecord = {
        id,
        serialNo: nextSerial,
        applyDate: action.payload.applyDate,
        blockDays: action.payload.blockDays,
        rangeStart: action.payload.rangeStart,
        rangeEnd: action.payload.rangeEnd,
        status: action.payload.status ?? 'pending',
      }
      state.list = [row, ...state.list]
      state.filteredList = applyFilters(state.list, state.filters)
      state.pagination.page = 1
      recomputePagination(state)
    },
    updateRecord: (
      state,
      action: PayloadAction<
        { id: string } & Partial<Omit<AvailabilityRecord, 'id' | 'serialNo'>>
      >
    ) => {
      const { id, ...patch } = action.payload
      const idx = state.list.findIndex((r) => r.id === id)
      if (idx === -1) return
      state.list[idx] = { ...state.list[idx], ...patch }
      state.filteredList = applyFilters(state.list, state.filters)
      recomputePagination(state)
    },
    removeRecord: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((r) => r.id !== action.payload)
      state.filteredList = applyFilters(state.list, state.filters)
      recomputePagination(state)
    },
  },
})

export const { setFilters, setPage, setLimit, addRecord, updateRecord, removeRecord } =
  availabilitySlice.actions

export default availabilitySlice.reducer
