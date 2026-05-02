import { supabase } from '@/lib/supabase'
import {
  createLocalContact,
  deleteLocalContact,
  readLocalContacts,
  updateLocalContact,
} from '@/lib/localDb'
import type { Contact } from '@/types'

export async function fetchContacts(): Promise<Contact[]> {
  if (!supabase) return readLocalContacts()

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function createContact(
  payload: Omit<Contact, 'id' | 'created_at'>
): Promise<Contact> {
  if (!supabase) return createLocalContact(payload)

  const { data, error } = await supabase
    .from('contacts')
    .insert(payload)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateContact(
  id: string,
  payload: Partial<Omit<Contact, 'id' | 'created_at'>>
): Promise<Contact> {
  if (!supabase) return updateLocalContact(id, payload)

  const { data, error } = await supabase
    .from('contacts')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteContact(id: string): Promise<void> {
  if (!supabase) {
    deleteLocalContact(id)
    return
  }

  const { error } = await supabase.from('contacts').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
