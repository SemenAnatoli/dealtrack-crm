import { useState } from 'react'
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core'
import { useDeals, useUpdateDealStage } from '@/hooks/useDeals'
import { DEAL_STAGES } from '@/types'
import type { Deal, DealStage } from '@/types'
import KanbanColumn from './KanbanColumn'
import DealCard from './DealCard'

export default function KanbanBoard() {
  const { data: deals = [], isLoading, error } = useDeals()
  const updateStage = useUpdateDealStage()
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        Загрузка...
      </div>
    )
  }

  function handleDragStart({ active }: DragStartEvent) {
    const deal = deals.find((d) => d.id === active.id)
    setActiveDeal(deal ?? null)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveDeal(null)
    if (!over) return

    const overId = over.id as string
    const deal = deals.find((d) => d.id === active.id)
    if (!deal) return

    // Drop on a stage column (empty column)
    const isStage = DEAL_STAGES.some((s) => s.id === overId)
    if (isStage && deal.stage !== overId) {
      updateStage.mutate({ id: deal.id, stage: overId as DealStage })
      return
    }

    // Drop on another card
    const overDeal = deals.find((d) => d.id === overId)
    if (overDeal && deal.stage !== overDeal.stage) {
      updateStage.mutate({ id: deal.id, stage: overDeal.stage })
    }
  }

  if (error) {
    return (
      <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
        {error.message}
      </p>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {DEAL_STAGES.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            deals={deals.filter((d) => d.stage === stage.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeDeal && <DealCard deal={activeDeal} />}
      </DragOverlay>
    </DndContext>
  )
}
