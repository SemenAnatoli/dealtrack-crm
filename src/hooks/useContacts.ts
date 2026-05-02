import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchContacts, createContact, updateContact, deleteContact } from '@/api/contacts'
import type { Contact } from '@/types'

export const CONTACTS_KEY = ['contacts'] as const

export function useContacts() {
  return useQuery({
    queryKey: CONTACTS_KEY,
    queryFn: fetchContacts,
  })
}

export function useCreateContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_KEY })
      queryClient.invalidateQueries({ queryKey: ['deals'] })
    },
  })
}

export function useUpdateContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Omit<Contact, 'id' | 'created_at'>> }) =>
      updateContact(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_KEY })
      queryClient.invalidateQueries({ queryKey: ['deals'] })
    },
  })
}

export function useDeleteContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACTS_KEY })
      queryClient.invalidateQueries({ queryKey: ['deals'] })
    },
  })
}

export function useContactOptions() {
  const { data = [] } = useContacts()
  return data.map((c: Contact) => ({ value: c.id, label: `${c.name} — ${c.company ?? c.email}` }))
}
