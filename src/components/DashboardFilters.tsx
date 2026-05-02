import { useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { DEAL_STAGES, type DealStage } from '@/types'
import { useContacts } from '@/hooks/useContacts'
import { mergeDemoContacts } from '@/lib/demoData'
import { useFiltersStore, type PipelineFilter } from '@/store/filtersStore'
import { useUIStore } from '@/store/uiStore'

const pipelineOptions: Array<{ value: PipelineFilter; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'open', label: 'В работе' },
  { value: 'won', label: 'Выиграно' },
  { value: 'lost', label: 'Проиграно' },
]

export default function DashboardFilters() {
  const { data: contacts = [] } = useContacts()
  const location = useLocation()
  const showDemoContacts = ['/dashboard', '/pipeline'].includes(location.pathname)
  const contactOptions = showDemoContacts ? mergeDemoContacts(contacts) : contacts
  const openContactModal = useUIStore((state) => state.openContactModal)
  const openDealModal = useUIStore((state) => state.openDealModal)
  const {
    search,
    stageFilter,
    ownerFilter,
    pipelineFilter,
    setSearch,
    setStageFilter,
    setOwnerFilter,
    setPipelineFilter,
    resetFilters,
  } = useFiltersStore()
  const [reportFrom, setReportFrom] = useState('2026-04-01')
  const [reportTo, setReportTo] = useState('2026-05-02')
  const [guideTip, setGuideTip] = useState('')

  return (
    <aside className="space-y-3 lg:sticky lg:top-3 lg:self-start">
      <section className="rounded-md border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <p className="mb-2 text-[10px] font-medium text-slate-700">Report date</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={reportFrom}
            onChange={(event) => setReportFrom(event.target.value)}
            className="h-7 rounded border border-slate-200 px-1 text-[10px] text-slate-700"
          />
          <input
            type="date"
            value={reportTo}
            onChange={(event) => setReportTo(event.target.value)}
            className="h-7 rounded border border-slate-200 px-1 text-[10px] text-slate-700"
          />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          defaultValue="42"
          className="mt-3 w-full accent-[#0076c8]"
          aria-label="Report date range"
        />

        <FilterLabel label="Deal Owner">
          <select
            value={ownerFilter}
            onChange={(event) => setOwnerFilter(event.target.value)}
            className="filter-control"
          >
            <option value="all">Все</option>
            {contactOptions.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            ))}
          </select>
        </FilterLabel>

        <FilterLabel label="Deal Stage">
          <select
            value={stageFilter}
            onChange={(event) => setStageFilter(event.target.value as DealStage | 'all')}
            className="filter-control"
          >
            <option value="all">Все</option>
            {DEAL_STAGES.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.label}
              </option>
            ))}
          </select>
        </FilterLabel>

        <FilterLabel label="Pipeline">
          <select
            value={pipelineFilter}
            onChange={(event) => setPipelineFilter(event.target.value as PipelineFilter)}
            className="filter-control"
          >
            {pipelineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FilterLabel>

        <FilterLabel label="Deal label">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="filter-control"
            placeholder="Все"
          />
        </FilterLabel>

        <button
          type="button"
          onClick={resetFilters}
          className="mt-3 w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
        >
          Reset filters
        </button>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Have questions?</h2>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
            CRM
          </div>
        </div>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setGuideTip('Фильтры справа управляют метриками, графиками и таблицей сделок.')}
            className="block text-left text-xs font-medium text-[#0076c8] hover:text-[#07579d]"
          >
            Dashboard setup guide
          </button>
          <button
            type="button"
            onClick={() => openDealModal()}
            className="block text-left text-xs font-medium text-[#0076c8] hover:text-[#07579d]"
          >
            Get a demo
          </button>
          <button
            type="button"
            onClick={() => openContactModal()}
            className="block text-left text-xs font-medium text-[#0076c8] hover:text-[#07579d]"
          >
            Contact support
          </button>
        </div>
        {guideTip && (
          <p className="mt-3 rounded-md bg-slate-50 p-2 text-[11px] leading-snug text-slate-600">
            {guideTip}
          </p>
        )}
      </section>
    </aside>
  )
}

function FilterLabel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mt-4 block">
      <span className="mb-1 block text-[10px] font-medium text-slate-700">{label}</span>
      {children}
    </label>
  )
}
