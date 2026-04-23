import { create } from 'zustand'
import type { Deal } from '@/types'

interface UIState {
  isDealModalOpen: boolean
  isContactModalOpen: boolean
  editingDeal: Deal | undefined

  openDealModal: (deal?: Deal) => void
  closeDealModal: () => void
  openContactModal: () => void
  closeContactModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isDealModalOpen: false,
  isContactModalOpen: false,
  editingDeal: undefined,

  openDealModal: (deal) =>
    set({ isDealModalOpen: true, editingDeal: deal }),
  closeDealModal: () =>
    set({ isDealModalOpen: false, editingDeal: undefined }),
  openContactModal: () =>
    set({ isContactModalOpen: true }),
  closeContactModal: () =>
    set({ isContactModalOpen: false }),
}))
