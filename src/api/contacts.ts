import { supabase } from '@/lib/supabase'
import type { Contact } from '@/types'

export async function fetchContacts(): Promise<Contact[]> {
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
  const { data, error } = await supabase
    .from('contacts')
    .insert(payload)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase.from('contacts').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
