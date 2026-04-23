import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Deal, DealStageConfig } from '@/types'
import DealCard from './DealCard'

interface Props {
  stage: DealStageConfig
  deals: Deal[]
}

export default function KanbanColumn({ stage, deals }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })

  const total = deals.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="flex flex-col w-64 shrink-0">
      <div className={`rounded-t-lg px-3 py-2 ${stage.bgColor}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wide ${stage.color}`}>
            {stage.label}
          </span>
          <span className="text-xs bg-white/70 rounded-full px-2 py-0.5 font-medium text-slate-600">
            {deals.length}
          </span>
        </div>
        {deals.length > 0 && (
          <p className="text-xs text-slate-500 mt-0.5">
            {total.toLocaleString('ru-RU')} ₽
          </p>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 min-h-24 p-2 space-y-2 rounded-b-lg border-x border-b transition-colors ${
          isOver ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-100 border-slate-200'
        }`}
      >
        <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
