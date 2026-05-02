import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Deal } from '@/types'
import { useUIStore } from '@/store/uiStore'
import { useDeleteDeal } from '@/hooks/useDeals'

interface Props {
  deal: Deal
}

export default function DealCard({ deal }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: deal.id })

  const openDealModal = useUIStore((s) => s.openDealModal)
  const deleteDeal = useDeleteDeal()

  function handleDelete() {
    if (window.confirm(`Удалить сделку "${deal.title}"?`)) {
      deleteDeal.mutate(deal.id)
    }
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      className="group rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="min-w-0 flex-1 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <p className="text-sm font-medium leading-snug text-slate-800">{deal.title}</p>
          <p className="mt-1 text-sm font-semibold text-[#0076c8]">
            {deal.amount.toLocaleString('ru-RU')} ₽
          </p>

          {deal.contact && (
            <p className="mt-1 truncate text-xs text-slate-500">
              👤 {deal.contact.name}
            </p>
          )}
        </div>
        <div
          className="flex shrink-0 gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => openDealModal(deal)}
            className="text-slate-400 hover:text-indigo-600 text-xs px-1"
            aria-label={`Редактировать сделку ${deal.title}`}
            title="Редактировать"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteDeal.isPending}
            className="px-1 text-xs text-slate-400 hover:text-red-500 disabled:opacity-50"
            aria-label={`Удалить сделку ${deal.title}`}
            title="Удалить"
          >
            🗑️
          </button>
        </div>
      </div>
    </article>
  )
}
