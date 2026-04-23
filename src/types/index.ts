export type DealStage = 'lead' | 'contact' | 'proposal' | 'negotiation' | 'won' | 'lost'

export interface Contact {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  created_at: string
}

export interface Deal {
  id: string
  title: string
  amount: number
  stage: DealStage
  contact_id: string | null
  contact?: Contact
  notes: string | null
  created_at: string
  updated_at: string
}

export interface DealStageConfig {
  id: DealStage
  label: string
  color: string
  bgColor: string
}

export const DEAL_STAGES: DealStageConfig[] = [
  { id: 'lead',        label: 'Лид',          color: 'text-gray-600',  bgColor: 'bg-gray-100'   },
  { id: 'contact',     label: 'Контакт',      color: 'text-blue-600',  bgColor: 'bg-blue-50'    },
  { id: 'proposal',    label: 'Предложение',  color: 'text-purple-600',bgColor: 'bg-purple-50'  },
  { id: 'negotiation', label: 'Переговоры',   color: 'text-yellow-600',bgColor: 'bg-yellow-50'  },
  { id: 'won',         label: 'Выиграно',     color: 'text-green-600', bgColor: 'bg-green-50'   },
  { id: 'lost',        label: 'Проиграно',    color: 'text-red-600',   bgColor: 'bg-red-50'     },
]
