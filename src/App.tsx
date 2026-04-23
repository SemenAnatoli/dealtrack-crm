import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import DashboardPage from '@/pages/DashboardPage'
import PipelinePage from '@/pages/PipelinePage'
import ContactsPage from '@/pages/ContactsPage'
import DealsPage from '@/pages/DealsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="pipeline" element={<PipelinePage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="deals" element={<DealsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
