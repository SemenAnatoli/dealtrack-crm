import { useContacts, useDeleteContact } from '@/hooks/useContacts'
import { useUIStore } from '@/store/uiStore'

export default function ContactsPage() {
  const { data: contacts = [], isLoading } = useContacts()
  const deleteContact = useDeleteContact()
  const openContactModal = useUIStore((s) => s.openContactModal)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Контакты</h1>
        <button
          onClick={openContactModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Новый контакт
        </button>
      </div>

      {isLoading ? (
        <p className="text-slate-400">Загрузка...</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
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
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteContact.mutate(c.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {contacts.length === 0 && (
            <p className="text-center py-10 text-slate-400">Контактов пока нет</p>
          )}
        </div>
      )}
    </div>
  )
}
