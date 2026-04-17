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
  MyPatientListRecord,
  MyPatientsListFilters,
  MyAppointmentsDatePreset,
  PaginationState,
} from '@/types'
import { DEFAULT_PAGINATION } from '@/utils/constants'

const PATIENT_NAMES = [
  'Zoya Clinic',
  'Aisha Rahman',
  'Metro Health',
  'Wellness Hub',
  'Star Medical',
  'Care Plus Clinic',
  'Sunrise Medical',
  'Lakeview Practice',
]

const SERVICES = ['MSK', 'GP', 'Cardiology', 'Dental', 'Physio', 'Dermatology']

function matchesDatePreset(iso: string, preset: MyAppointmentsDatePreset): boolean {
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

function buildMockPatientsList(): MyPatientListRecord[] {
  const rows: MyPatientListRecord[] = []
  for (let i = 0; i < 150; i++) {
    const dayOffset = (i % 90) - 40
    const d = new Date()
    d.setHours(9 + (i % 8), (i * 5) % 60, 0, 0)
    d.setDate(d.getDate() + dayOffset)
    const status: MyPatientListRecord['status'] = i % 3 === 0 ? 'absent' : 'complete'

    rows.push({
      id: `pt-${i + 1}`,
      serialNo: String(265853 + i),
      userId: String(256874 + (i % 9000)).padStart(6, '0').slice(-6),
      patientName: PATIENT_NAMES[i % PATIENT_NAMES.length],
      contactNo: `+996541${String(65600 + i).slice(-5)}`,
      service: SERVICES[i % SERVICES.length],
      appointmentDate: d.toISOString(),
      roomNo: `f${(i % 3) + 1}2 ${1206 + (i % 40)}`,
      status,
      notes: i % 12 === 0 ? 'Follow-up recommended.' : undefined,
    })
  }
  return rows
}

const mockList = buildMockPatientsList()

function applyFilters(
  list: MyPatientListRecord[],
  filters: MyPatientsListFilters
): MyPatientListRecord[] {
  let filtered = [...list]

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase().trim()
    filtered = filtered.filter(
      (r) =>
        r.patientName.toLowerCase().includes(q) ||
        r.userId.includes(q) ||
        r.serialNo.includes(q) ||
        r.contactNo.replace(/\s/g, '').includes(q.replace(/\s/g, '')) ||
        r.service.toLowerCase().includes(q) ||
        r.roomNo.toLowerCase().includes(q)
    )
  }

  filtered = filtered.filter((r) => matchesDatePreset(r.appointmentDate, filters.datePreset))

  if (filters.status !== 'all') {
    filtered = filtered.filter((r) => r.status === filters.status)
  }

  return filtered
}

interface MyPatientsListState {
  list: MyPatientListRecord[]
  filteredList: MyPatientListRecord[]
  filters: MyPatientsListFilters
  pagination: PaginationState
}

const limit = 15

const initialFilters: MyPatientsListFilters = {
  search: '',
  datePreset: 'all',
  status: 'all',
}

const initialFiltered = applyFilters(mockList, initialFilters)

const initialState: MyPatientsListState = {
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

const myPatientsListSlice = createSlice({
  name: 'myPatientsList',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<MyPatientsListFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.filteredList = applyFilters(state.list, state.filters)
      state.pagination.total = state.filteredList.length
      state.pagination.totalPages = Math.max(
        1,
        Math.ceil(state.filteredList.length / state.pagination.limit)
      )
      state.pagination.page = 1
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload
      state.pagination.totalPages = Math.max(
        1,
        Math.ceil(state.filteredList.length / action.payload)
      )
      state.pagination.page = 1
    },
  },
})

export const { setFilters, setPage, setLimit } = myPatientsListSlice.actions

export default myPatientsListSlice.reducer
