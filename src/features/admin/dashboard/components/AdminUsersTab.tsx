import { Search, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { AdminUser } from '@/services/admin-api'

interface AdminUsersTabProps {
  users: AdminUser[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onDeleteUser: (userId: number, email: string) => void
}

export default function AdminUsersTab({
  users,
  searchQuery,
  onSearchChange,
  onDeleteUser,
}: AdminUsersTabProps) {
  const filteredUsers = users.filter(
    (u) => !searchQuery || u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Direktori Pengguna Terdaftar ({users.length})
          </h2>
          <p className="text-xs text-slate-500">Kelola izin peran akun pengguna sistem.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari email pengguna..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 rounded-full text-xs"
          />
        </div>
      </div>

      <div className="rounded-[2.5rem] bg-white border border-slate-200/80 shadow-tactile-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="p-4 sm:p-5">ID</th>
                <th className="p-4 sm:p-5">Email Akun</th>
                <th className="p-4 sm:p-5">Peran (Role)</th>
                <th className="p-4 sm:p-5">Telepon</th>
                <th className="p-4 sm:p-5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:p-5 font-mono text-xs text-slate-400">#{user.id}</td>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">{user.email}</td>
                  <td className="p-4 sm:p-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        user.role === 'admin'
                          ? 'bg-violet-100 text-violet-800'
                          : user.role === 'seller'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 text-xs text-slate-500">{user.phone || '-'}</td>
                  <td className="p-4 sm:p-5 text-right">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => onDeleteUser(user.id, user.email)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Hapus Akun"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
