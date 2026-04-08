import React, { useState } from 'react';
import { Search, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { Badge } from '../ui/Badge';

// MOCK DATA
const MOCK_USERS = [
  { id: 'u1', name: 'Arjun S.', avatar: 'AS', email: 'arjun@college.edu', rank: 'Legend', xp: 12500, role: 'admin', joined: '2025-08-15' },
  { id: 'u2', name: 'Priya M.', avatar: 'PM', email: 'priya@college.edu', rank: 'Expert', xp: 11200, role: 'admin', joined: '2025-08-16' },
  { id: 'u3', name: 'Kiran R.', avatar: 'KR', email: 'kiran@college.edu', rank: 'Pro', xp: 8900, role: 'member', joined: '2025-09-01' },
  { id: 'u4', name: 'Rahul T.', avatar: 'RT', email: 'rahul@college.edu', rank: 'Pro', xp: 8500, role: 'member', joined: '2025-09-10' },
  { id: 'u5', name: 'Sneha P.', avatar: 'SP', email: 'sneha@college.edu', rank: 'Intermediate', xp: 4200, role: 'member', joined: '2026-01-05' },
];

export const UserManagement = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleMakeAdmin = (id: string) => {
    if (window.confirm('Are you sure you want to make this user an admin? They will have full access to the dashboard.')) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: 'admin' } : u));
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
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center text-xs font-bold text-text-primary">
                      {user.avatar}
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
                <TableCell className="text-text-secondary text-sm">{new Date(user.joined).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => handleMakeAdmin(user.id)}
                        className="text-xs font-medium text-accent-amber hover:underline flex items-center gap-1"
                      >
                        <ShieldAlert size={12} /> Make Admin
                      </button>
                    )}
                    <Link to={`/profile/${user.id}`} className="text-xs font-medium text-accent-cyan hover:underline">
                      View Profile
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
};
