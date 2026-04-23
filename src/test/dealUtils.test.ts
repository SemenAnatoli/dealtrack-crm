import { describe, it, expect } from 'vitest'
import { DEAL_STAGES } from '@/types'
import type { Deal } from '@/types'

function calcTotalByStage(deals: Deal[]) {
  return Object.fromEntries(
    DEAL_STAGES.map((s) => [
      s.id,
      deals.filter((d) => d.stage === s.id).reduce((sum, d) => sum + d.amount, 0),
    ])
  )
}

function calcWonRevenue(deals: Deal[]) {
  return deals.filter((d) => d.stage === 'won').reduce((sum, d) => sum + d.amount, 0)
}

const deals: Deal[] = [
  { id: '1', title: 'A', amount: 100000, stage: 'won',  contact_id: null, notes: null, created_at: '', updated_at: '' },
  { id: '2', title: 'B', amount: 50000,  stage: 'won',  contact_id: null, notes: null, created_at: '', updated_at: '' },
  { id: '3', title: 'C', amount: 200000, stage: 'lead', contact_id: null, notes: null, created_at: '', updated_at: '' },
]

describe('deal utils', () => {
  it('считает выручку по закрытым сделкам', () => {
    expect(calcWonRevenue(deals)).toBe(150000)
  })

  it('считает суммы по стадиям', () => {
    const result = calcTotalByStage(deals)
    expect(result.won).toBe(150000)
    expect(result.lead).toBe(200000)
    expect(result.proposal).toBe(0)
  })

  it('возвращает 0 при пустом массиве', () => {
    expect(calcWonRevenue([])).toBe(0)
  })
})
