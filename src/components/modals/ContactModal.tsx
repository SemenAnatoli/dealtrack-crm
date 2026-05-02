import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUIStore } from '@/store/uiStore'
import { useCreateContact, useUpdateContact } from '@/hooks/useContacts'

const schema = z.object({
  name: z.string().min(1, 'Введите имя'),
  email: z.string().email('Некорректный email'),
  phone: z.string().nullable(),
  company: z.string().nullable(),
})

type FormData = z.infer<typeof schema>

export default function ContactModal() {
  const { isContactModalOpen, editingContact, closeContactModal } = useUIStore()
  const createContact = useCreateContact()
  const updateContact = useUpdateContact()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', phone: null, company: null },
  })

  useEffect(() => {
    if (!isContactModalOpen) return

    if (editingContact) {
      reset({
        name: editingContact.name,
        email: editingContact.email,
        phone: editingContact.phone,
        company: editingContact.company,
      })
      return
    }

    reset({ name: '', email: '', phone: null, company: null })
  }, [editingContact, isContactModalOpen, reset])

  async function onSubmit(data: FormData) {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
    }

    if (editingContact) {
      await updateContact.mutateAsync({ id: editingContact.id, payload })
    } else {
      await createContact.mutateAsync(payload)
    }

    closeContactModal()
  }

  if (!isContactModalOpen) return null

  const isSaving = isSubmitting || createContact.isPending || updateContact.isPending
  const submitError = createContact.error ?? updateContact.error

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={closeContactModal} />
      <div className="relative mx-4 max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-800 mb-5">
          {editingContact ? 'Редактировать контакт' : 'Новый контакт'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Имя</label>
            <input {...register('name')} className="input" placeholder="Алексей Петров" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input {...register('email')} type="email" className="input" placeholder="email@mail.ru" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Телефон</label>
            <input {...register('phone')} className="input" placeholder="+7 900 000-00-00" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Компания</label>
            <input {...register('company')} className="input" placeholder="ООО Ромашка" />
          </div>

          {submitError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {submitError.message}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeContactModal}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-lg bg-[#0076c8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#07579d] disabled:opacity-60"
            >
              {isSaving ? 'Сохранение...' : editingContact ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
