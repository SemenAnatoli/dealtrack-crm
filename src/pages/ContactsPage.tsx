import { useContacts, useDeleteContact } from '@/hooks/useContacts'
import { useUIStore } from '@/store/uiStore'

export default function ContactsPage() {
  const { data: contacts = [], isLoading, error } = useContacts()
  const deleteContact = useDeleteContact()
  const openContactModal = useUIStore((s) => s.openContactModal)

  function handleDelete(id: string, name: string) {
    if (window.confirm(`Удалить контакт "${name}"? Сделки останутся без привязки к контакту.`)) {
      deleteContact.mutate(id)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Контакты</h1>
        <button
          type="button"
          onClick={() => openContactModal()}
          className="rounded-md bg-[#0076c8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#07579d]"
        >
          + Новый контакт
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error.message}
        </p>
      )}

      {isLoading ? (
        <p className="text-slate-400">Загрузка...</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-slate-600">Имя</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Телефон</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Компания</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{c.email}</td>
                  <td className="px-4 py-3 text-slate-600">{c.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{c.company ?? '—'}</td>
                  <td className="flex justify-end gap-2 px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openContactModal(c)}
                      className="text-slate-400 transition-colors hover:text-indigo-600"
                      aria-label={`Редактировать контакт ${c.name}`}
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id, c.name)}
                      disabled={deleteContact.isPending}
                      className="text-slate-400 transition-colors hover:text-red-500 disabled:opacity-50"
                      aria-label={`Удалить контакт ${c.name}`}
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {contacts.length === 0 && (
            <p className="text-center py-10 text-slate-400">Контактов пока нет</p>
          )}
        </div>
      )}
    </div>
  )
}
