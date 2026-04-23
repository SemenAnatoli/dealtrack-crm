import KanbanBoard from '@/components/kanban/KanbanBoard'
import { useUIStore } from '@/store/uiStore'

export default function PipelinePage() {
  const openDealModal = useUIStore((s) => s.openDealModal)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Pipeline</h1>
        <button
          onClick={() => openDealModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Новая сделка
        </button>
      </div>
      <KanbanBoard />
    </div>
  )
}
