import { useEffect, useState } from 'react';

import { adminAPI } from '@/services/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  const load = async (query?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminAPI.listUsers(query ? { q: query } : undefined);
      setUsers(res.data.users || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateRole = async (userId: string, role: 'user' | 'admin') => {
    setIsSaving(userId);
    setError(null);
    try {
      const res = await adminAPI.updateUserRole(userId, { role });
      const updated = res.data.user;
      setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to update role');
    } finally {
      setIsSaving(null);
    }
  };

  return (
    <div className="space-y-6" data-testid="admin-users">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-heading font-bold">Users</h2>
          <p className="text-gray-600 mt-1">Search users and manage roles.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or email"
            className="w-full sm:w-80 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => load(q.trim())}
            className="w-full sm:w-auto px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl">{error}</div>}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Role</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 capitalize">{u.role}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateRole(u._id, 'user')}
                          disabled={isSaving === u._id}
                          className="h-11 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Set user
                        </button>
                        <button
                          type="button"
                          onClick={() => updateRole(u._id, 'admin')}
                          disabled={isSaving === u._id}
                          className="h-11 px-3 rounded-xl bg-primary text-white hover:bg-primary-hover disabled:opacity-50"
                        >
                          Set admin
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-gray-600" colSpan={4}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
