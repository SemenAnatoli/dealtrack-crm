import type { Contact, Deal, DealStage } from '@/types'

const names = [
  'Mia Davis',
  'Zara Khan',
  'Sebastian Muller',
  'Emily Johnson',
  'Emma Chen',
  'Isabella Rossi',
  'Oliver Kim',
  'Daniel Garcia',
  'Amelia Wilson',
  'Ahmed Hassan',
  'Sophia Liu',
  'John Smith',
  'Maria Garcia',
  'Hiroshi Tanaka',
  'Priya Patel',
  'Luca Bianchi',
  'Aisha Khan',
  'Noah Anderson',
  'Sofia Novak',
  'Omar Haddad',
  'Elena Petrova',
  'Miguel Torres',
  'Anna Kowalska',
  'David Lee',
]

const companies = [
  'Coupler.io',
  'Northwind',
  'Bright Labs',
  'Globex',
  'BluePeak',
  'Rossi Studio',
  'Kim Digital',
  'Garcia Group',
  'Wilson Retail',
  'Hassan Trade',
  'Liu Analytics',
  'Acme Corp',
  'Mercado Pro',
  'Tanaka Systems',
  'Patel Consulting',
  'Bianchi Design',
  'Khan Ventures',
  'Anderson Cloud',
  'Novak Media',
  'Haddad Logistics',
  'Petrova Legal',
  'Torres Finance',
  'Kowalska HR',
  'Lee Software',
]

const titles = [
  'CRM rollout',
  'Sales analytics',
  'Customer portal',
  'Marketing automation',
  'Data migration',
  'Pipeline audit',
  'Support desk',
  'Retail dashboard',
  'Partner portal',
  'Lead scoring',
  'BI integration',
  'Client onboarding',
]

const stages: DealStage[] = ['lead', 'contact', 'proposal', 'negotiation', 'won', 'lost']
const amounts = [
  956000, 615300, 495800, 469100, 438400, 330300, 321100, 276000,
  233800, 217800, 368500, 363000, 352000, 348500, 338500, 325500,
  304500, 297000, 284000, 268000, 244000, 229000, 211500, 198000,
]

export const DEMO_CONTACTS: Contact[] = names.map((name, index) => ({
  id: `demo-contact-${index + 1}`,
  name,
  email: `${name.toLowerCase().replaceAll(' ', '.')}@example.com`,
  phone: index % 4 === 0 ? null : `+1 555 ${String(100 + index).padStart(3, '0')}-${String(2000 + index)}`,
  company: companies[index],
  created_at: '2026-01-01',
}))

export const DEMO_DEALS: Deal[] = DEMO_CONTACTS.flatMap((contact, contactIndex) =>
  Array.from({ length: contactIndex % 3 === 0 ? 3 : 2 }, (_, dealIndex) => {
    const amountIndex = (contactIndex + dealIndex * 7) % amounts.length
    const stage = stages[(contactIndex + dealIndex * 2) % stages.length]
    const month = 12 + ((contactIndex + dealIndex) % 6)
    const normalizedMonth = month > 12 ? month - 12 : month
    const year = month > 12 ? 2026 : 2025
    const title = `${companies[contactIndex]} ${titles[(contactIndex + dealIndex) % titles.length]}`

    return {
      id: `demo-deal-${contactIndex + 1}-${dealIndex + 1}`,
      title,
      amount: amounts[amountIndex],
      stage,
      contact_id: contact.id,
      contact,
      notes: null,
      created_at: `${year}-${String(normalizedMonth).padStart(2, '0')}-${String(5 + dealIndex * 7).padStart(2, '0')}`,
      updated_at: `${year}-${String(normalizedMonth).padStart(2, '0')}-${String(12 + dealIndex * 5).padStart(2, '0')}`,
    }
  })
)

export function mergeDemoContacts(contacts: Contact[]) {
  const existingIds = new Set(contacts.map((contact) => contact.id))
  return [...contacts, ...DEMO_CONTACTS.filter((contact) => !existingIds.has(contact.id))]
}

export function mergeDemoDeals(deals: Deal[]) {
  const existingIds = new Set(deals.map((deal) => deal.id))
  return [...deals, ...DEMO_DEALS.filter((deal) => !existingIds.has(deal.id))]
}
