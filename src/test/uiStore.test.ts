import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '@/store/uiStore'
import type { Deal } from '@/types'

const mockDeal: Deal = {
  id: '1',
  title: 'Тестовая сделка',
  amount: 100000,
  stage: 'lead',
  contact_id: null,
  notes: null,
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
}

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      isDealModalOpen: false,
      isContactModalOpen: false,
      editingDeal: undefined,
    })
  })

  it('открывает модалку сделки без редактирования', () => {
    useUIStore.getState().openDealModal()
    expect(useUIStore.getState().isDealModalOpen).toBe(true)
    expect(useUIStore.getState().editingDeal).toBeNull()
  })

  it('открывает модалку с передачей сделки для редактирования', () => {
    useUIStore.getState().openDealModal(mockDeal)
    expect(useUIStore.getState().isDealModalOpen).toBe(true)
    expect(useUIStore.getState().editingDeal?.id).toBe('1')
  })

  it('закрывает модалку и сбрасывает editingDeal', () => {
    useUIStore.getState().openDealModal(mockDeal)
    useUIStore.getState().closeDealModal()
    expect(useUIStore.getState().isDealModalOpen).toBe(false)
    expect(useUIStore.getState().editingDeal).toBeNull()
  })

  it('управляет модалкой контакта', () => {
    useUIStore.getState().openContactModal()
    expect(useUIStore.getState().isContactModalOpen).toBe(true)
    useUIStore.getState().closeContactModal()
    expect(useUIStore.getState().isContactModalOpen).toBe(false)
  })
})
