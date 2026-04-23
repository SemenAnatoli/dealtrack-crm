import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUIStore } from '@/store/uiStore'
import { useCreateContact } from '@/hooks/useContacts'

const schema = z.object({
  name: z.string().min(1, 'Введите имя'),
  email: z.string().email('Некорректный email'),
  phone: z.string().nullable(),
  company: z.string().nullable(),
})

type FormData = z.infer<typeof schema>

export default function ContactModal() {
  const { isContactModalOpen, closeContactModal } = useUIStore()
  const createContact = useCreateContact()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', phone: null, company: null },
  })

  async function onSubmit(data: FormData) {
    await createContact.mutateAsync({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
    })
    reset()
    closeContactModal()
  }

  if (!isContactModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={closeContactModal} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-5">Новый контакт</h2>

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
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? 'Сохранение...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
