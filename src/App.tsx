import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'

const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const PipelinePage = lazy(() => import('@/pages/PipelinePage'))
const ContactsPage = lazy(() => import('@/pages/ContactsPage'))
const DealsPage = lazy(() => import('@/pages/DealsPage'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="pipeline" element={<PipelinePage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="deals" element={<DealsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#dce9f8] text-sm font-medium text-[#07579d]">
      Loading dashboard...
    </div>
  )
}
