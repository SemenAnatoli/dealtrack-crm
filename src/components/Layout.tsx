import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import DashboardFilters from './DashboardFilters'
import DealModal from './modals/DealModal'
import ContactModal from './modals/ContactModal'

export default function Layout() {
  return (
    <div className="min-h-screen w-full bg-[#dce9f8]">
      <Sidebar />
      <div className="grid min-h-[calc(100vh-3rem)] grid-cols-1 gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_176px]">
        <main className="min-w-0">
          <Outlet />
        </main>
        <DashboardFilters />
      </div>
      <DealModal />
      <ContactModal />
    </div>
  )
}
