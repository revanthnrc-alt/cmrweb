import React, { useMemo, useState } from 'react';
import { Search, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from 'convex/react';
import { GlassCard } from '../ui/GlassCard';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { api } from '../../../convex/_generated/api';

export const UserManagement = () => {
  const users = useQuery(api.users.getAllUsers);
  const updateRole = useMutation(api.users.updateUserRole);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isUpdatingUserId, setIsUpdatingUserId] = useState<string | null>(null);
  const { showToast } = useToast();

  const filteredUsers = useMemo(() => {
    const source = users ?? [];
    return source.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [roleFilter, search, users]);

  const handleMakeAdmin = async (userId: any) => {
    if (!window.confirm('Are you sure you want to make this user an admin? They will have full access to the dashboard.')) {
      return;
    }

    setIsUpdatingUserId(String(userId));
    try {
      await updateRole({ userId, role: 'admin' });
      showToast('Role updated', 'success');
    } catch (err: any) {
      showToast(err?.message ?? 'Could not update role', 'error');
    } finally {
      setIsUpdatingUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-surface border border-border-subtle rounded-lg py-2 pl-10 pr-4 text-text-primary focus:outline-none focus:border-accent-cyan"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-bg-surface border border-border-subtle rounded-lg py-2 px-4 text-text-primary focus:outline-none focus:border-accent-cyan"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admins</option>
          <option value="member">Members</option>
        </select>
      </div>

      <GlassCard className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rank / XP</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users === undefined ? (
              <TableRow>
                <TableCell colSpan={6}><div className="animate-pulse bg-white/5 rounded-lg h-24" /></TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={String(user._id)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center text-xs font-bold text-text-primary">
                        {user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-text-primary">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-text-secondary">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-text-primary font-medium">{user.rank}</span>
                      <span className="text-xs text-accent-cyan font-space">{user.xp} XP</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'purple' : 'gray'}>
                      {user.role.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-text-secondary text-sm">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => void handleMakeAdmin(user._id)}
                          disabled={isUpdatingUserId === String(user._id)}
                          className="text-xs font-medium text-accent-amber hover:underline flex items-center gap-1 disabled:opacity-60"
                        >
                          {isUpdatingUserId === String(user._id) ? (
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border border-accent-amber/30 border-t-accent-amber" />
                          ) : (
                            <ShieldAlert size={12} />
                          )}
                          {isUpdatingUserId === String(user._id) ? 'Updating...' : 'Make Admin'}
                        </button>
                      )}
                      <Link to={`/profile/${String(user._id)}`} className="text-xs font-medium text-accent-cyan hover:underline">
                        View Profile
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
};
