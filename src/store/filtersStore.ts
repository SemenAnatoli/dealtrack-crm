import { create } from 'zustand'
import type { DealStage } from '@/types'

interface FiltersState {
  search: string
  stageFilter: DealStage | 'all'

  setSearch: (value: string) => void
  setStageFilter: (stage: DealStage | 'all') => void
  resetFilters: () => void
}

export const useFiltersStore = create<FiltersState>((set) => ({
  search: '',
  stageFilter: 'all',

  setSearch: (value) => set({ search: value }),
  setStageFilter: (stage) => set({ stageFilter: stage }),
  resetFilters: () => set({ search: '', stageFilter: 'all' }),
}))
