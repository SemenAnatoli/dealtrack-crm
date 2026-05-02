import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useFiltersStore } from '@/store/filtersStore'

const navItems = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/pipeline', label: 'Agents' },
  { to: '/deals', label: 'Deals' },
  { to: '/contacts', label: 'Contacts' },
]

export default function Sidebar() {
  const resetFilters = useFiltersStore((state) => state.resetFilters)
  const [isConfigured, setIsConfigured] = useState(false)

  function setupDashboard() {
    resetFilters()
    setIsConfigured(true)
    window.setTimeout(() => setIsConfigured(false), 1400)
  }

  return (
    <header className="grid min-h-14 grid-cols-1 bg-gradient-to-r from-[#064f9b] via-[#0875bf] to-[#13a6d6] shadow-[0_8px_24px_rgba(7,87,157,0.24)] lg:grid-cols-[520px_minmax(0,1fr)_152px]">
      <div className="flex items-center gap-3 bg-gradient-to-r from-white via-[#eef7ff] to-[#d8efff] px-4 py-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#08b3dc] to-[#0769b4] text-xl font-black text-white shadow-[0_8px_18px_rgba(8,117,191,0.28)]">
          D
        </div>
        <div className="leading-tight">
          <h1 className="text-[22px] font-bold text-slate-900">CRM dashboard</h1>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#0875bf]">DealTrack.io</p>
        </div>
      </div>
      <nav className="flex items-center gap-2 overflow-x-auto px-3 py-2">
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `min-w-24 shrink-0 rounded-md px-4 py-2 text-center text-xs font-semibold text-white transition-all ${
                isActive
                  ? 'bg-white/24 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_6px_14px_rgba(4,42,84,0.18)]'
                  : 'hover:bg-white/14'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center px-3 py-2 lg:justify-end">
        <button
          type="button"
          onClick={setupDashboard}
          className="w-full rounded-md bg-white px-3 py-2.5 text-xs font-bold text-[#07579d] shadow-[0_6px_16px_rgba(4,42,84,0.18)] transition-colors hover:bg-[#eef7ff]"
        >
          {isConfigured ? 'Dashboard ready' : 'Setup dashboard'}
        </button>
      </div>
    </header>
  )
}
