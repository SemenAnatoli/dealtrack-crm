import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { useDeals } from '@/hooks/useDeals'
import { useContacts } from '@/hooks/useContacts'
import { DEAL_STAGES } from '@/types'

const COLORS = ['#94a3b8', '#60a5fa', '#a78bfa', '#fbbf24', '#34d399', '#f87171']

export default function DashboardPage() {
  const { data: deals = [] } = useDeals()
  const { data: contacts = [] } = useContacts()

  const totalRevenue = deals
    .filter((d) => d.stage === 'won')
    .reduce((sum, d) => sum + d.amount, 0)

  const pipeline = deals
    .filter((d) => !['won', 'lost'].includes(d.stage))
    .reduce((sum, d) => sum + d.amount, 0)

  const chartData = DEAL_STAGES.map((stage, i) => ({
    name: stage.label,
    amount: deals.filter((d) => d.stage === stage.id).reduce((s, d) => s + d.amount, 0),
    count: deals.filter((d) => d.stage === stage.id).length,
    color: COLORS[i],
  }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Дашборд</h1>

      {/* Метрики */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Всего сделок" value={deals.length} suffix="" />
        <MetricCard label="Контактов" value={contacts.length} suffix="" />
        <MetricCard
          label="Выручка (закрытые)"
          value={totalRevenue.toLocaleString('ru-RU')}
          suffix=" ₽"
          highlight
        />
        <MetricCard
          label="В работе"
          value={pipeline.toLocaleString('ru-RU')}
          suffix=" ₽"
        />
      </div>

      {/* График */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-base font-semibold text-slate-700 mb-4">Воронка по стадиям</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barSize={40}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toLocaleString('ru-RU')} ₽`, 'Сумма']}
              labelStyle={{ fontWeight: 600 }}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function MetricCard({
  label, value, suffix, highlight = false,
}: {
  label: string
  value: string | number
  suffix: string
  highlight?: boolean
}) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'}`}>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${highlight ? 'text-indigo-700' : 'text-slate-800'}`}>
        {value}{suffix}
      </p>
    </div>
  )
}
