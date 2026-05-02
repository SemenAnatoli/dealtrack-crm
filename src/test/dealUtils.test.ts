import { describe, it, expect } from 'vitest'
import { calcTotalsByStage, calcWonRevenue, filterDeals } from '@/lib/dealMetrics'
import type { Deal } from '@/types'

const deals: Deal[] = [
  { id: '1', title: 'Лендинг', amount: 100000, stage: 'won',  contact_id: null, notes: null, created_at: '', updated_at: '' },
  { id: '2', title: 'SEO', amount: 50000,  stage: 'won',  contact_id: null, notes: null, created_at: '', updated_at: '' },
  {
    id: '3',
    title: 'CRM',
    amount: 200000,
    stage: 'lead',
    contact_id: 'contact-1',
    contact: {
      id: 'contact-1',
      name: 'Алексей Петров',
      email: 'alexey@mail.ru',
      phone: null,
      company: 'ООО Ромашка',
      created_at: '',
    },
    notes: null,
    created_at: '',
    updated_at: '',
  },
]

describe('deal utils', () => {
  it('считает выручку по закрытым сделкам', () => {
    expect(calcWonRevenue(deals)).toBe(150000)
  })

  it('считает суммы по стадиям', () => {
    const result = calcTotalsByStage(deals)
    expect(result.won).toBe(150000)
    expect(result.lead).toBe(200000)
    expect(result.proposal).toBe(0)
  })

  it('возвращает 0 при пустом массиве', () => {
    expect(calcWonRevenue([])).toBe(0)
  })

  it('фильтрует сделки по поиску и стадии', () => {
    expect(filterDeals(deals, 'петров', 'all')).toHaveLength(1)
    expect(filterDeals(deals, '', 'won')).toHaveLength(2)
    expect(filterDeals(deals, 'crm', 'lead')).toHaveLength(1)
    expect(filterDeals(deals, '', 'all', 'contact-1')).toHaveLength(1)
    expect(filterDeals(deals, '', 'all', 'all', 'open')).toHaveLength(1)
  })
})
