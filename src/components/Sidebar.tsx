import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Дашборд',   icon: '📊' },
  { to: '/pipeline',  label: 'Pipeline',  icon: '🗂️' },
  { to: '/deals',     label: 'Сделки',    icon: '💼' },
  { to: '/contacts',  label: 'Контакты',  icon: '👥' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col">
      <div className="px-5 py-5 border-b border-slate-200">
        <span className="text-lg font-bold text-slate-800">DealTrack</span>
        <span className="ml-1 text-xs text-slate-400">CRM</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200 text-xs text-slate-400">
        v1.0.0
      </div>
    </aside>
  )
}
