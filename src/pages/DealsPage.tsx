import { useDeals, useDeleteDeal } from '@/hooks/useDeals'
import { useUIStore } from '@/store/uiStore'
import { DEAL_STAGES } from '@/types'

export default function DealsPage() {
  const { data: deals = [], isLoading } = useDeals()
  const deleteDeal = useDeleteDeal()
  const { openDealModal } = useUIStore()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Сделки</h1>
        <button
          onClick={() => openDealModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Новая сделка
        </button>
      </div>

      {isLoading ? (
        <p className="text-slate-400">Загрузка...</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-slate-600">Название</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Сумма</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Стадия</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Контакт</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => {
                const stage = DEAL_STAGES.find((s) => s.id === deal.stage)
                return (
                  <tr key={deal.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{deal.title}</td>
                    <td className="px-4 py-3 text-indigo-600 font-semibold">
                      {deal.amount.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${stage?.bgColor} ${stage?.color}`}>
                        {stage?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{deal.contact?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-right flex gap-2 justify-end">
                      <button
                        onClick={() => openDealModal(deal)}
                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteDeal.mutate(deal.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {deals.length === 0 && (
            <p className="text-center py-10 text-slate-400">Сделок пока нет</p>
          )}
        </div>
      )}
    </div>
  )
}
