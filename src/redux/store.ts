import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import categoryReducer from './slices/categorySlice'
import uiReducer, { UI_INITIAL_STATE } from './slices/uiSlice'
import { getThemeFromStorage, persistTheme } from '@/utils/theme'
import calendarReducer from './slices/calendarSlice'
import transactionReducer from './slices/transactionSlice'
import faqReducer from './slices/faqSlice'
import clinicReducer from './slices/clinicSlice'
import myAppointmentsReducer from './slices/myAppointmentsSlice'
import availabilityReducer from './slices/availabilitySlice'
import myPatientsListReducer from './slices/myPatientsListSlice'
import scheduleReducer from './slices/scheduleSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    clinics: clinicReducer,
    myAppointments: myAppointmentsReducer,
    availability: availabilityReducer,
    myPatientsList: myPatientsListReducer,
    schedule: scheduleReducer,
    categories: categoryReducer,
    ui: uiReducer,
    calendar: calendarReducer,
    transactions: transactionReducer,
    faqs: faqReducer,
  },
  preloadedState: {
    ui: {
      ...UI_INITIAL_STATE,
      theme: getThemeFromStorage(),
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

let lastPersistedTheme = store.getState().ui.theme
store.subscribe(() => {
  const next = store.getState().ui.theme
  if (next !== lastPersistedTheme) {
    lastPersistedTheme = next
    persistTheme(next)
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
