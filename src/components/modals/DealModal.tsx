import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUIStore } from '@/store/uiStore'
import { useCreateDeal, useUpdateDeal } from '@/hooks/useDeals'
import { useContactOptions } from '@/hooks/useContacts'
import { DEAL_STAGES } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Введите название'),
  amount: z.number().min(0, 'Сумма не может быть отрицательной'),
  stage: z.enum(['lead', 'contact', 'proposal', 'negotiation', 'won', 'lost']),
  contact_id: z.string().nullable(),
  notes: z.string().nullable(),
})

type FormData = z.infer<typeof schema>

export default function DealModal() {
  const { isDealModalOpen, editingDeal, closeDealModal } = useUIStore()
  const createDeal = useCreateDeal()
  const updateDeal = useUpdateDeal()
  const contactOptions = useContactOptions()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: { stage: 'lead', amount: 0, contact_id: null, notes: null },
  })

  useEffect(() => {
    if (editingDeal) {
      reset({
        title: editingDeal.title,
        amount: editingDeal.amount,
        stage: editingDeal.stage,
        contact_id: editingDeal.contact_id,
        notes: editingDeal.notes,
      })
    } else {
      reset({ title: '', amount: 0, stage: 'lead', contact_id: null, notes: null })
    }
  }, [editingDeal, reset])

  async function onSubmit(data: FormData) {
    const payload = { ...data, contact_id: data.contact_id || null, notes: data.notes || null }
    if (editingDeal) {
      await updateDeal.mutateAsync({ id: editingDeal.id, payload })
    } else {
      await createDeal.mutateAsync(payload)
    }
    closeDealModal()
  }

  if (!isDealModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={closeDealModal} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-5">
          {editingDeal ? 'Редактировать сделку' : 'Новая сделка'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-4">
          <Field label="Название" error={errors.title?.message}>
            <input
              {...register('title')}
              className="input"
              placeholder="Разработка сайта"
            />
          </Field>

          <Field label="Сумма, ₽" error={errors.amount?.message}>
            <input
              {...register('amount', { valueAsNumber: true })}
              type="number"
              className="input"
              placeholder="100000"
            />
          </Field>

          <Field label="Стадия" error={errors.stage?.message}>
            <select {...register('stage')} className="input">
              {DEAL_STAGES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Контакт" error={undefined}>
            <select {...register('contact_id')} className="input">
              <option value="">— без контакта —</option>
              {contactOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Заметки" error={undefined}>
            <textarea
              {...register('notes')}
              className="input resize-none"
              rows={3}
              placeholder="Дополнительная информация..."
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeDealModal}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? 'Сохранение...' : editingDeal ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
