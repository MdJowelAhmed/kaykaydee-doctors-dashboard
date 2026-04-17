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
  DoctorAppointment,
  DoctorAppointmentStatus,
  MyAppointmentsFilters,
  PaginationState,
} from '@/types'
import { DEFAULT_PAGINATION } from '@/utils/constants'

const PATIENT_NAMES = [
  'Zoya Clinic',
  'Northside Care',
  'Metro Health',
  'Wellness Hub',
  'Star Medical',
  'Care Plus Clinic',
  'Sunrise Medical',
  'Lakeview Practice',
]

const SERVICES = ['MSK', 'GP', 'Cardiology', 'Dental', 'Physio', 'Dermatology']

function appointmentMatchesDatePreset(
  iso: string,
  preset: MyAppointmentsFilters['datePreset']
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

function buildMockAppointments(): DoctorAppointment[] {
  const rows: DoctorAppointment[] = []
  for (let i = 0; i < 220; i++) {
    const dayOffset = (i % 120) - 45
    const d = new Date()
    d.setHours(10 + (i % 6), (i * 7) % 60, 0, 0)
    d.setDate(d.getDate() + dayOffset)
    const roll = i % 10
    const status: DoctorAppointmentStatus =
      roll === 0
        ? 'completed'
        : roll === 1
          ? 'cancelled'
          : roll === 2
            ? 'confirmed'
            : 'pending'

    rows.push({
      id: `appt-${i + 1}`,
      serialNo: String(265853 + i),
      userId: String(256874 + (i % 9000)).padStart(6, '0').slice(-6),
      patientName: PATIENT_NAMES[i % PATIENT_NAMES.length],
      contactNo: `+996541${String(65000 + i).slice(-5)}`,
      service: SERVICES[i % SERVICES.length],
      appointmentDate: d.toISOString(),
      roomNo: `fl${(i % 3) + 1} ${1206 + (i % 40)}`,
      status,
      notes: i % 11 === 0 ? 'Bring previous scans if available.' : undefined,
    })
  }
  return rows
}

const mockList = buildMockAppointments()

function applyFilters(
  list: DoctorAppointment[],
  filters: MyAppointmentsFilters
): DoctorAppointment[] {
  let filtered = [...list]

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase().trim()
    filtered = filtered.filter(
      (a) =>
        a.patientName.toLowerCase().includes(q) ||
        a.userId.includes(q) ||
        a.serialNo.includes(q) ||
        a.contactNo.replace(/\s/g, '').includes(q.replace(/\s/g, '')) ||
        a.service.toLowerCase().includes(q) ||
        a.roomNo.toLowerCase().includes(q)
    )
  }

  filtered = filtered.filter((a) =>
    appointmentMatchesDatePreset(a.appointmentDate, filters.datePreset)
  )

  return filtered
}

interface MyAppointmentsState {
  list: DoctorAppointment[]
  filteredList: DoctorAppointment[]
  filters: MyAppointmentsFilters
  pagination: PaginationState
  isLoading: boolean
}

const limit = 10

const initialFiltered = applyFilters(mockList, {
  search: '',
  datePreset: 'all',
})

const initialState: MyAppointmentsState = {
  list: mockList,
  filteredList: initialFiltered,
  filters: {
    search: '',
    datePreset: 'all',
  },
  pagination: {
    ...DEFAULT_PAGINATION,
    page: 1,
    limit,
    total: initialFiltered.length,
    totalPages: Math.max(1, Math.ceil(initialFiltered.length / limit)),
  },
  isLoading: false,
}

const myAppointmentsSlice = createSlice({
  name: 'myAppointments',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<MyAppointmentsFilters>>) => {
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
    updateAppointmentStatus: (
      state,
      action: PayloadAction<{ id: string; status: DoctorAppointmentStatus }>
    ) => {
      const { id, status } = action.payload
      const patch = (row: DoctorAppointment) =>
        row.id === id ? { ...row, status } : row
      state.list = state.list.map(patch)
      state.filteredList = state.filteredList.map(patch)
    },
  },
})

export const { setFilters, setPage, setLimit, updateAppointmentStatus } =
  myAppointmentsSlice.actions

export default myAppointmentsSlice.reducer
