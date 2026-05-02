import { DEAL_STAGES, type Deal, type DealStage } from '@/types'
import type { PipelineFilter } from '@/store/filtersStore'

export function calcWonRevenue(deals: Deal[]) {
  return deals
    .filter((deal) => deal.stage === 'won')
    .reduce((sum, deal) => sum + deal.amount, 0)
}

export function calcOpenPipeline(deals: Deal[]) {
  return deals
    .filter((deal) => !['won', 'lost'].includes(deal.stage))
    .reduce((sum, deal) => sum + deal.amount, 0)
}

export function calcTotalsByStage(deals: Deal[]) {
  return Object.fromEntries(
    DEAL_STAGES.map((stage) => [
      stage.id,
      deals
        .filter((deal) => deal.stage === stage.id)
        .reduce((sum, deal) => sum + deal.amount, 0),
    ])
  ) as Record<DealStage, number>
}

export function filterDeals(
  deals: Deal[],
  search: string,
  stageFilter: DealStage | 'all',
  ownerFilter: string | 'all' = 'all',
  pipelineFilter: PipelineFilter = 'all'
) {
  const query = search.trim().toLowerCase()

  return deals.filter((deal) => {
    const matchesStage = stageFilter === 'all' || deal.stage === stageFilter
    const matchesOwner = ownerFilter === 'all' || deal.contact_id === ownerFilter
    const matchesPipeline =
      pipelineFilter === 'all' ||
      (pipelineFilter === 'open' && !['won', 'lost'].includes(deal.stage)) ||
      (pipelineFilter === 'won' && deal.stage === 'won') ||
      (pipelineFilter === 'lost' && deal.stage === 'lost')
    const contact = deal.contact
    const matchesSearch =
      query.length === 0 ||
      deal.title.toLowerCase().includes(query) ||
      contact?.name.toLowerCase().includes(query) ||
      contact?.company?.toLowerCase().includes(query) ||
      contact?.email.toLowerCase().includes(query)

    return matchesStage && matchesOwner && matchesPipeline && Boolean(matchesSearch)
  })
}
