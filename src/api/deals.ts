import { supabase } from '@/lib/supabase'
import {
  createLocalDeal,
  deleteLocalDeal,
  readLocalDeals,
  updateLocalDeal,
  updateLocalDealStage,
} from '@/lib/localDb'
import type { Deal, DealStage } from '@/types'

export async function fetchDeals(): Promise<Deal[]> {
  if (!supabase) return readLocalDeals()

  const { data, error } = await supabase
    .from('deals')
    .select('*, contact:contacts(id, name, email, phone, company, created_at)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function createDeal(
  payload: Omit<Deal, 'id' | 'created_at' | 'updated_at' | 'contact'>
): Promise<Deal> {
  if (!supabase) return createLocalDeal(payload)

  const { data, error } = await supabase
    .from('deals')
    .insert(payload)
    .select('*, contact:contacts(id, name, email, phone, company, created_at)')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateDeal(
  id: string,
  payload: Partial<Omit<Deal, 'id' | 'created_at' | 'updated_at' | 'contact'>>
): Promise<Deal> {
  if (!supabase) return updateLocalDeal(id, payload)

  const { data, error } = await supabase
    .from('deals')
    .update(payload)
    .eq('id', id)
    .select('*, contact:contacts(id, name, email, phone, company, created_at)')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateDealStage(id: string, stage: DealStage): Promise<void> {
  if (!supabase) {
    updateLocalDealStage(id, stage)
    return
  }

  const { error } = await supabase
    .from('deals')
    .update({ stage })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function deleteDeal(id: string): Promise<void> {
  if (!supabase) {
    deleteLocalDeal(id)
    return
  }

  const { error } = await supabase.from('deals').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
