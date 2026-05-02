import { create } from 'zustand'
import type { Contact, Deal } from '@/types'

interface UIState {
  isDealModalOpen: boolean
  isContactModalOpen: boolean
  editingDeal: Deal | null
  editingContact: Contact | null

  openDealModal: (deal?: Deal) => void
  closeDealModal: () => void
  openContactModal: (contact?: Contact) => void
  closeContactModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isDealModalOpen: false,
  isContactModalOpen: false,
  editingDeal: null,
  editingContact: null,

  openDealModal: (deal) =>
    set({ isDealModalOpen: true, editingDeal: deal ?? null }),
  closeDealModal: () =>
    set({ isDealModalOpen: false, editingDeal: null }),
  openContactModal: (contact) =>
    set({ isContactModalOpen: true, editingContact: contact ?? null }),
  closeContactModal: () =>
    set({ isContactModalOpen: false, editingContact: null }),
}))
