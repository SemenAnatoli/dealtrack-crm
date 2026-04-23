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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm cursor-grab active:cursor-grabbing group"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-800 leading-snug">{deal.title}</p>
        <div
          className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => openDealModal(deal)}
            className="text-slate-400 hover:text-indigo-600 text-xs px-1"
            title="Редактировать"
          >
            ✏️
          </button>
          <button
            onClick={() => deleteDeal.mutate(deal.id)}
            className="text-slate-400 hover:text-red-500 text-xs px-1"
            title="Удалить"
          >
            🗑️
          </button>
        </div>
      </div>

      <p className="text-sm font-semibold text-indigo-600 mt-1">
        {deal.amount.toLocaleString('ru-RU')} ₽
      </p>

      {deal.contact && (
        <p className="text-xs text-slate-500 mt-1 truncate">
          👤 {deal.contact.name}
        </p>
      )}
    </div>
  )
}
