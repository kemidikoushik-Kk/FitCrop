import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { AdminUserDto } from '../../types/admin';
import { useToast } from '../../contexts/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  Users,
  Search,
  Shield,
  CheckCircle2,
  XCircle,
  UserCheck,
  UserX,
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { showToast } = useToast();

  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers({ query: search || undefined });
      if (res.data?.content) {
        setUsers(res.data.content);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleToggleStatus = async (user: AdminUserDto) => {
    try {
      const newStatus = !user.isActive;
      await adminApi.updateUserStatus(user.id, { isActive: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: newStatus } : u))
      );
      showToast(
        'success',
        'Status Changed',
        `User ${user.email} is now ${newStatus ? 'active' : 'suspended'}.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update user status.';
      showToast('error', 'Error', msg);
    }
  };

  const handleToggleAdminRole = async (user: AdminUserDto) => {
    try {
      const isAdmin = user.roles.includes('ROLE_ADMIN');
      const newRoles = isAdmin
        ? user.roles.filter((r) => r !== 'ROLE_ADMIN')
        : [...user.roles, 'ROLE_ADMIN'];

      await adminApi.updateUserRoles(user.id, { roles: newRoles });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, roles: newRoles } : u))
      );
      showToast('success', 'Role Updated', `Roles updated for ${user.email}.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update roles.';
      showToast('error', 'Error', msg);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            User Governance
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            View registered corporate employees, manage roles, and review onboarding progress.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search users by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-8 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No users found.</div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-corporate-800 bg-slate-50 dark:bg-corporate-900/50 text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Roles</th>
                  <th className="p-4 font-semibold">Onboarding</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-corporate-800">
                {users.map((u) => {
                  const isAdmin = u.roles.includes('ROLE_ADMIN');

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-corporate-800/40 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {u.fullName || 'User'}
                        </div>
                        <div className="text-slate-500 text-[11px]">{u.email}</div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {u.roles.map((r) => (
                            <Badge
                              key={r}
                              variant={r === 'ROLE_ADMIN' ? 'warning' : 'neutral'}
                              size="sm"
                            >
                              {r.replace('ROLE_', '')}
                            </Badge>
                          ))}
                        </div>
                      </td>

                      <td className="p-4">
                        {u.onboardingCompleted ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : (
                          <span className="text-slate-400">Pending</span>
                        )}
                      </td>

                      <td className="p-4">
                        <Badge variant={u.isActive ? 'success' : 'danger'} size="sm">
                          {u.isActive ? 'Active' : 'Suspended'}
                        </Badge>
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleAdminRole(u)}
                          className="text-[11px]"
                          leftIcon={<Shield className="w-3 h-3 text-purple-500" />}
                        >
                          {isAdmin ? 'Revoke Admin' : 'Make Admin'}
                        </Button>

                        <Button
                          variant={u.isActive ? 'ghost' : 'outline'}
                          size="sm"
                          onClick={() => handleToggleStatus(u)}
                          className={`text-[11px] ${
                            u.isActive ? 'text-rose-600 hover:text-rose-700' : 'text-emerald-600'
                          }`}
                        >
                          {u.isActive ? 'Suspend' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
