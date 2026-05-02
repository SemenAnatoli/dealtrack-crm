import { useDeals, useDeleteDeal } from '@/hooks/useDeals'
import { filterDeals } from '@/lib/dealMetrics'
import { useFiltersStore } from '@/store/filtersStore'
import { useUIStore } from '@/store/uiStore'
import { DEAL_STAGES } from '@/types'

export default function DealsPage() {
  const { data: deals = [], isLoading, error } = useDeals()
  const deleteDeal = useDeleteDeal()
  const { openDealModal } = useUIStore()
  const { search, stageFilter, ownerFilter, pipelineFilter } = useFiltersStore()
  const filteredDeals = filterDeals(deals, search, stageFilter, ownerFilter, pipelineFilter)
  const hasActiveFilters =
    search.trim().length > 0 ||
    stageFilter !== 'all' ||
    ownerFilter !== 'all' ||
    pipelineFilter !== 'all'

  function handleDelete(id: string, title: string) {
    if (window.confirm(`Удалить сделку "${title}"?`)) {
      deleteDeal.mutate(id)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Сделки</h1>
        <button
          type="button"
          onClick={() => openDealModal()}
          className="rounded-md bg-[#0076c8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#07579d]"
        >
          + Новая сделка
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error.message}
        </p>
      )}

      {isLoading ? (
        <p className="text-slate-400">Загрузка...</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
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
              {filteredDeals.map((deal) => {
                const stage = DEAL_STAGES.find((s) => s.id === deal.stage)
                return (
                  <tr key={deal.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{deal.title}</td>
                    <td className="px-4 py-3 font-semibold text-[#0076c8]">
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
                        type="button"
                        onClick={() => openDealModal(deal)}
                        className="text-slate-400 transition-colors hover:text-indigo-600"
                        aria-label={`Редактировать сделку ${deal.title}`}
                        title="Редактировать"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(deal.id, deal.title)}
                        disabled={deleteDeal.isPending}
                        className="text-slate-400 transition-colors hover:text-red-500 disabled:opacity-50"
                        aria-label={`Удалить сделку ${deal.title}`}
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
          {filteredDeals.length === 0 && (
            <p className="text-center py-10 text-slate-400">
              {hasActiveFilters ? 'По фильтрам ничего не найдено' : 'Сделок пока нет'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
