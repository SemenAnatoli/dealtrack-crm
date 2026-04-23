import { useState } from 'react'
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
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
  const { data: deals = [], isLoading } = useDeals()
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

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return
    const overId = over.id as string
    const isStage = DEAL_STAGES.some((s) => s.id === overId)
    if (!isStage) return

    const deal = deals.find((d) => d.id === active.id)
    if (deal && deal.stage !== overId) {
      updateStage.mutate({ id: deal.id, stage: overId as DealStage })
    }
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
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
