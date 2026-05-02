import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import KanbanBoard from '@/components/kanban/KanbanBoard'
import { useContacts } from '@/hooks/useContacts'
import { useDeals } from '@/hooks/useDeals'
import { mergeDemoContacts, mergeDemoDeals } from '@/lib/demoData'
import { useUIStore } from '@/store/uiStore'
import { DEAL_STAGES } from '@/types'

const COLORS = ['#0076c8', '#39b8f2', '#6532bf', '#8ea6bb', '#ff6f78', '#33c783']

export default function PipelinePage() {
  const openDealModal = useUIStore((s) => s.openDealModal)
  const { data: deals = [] } = useDeals()
  const { data: contacts = [] } = useContacts()
  const analyticsDeals = mergeDemoDeals(deals)
  const analyticsContacts = mergeDemoContacts(contacts)

  const agentData = analyticsContacts
    .map((contact) => {
      const contactDeals = analyticsDeals.filter((deal) => deal.contact_id === contact.id)
      const totals = Object.fromEntries(
        DEAL_STAGES.map((stage) => [
          stage.id,
          contactDeals
            .filter((deal) => deal.stage === stage.id)
            .reduce((sum, deal) => sum + deal.amount, 0),
        ])
      )

      return {
        name: contact.name,
        total: contactDeals.reduce((sum, deal) => sum + deal.amount, 0),
        ...totals,
      }
    })
    .filter((agent) => agent.total > 0)
    .sort((a, b) => b.total - a.total)

  return (
    <div className="flex flex-col gap-3">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Agents</h1>
        <button
          type="button"
          onClick={() => openDealModal()}
          className="rounded-md bg-[#0076c8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#07579d]"
        >
          + Новая сделка
        </button>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-[0_4px_14px_rgba(9,87,157,0.08)]">
        <h2 className="mb-2 text-sm font-semibold text-slate-800">Sales pipeline by agent</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={agentData} layout="vertical" margin={{ left: 24, right: 16 }}>
            <CartesianGrid stroke="#d8e1ed" strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `${v / 1000}k`} />
            <YAxis type="category" dataKey="name" width={92} tick={{ fontSize: 10, fill: '#475569' }} />
            <Tooltip formatter={(value) => [`${Number(value).toLocaleString('ru-RU')} ₽`, 'Сумма']} />
            {DEAL_STAGES.map((stage, index) => (
              <Bar key={stage.id} dataKey={stage.id} stackId="pipeline" fill={COLORS[index]} radius={index === 0 ? [4, 0, 0, 4] : 0} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-[0_4px_14px_rgba(9,87,157,0.08)]">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">Pipeline board</h2>
      <KanbanBoard />
      </section>
    </div>
  )
}
