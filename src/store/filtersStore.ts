import { create } from 'zustand'
import type { DealStage } from '@/types'

export type PipelineFilter = 'all' | 'open' | 'won' | 'lost'

interface FiltersState {
  search: string
  stageFilter: DealStage | 'all'
  ownerFilter: string | 'all'
  pipelineFilter: PipelineFilter

  setSearch: (value: string) => void
  setStageFilter: (stage: DealStage | 'all') => void
  setOwnerFilter: (owner: string | 'all') => void
  setPipelineFilter: (pipeline: PipelineFilter) => void
  resetFilters: () => void
}

export const useFiltersStore = create<FiltersState>((set) => ({
  search: '',
  stageFilter: 'all',
  ownerFilter: 'all',
  pipelineFilter: 'all',

  setSearch: (value) => set({ search: value }),
  setStageFilter: (stage) => set({ stageFilter: stage }),
  setOwnerFilter: (owner) => set({ ownerFilter: owner }),
  setPipelineFilter: (pipeline) => set({ pipelineFilter: pipeline }),
  resetFilters: () => set({
    search: '',
    stageFilter: 'all',
    ownerFilter: 'all',
    pipelineFilter: 'all',
  }),
}))
