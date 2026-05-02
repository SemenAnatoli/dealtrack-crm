import { DEMO_CONTACTS, DEMO_DEALS } from '@/lib/demoData'
import type { Contact, Deal, DealStage } from '@/types'

const CONTACTS_KEY = 'clientflowcrm:contacts'
const DEALS_KEY = 'clientflowcrm:deals'

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback

  const raw = window.localStorage.getItem(key)
  if (!raw) {
    window.localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    window.localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return
  window.localStorage.setItem(key, JSON.stringify(value))
}

function makeId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function now() {
  return new Date().toISOString()
}

export function readLocalContacts() {
  return readJson<Contact[]>(CONTACTS_KEY, DEMO_CONTACTS)
}

export function readLocalDeals() {
  const contacts = readLocalContacts()
  const deals = readJson<Deal[]>(DEALS_KEY, DEMO_DEALS)

  return deals.map((deal) => ({
    ...deal,
    contact: contacts.find((contact) => contact.id === deal.contact_id),
  }))
}

export function createLocalContact(payload: Omit<Contact, 'id' | 'created_at'>) {
  const contact: Contact = {
    ...payload,
    id: makeId('contact'),
    created_at: now(),
  }
  writeJson(CONTACTS_KEY, [contact, ...readLocalContacts()])
  return contact
}

export function updateLocalContact(
  id: string,
  payload: Partial<Omit<Contact, 'id' | 'created_at'>>
) {
  let updated: Contact | undefined
  const contacts = readLocalContacts().map((contact) => {
    if (contact.id !== id) return contact
    updated = { ...contact, ...payload }
    return updated
  })

  writeJson(CONTACTS_KEY, contacts)

  if (!updated) {
    throw new Error('Contact not found')
  }

  return updated
}

export function deleteLocalContact(id: string) {
  writeJson(
    CONTACTS_KEY,
    readLocalContacts().filter((contact) => contact.id !== id)
  )
  writeJson(
    DEALS_KEY,
    readLocalDeals().map((deal) =>
      deal.contact_id === id ? { ...deal, contact_id: null, contact: undefined } : deal
    )
  )
}

export function createLocalDeal(
  payload: Omit<Deal, 'id' | 'created_at' | 'updated_at' | 'contact'>
) {
  const contacts = readLocalContacts()
  const deal: Deal = {
    ...payload,
    id: makeId('deal'),
    contact: contacts.find((contact) => contact.id === payload.contact_id),
    created_at: now(),
    updated_at: now(),
  }
  writeJson(DEALS_KEY, [deal, ...readLocalDeals()])
  return deal
}

export function updateLocalDeal(
  id: string,
  payload: Partial<Omit<Deal, 'id' | 'created_at' | 'updated_at' | 'contact'>>
) {
  const contacts = readLocalContacts()
  let updated: Deal | undefined
  const deals = readLocalDeals().map((deal) => {
    if (deal.id !== id) return deal
    updated = {
      ...deal,
      ...payload,
      contact: contacts.find((contact) => contact.id === (payload.contact_id ?? deal.contact_id)),
      updated_at: now(),
    }
    return updated
  })

  writeJson(DEALS_KEY, deals)

  if (!updated) {
    throw new Error('Deal not found')
  }

  return updated
}

export function updateLocalDealStage(id: string, stage: DealStage) {
  updateLocalDeal(id, { stage })
}

export function deleteLocalDeal(id: string) {
  writeJson(
    DEALS_KEY,
    readLocalDeals().filter((deal) => deal.id !== id)
  )
}
