import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useAppSelector } from '@/redux/hooks'
import { cn } from '@/utils/cn'
import { DASHBOARD_HEADER_H, DASHBOARD_HEADER_SIDEBAR_GAP } from '@/components/layout/dashboardLayoutTokens'

export default function DashboardLayout() {
  const { sidebarCollapsed } = useAppSelector((state) => state.ui)

  const shellTop = `calc(${DASHBOARD_HEADER_H} + ${DASHBOARD_HEADER_SIDEBAR_GAP})`
  const mainMinH = `calc(100vh - ${DASHBOARD_HEADER_H} - ${DASHBOARD_HEADER_SIDEBAR_GAP})`

  return (
    <div className="min-h-screen bg-background ">
      <Header />
      <Sidebar />
      <div
        className={cn(
          'min-w-0 transition-[margin] duration-300 ease-out',
          sidebarCollapsed ? 'lg:ml-[calc(1.25rem+80px)]' : 'lg:ml-[calc(1.25rem+280px)]'
        )}
        style={{ paddingTop: shellTop }}
      >
        <main className="p-6 lg:p-8 " style={{ minHeight: mainMinH }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
