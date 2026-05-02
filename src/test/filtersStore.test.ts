import { describe, it, expect, beforeEach } from 'vitest'
import { useFiltersStore } from '@/store/filtersStore'

describe('filtersStore', () => {
  beforeEach(() => {
    useFiltersStore.setState({
      search: '',
      stageFilter: 'all',
      ownerFilter: 'all',
      pipelineFilter: 'all',
    })
  })

  it('устанавливает поисковый запрос', () => {
    useFiltersStore.getState().setSearch('Сайт')
    expect(useFiltersStore.getState().search).toBe('Сайт')
  })

  it('устанавливает фильтр стадии', () => {
    useFiltersStore.getState().setStageFilter('won')
    expect(useFiltersStore.getState().stageFilter).toBe('won')
  })

  it('сбрасывает фильтры', () => {
    useFiltersStore.getState().setSearch('тест')
    useFiltersStore.getState().setStageFilter('lost')
    useFiltersStore.getState().setOwnerFilter('contact-1')
    useFiltersStore.getState().setPipelineFilter('open')
    useFiltersStore.getState().resetFilters()
    expect(useFiltersStore.getState().search).toBe('')
    expect(useFiltersStore.getState().stageFilter).toBe('all')
    expect(useFiltersStore.getState().ownerFilter).toBe('all')
    expect(useFiltersStore.getState().pipelineFilter).toBe('all')
  })
})
