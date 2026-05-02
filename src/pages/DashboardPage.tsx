import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useState, type ReactNode } from 'react'
import { useDeals } from '@/hooks/useDeals'
import { useContacts } from '@/hooks/useContacts'
import { useFiltersStore } from '@/store/filtersStore'
import { DEAL_STAGES, type Contact, type Deal } from '@/types'
import {
  calcOpenPipeline,
  calcTotalsByStage,
  calcWonRevenue,
  filterDeals,
} from '@/lib/dealMetrics'
import { mergeDemoContacts, mergeDemoDeals } from '@/lib/demoData'

const COLORS = ['#0076c8', '#39b8f2', '#6532bf', '#8ea6bb', '#ff6f78', '#33c783']

export default function DashboardPage() {
  const [layoutVariant, setLayoutVariant] = useState<'classic' | 'kpiRight'>('classic')
  const { data: deals = [], isLoading: isDealsLoading, error: dealsError } = useDeals()
  const { data: contacts = [], isLoading: isContactsLoading, error: contactsError } = useContacts()
  const { search, stageFilter, ownerFilter, pipelineFilter } = useFiltersStore()

  const analyticsContacts = mergeDemoContacts(contacts)
  const analyticsDeals = mergeDemoDeals(deals)
  const scopedDeals = filterDeals(analyticsDeals, search, stageFilter, ownerFilter, pipelineFilter)
  const totalRevenue = calcWonRevenue(scopedDeals)
  const pipeline = calcOpenPipeline(scopedDeals)
  const totalsByStage = calcTotalsByStage(scopedDeals)
  const openDeals = scopedDeals.filter((deal) => !['won', 'lost'].includes(deal.stage)).length
  const wonDeals = scopedDeals.filter((deal) => deal.stage === 'won').length
  const lostDeals = scopedDeals.filter((deal) => deal.stage === 'lost').length
  const winRate = wonDeals + lostDeals > 0 ? (wonDeals / (wonDeals + lostDeals)) * 100 : 0
  const avgDeal = scopedDeals.length
    ? scopedDeals.reduce((sum, deal) => sum + deal.amount, 0) / scopedDeals.length
    : 0
  const isLoading = isDealsLoading || isContactsLoading
  const error = dealsError ?? contactsError

  const stageData = DEAL_STAGES.map((stage, index) => ({
    name: stage.label,
    amount: totalsByStage[stage.id],
    count: scopedDeals.filter((deal) => deal.stage === stage.id).length,
    color: COLORS[index],
  }))

  const pieData = stageData
    .filter((stage) => stage.amount > 0)
    .map((stage) => ({ name: stage.name, value: stage.amount, color: stage.color }))
  const agentRows = buildAgentRows(analyticsContacts, scopedDeals).slice(0, 24)
  const trendData = buildTrendData(scopedDeals)
  const metrics = [
    { label: 'Total sales', value: formatMoney(totalRevenue + pipeline), tone: 'violet' as const },
    { label: 'Won deals', value: wonDeals.toLocaleString('ru-RU'), tone: 'blue' as const },
    { label: 'Win rate', value: `${formatPercent(winRate)}%`, tone: 'cyan' as const },
    { label: 'Avg deal value', value: formatMoney(avgDeal), tone: 'green' as const },
    { label: 'Pipeline value', value: formatMoney(pipeline), tone: 'violet' as const },
    { label: 'Open deals', value: openDeals.toLocaleString('ru-RU'), tone: 'blue' as const },
    { label: 'Contacts', value: analyticsContacts.length.toLocaleString('ru-RU'), tone: 'cyan' as const },
    { label: 'Deals in view', value: scopedDeals.length.toLocaleString('ru-RU'), tone: 'green' as const },
  ]

  const charts = {
    salesPipeline: (
      <Panel title="Sales pipeline">
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie
              data={pieData.length ? pieData : [{ name: 'Нет данных', value: 1, color: '#cbd5e1' }]}
              dataKey="value"
              nameKey="name"
              innerRadius={48}
              outerRadius={76}
              paddingAngle={1}
            >
              {(pieData.length ? pieData : [{ color: '#cbd5e1' }]).map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${Number(value).toLocaleString('ru-RU')} ₽`, 'Сумма']} />
          </PieChart>
        </ResponsiveContainer>
      </Panel>
    ),
    stagePipeline: (
      <Panel title="Sales pipeline by stage">
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={stageData} barSize={30}>
            <CartesianGrid stroke="#d8e1ed" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip formatter={(value) => [`${Number(value).toLocaleString('ru-RU')} ₽`, 'Сумма']} />
            <Bar dataKey="amount" radius={[5, 5, 0, 0]}>
              {stageData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    ),
    wonDeals: (
      <Panel title="Won deals (last 6 months)">
        <ResponsiveContainer width="100%" height={210}>
          <LineChart data={trendData}>
            <CartesianGrid stroke="#d8e1ed" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip formatter={(value) => [`${Number(value).toLocaleString('ru-RU')} ₽`, 'Сумма']} />
            <Line type="monotone" dataKey="won" stroke="#0076c8" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="open" stroke="#39b8f2" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Panel>
    ),
    projection: (
      <Panel title="Deals projection">
        <ResponsiveContainer width="100%" height={230}>
          <AreaChart data={trendData}>
            <CartesianGrid stroke="#d8e1ed" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip formatter={(value) => [`${Number(value).toLocaleString('ru-RU')} ₽`, 'Сумма']} />
            <Area type="monotone" dataKey="projected" stroke="#6532bf" fill="#6532bf" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>
    ),
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error.message}
        </p>
      )}

      {isLoading && (
        <p className="rounded-lg bg-white px-4 py-3 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
          Загрузка данных...
        </p>
      )}

      <LayoutSwitcher active={layoutVariant} onChange={setLayoutVariant} />

      {layoutVariant === 'classic' ? (
        <>
          <section className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </section>

          <section className="grid gap-3 lg:grid-cols-2">
            <div className="space-y-3">
              {charts.salesPipeline}
              {charts.stagePipeline}
            </div>
            <div className="space-y-3">
              {charts.wonDeals}
              {charts.projection}
            </div>
          </section>
        </>
      ) : (
        <section className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px] 2xl:grid-cols-[minmax(0,1fr)_260px]">
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="space-y-3">
              {charts.salesPipeline}
              {charts.stagePipeline}
            </div>
            <div className="space-y-3">
              {charts.wonDeals}
              {charts.projection}
            </div>
          </div>
          <aside className="grid content-start gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} mode="gradient" />
            ))}
          </aside>
        </section>
      )}

      <Panel title="Agent performance">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-700">
                <th className="px-3 py-2 font-semibold">Owner</th>
                <th className="px-3 py-2 text-right font-semibold">Closed amount</th>
                <th className="px-3 py-2 text-right font-semibold">Deals</th>
                <th className="px-3 py-2 text-right font-semibold">Open deals</th>
                <th className="px-3 py-2 text-right font-semibold">Lost deals</th>
                <th className="px-3 py-2 text-right font-semibold">Won deals</th>
                <th className="px-3 py-2 text-right font-semibold">Win rate</th>
              </tr>
            </thead>
            <tbody>
              {agentRows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-3 py-2 font-medium text-slate-800">{row.name}</td>
                  <HeatCell value={row.closedAmount} max={agentRows[0]?.closedAmount ?? 0}>
                    {formatMoney(row.closedAmount)}
                  </HeatCell>
                  <HeatCell value={row.deals} max={Math.max(...agentRows.map((item) => item.deals), 1)}>
                    {row.deals}
                  </HeatCell>
                  <HeatCell value={row.openDeals} max={Math.max(...agentRows.map((item) => item.openDeals), 1)}>
                    {row.openDeals}
                  </HeatCell>
                  <HeatCell value={row.lostDeals} max={Math.max(...agentRows.map((item) => item.lostDeals), 1)} warm>
                    {row.lostDeals}
                  </HeatCell>
                  <HeatCell value={row.wonDeals} max={Math.max(...agentRows.map((item) => item.wonDeals), 1)}>
                    {row.wonDeals}
                  </HeatCell>
                  <HeatCell value={row.winRate} max={100}>
                    {formatPercent(row.winRate)}%
                  </HeatCell>
                </tr>
              ))}
            </tbody>
          </table>
          {agentRows.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">Нет данных по выбранным фильтрам</p>
          )}
        </div>
      </Panel>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-[0_4px_14px_rgba(9,87,157,0.08)]">
      <h2 className="mb-2 text-sm font-semibold text-slate-800">{title}</h2>
      {children}
    </section>
  )
}

function LayoutSwitcher({
  active,
  onChange,
}: {
  active: 'classic' | 'kpiRight'
  onChange: (value: 'classic' | 'kpiRight') => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-[0_4px_14px_rgba(9,87,157,0.08)]">
      <p className="px-2 text-xs font-medium text-slate-600">Dashboard layout preview</p>
      <div className="flex rounded-md bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => onChange('classic')}
          className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
            active === 'classic'
              ? 'bg-[#0076c8] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Variant A
        </button>
        <button
          type="button"
          onClick={() => onChange('kpiRight')}
          className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
            active === 'kpiRight'
              ? 'bg-[#0076c8] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Variant B
        </button>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  tone,
  mode = 'compact',
}: {
  label: string
  value: string
  tone: 'violet' | 'blue' | 'cyan' | 'green'
  mode?: 'compact' | 'gradient'
}) {
  const tones = {
    violet: 'border-t-[#6741d9]',
    blue: 'border-t-[#0076c8]',
    cyan: 'border-t-[#00a6cf]',
    green: 'border-t-[#18c488]',
  }
  const gradients = {
    violet: 'from-[#6741d9] to-[#5b2dae]',
    blue: 'from-[#0b78d1] to-[#07579d]',
    cyan: 'from-[#0aa4cf] to-[#0875bf]',
    green: 'from-[#19c88b] to-[#10ae7a]',
  }

  if (mode === 'gradient') {
    return (
      <article className={`rounded-lg bg-gradient-to-br ${gradients[tone]} p-3 text-white shadow-[0_6px_18px_rgba(9,87,157,0.16)]`}>
        <p className="text-[10px] font-semibold opacity-90">{label}</p>
        <p className="mt-2 text-2xl font-bold leading-none">{value}</p>
      </article>
    )
  }

  return (
    <article className={`rounded-lg border border-t-4 border-slate-200 bg-white px-3 py-2.5 shadow-[0_4px_14px_rgba(9,87,157,0.08)] ${tones[tone]}`}>
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold leading-tight text-slate-900">{value}</p>
    </article>
  )
}

function HeatCell({
  children,
  value,
  max,
  warm = false,
}: {
  children: ReactNode
  value: number
  max: number
  warm?: boolean
}) {
  const opacity = max > 0 ? Math.max(0.12, Math.min(value / max, 1) * 0.55) : 0.12
  const background = warm ? `rgba(255, 111, 120, ${opacity})` : `rgba(0, 118, 200, ${opacity})`

  return (
    <td className="px-3 py-2 text-right tabular-nums" style={{ background }}>
      {children}
    </td>
  )
}

function buildAgentRows(contacts: Contact[], deals: Deal[]) {
  return contacts
    .map((contact) => {
      const contactDeals = deals.filter((deal) => deal.contact_id === contact.id)
      const wonDeals = contactDeals.filter((deal) => deal.stage === 'won')
      const lostDeals = contactDeals.filter((deal) => deal.stage === 'lost')
      const openDeals = contactDeals.filter((deal) => !['won', 'lost'].includes(deal.stage))
      const closedAmount = wonDeals.reduce((sum, deal) => sum + deal.amount, 0)
      const winRate = wonDeals.length + lostDeals.length > 0
        ? (wonDeals.length / (wonDeals.length + lostDeals.length)) * 100
        : 0

      return {
        id: contact.id,
        name: contact.name,
        closedAmount,
        deals: contactDeals.length,
        openDeals: openDeals.length,
        lostDeals: lostDeals.length,
        wonDeals: wonDeals.length,
        winRate,
      }
    })
    .filter((row) => row.deals > 0)
    .sort((a, b) => b.closedAmount - a.closedAmount || b.deals - a.deals)
}

function buildTrendData(deals: Deal[]) {
  const now = new Date()

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    const monthDeals = deals.filter((deal) => {
      const createdAt = new Date(deal.created_at)
      return createdAt.getFullYear() === date.getFullYear() && createdAt.getMonth() === date.getMonth()
    })
    const open = monthDeals
      .filter((deal) => !['won', 'lost'].includes(deal.stage))
      .reduce((sum, deal) => sum + deal.amount, 0)
    const won = monthDeals
      .filter((deal) => deal.stage === 'won')
      .reduce((sum, deal) => sum + deal.amount, 0)

    return {
      month: date.toLocaleDateString('ru-RU', { month: 'short' }),
      open,
      won,
      projected: open + won,
    }
  })
}

function formatMoney(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString('ru-RU', {
      maximumFractionDigits: 1,
    })}M ₽`
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toLocaleString('ru-RU', {
      maximumFractionDigits: 0,
    })}K ₽`
  }

  return `${Math.round(value).toLocaleString('ru-RU')} ₽`
}

function formatPercent(value: number) {
  return value.toLocaleString('ru-RU', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })
}
