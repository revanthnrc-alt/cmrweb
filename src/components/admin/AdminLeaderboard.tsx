import React from 'react';
import { Download } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';

// MOCK DATA
const MOCK_LEADERBOARD = [
  { id: '1', rank: 1, name: 'Arjun S.', avatar: 'AS', xp: 12500, lastActive: '2 hours ago', submissions: 45, approvalRate: '98%' },
  { id: '2', rank: 2, name: 'Priya M.', avatar: 'PM', xp: 11200, lastActive: '5 hours ago', submissions: 42, approvalRate: '95%' },
  { id: '3', rank: 3, name: 'Kiran R.', avatar: 'KR', xp: 8900, lastActive: '1 day ago', submissions: 30, approvalRate: '90%' },
  { id: '4', rank: 4, name: 'Rahul T.', avatar: 'RT', xp: 8500, lastActive: '2 days ago', submissions: 28, approvalRate: '85%' },
  { id: '5', rank: 5, name: 'Sneha P.', avatar: 'SP', xp: 8200, lastActive: '1 week ago', submissions: 25, approvalRate: '100%' },
];

export const AdminLeaderboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border-subtle rounded-md text-sm font-medium text-text-primary hover:border-accent-cyan transition-colors">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <GlassCard className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">Rank</TableHead>
              <TableHead>Member</TableHead>
              <TableHead className="text-right">Total XP</TableHead>
              <TableHead className="text-right">Last Active</TableHead>
              <TableHead className="text-right">Submissions</TableHead>
              <TableHead className="text-right">Approval Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_LEADERBOARD.map((entry) => {
              let borderClass = '';
              if (entry.rank === 1) borderClass = 'border-l-4 border-l-yellow-400';
              else if (entry.rank === 2) borderClass = 'border-l-4 border-l-gray-300';
              else if (entry.rank === 3) borderClass = 'border-l-4 border-l-amber-700';
              else borderClass = 'border-l-4 border-l-transparent';

              return (
                <TableRow key={entry.id} className={borderClass}>
                  <TableCell className="text-center font-space font-bold text-text-secondary">
                    #{entry.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center text-xs font-bold text-text-primary">
                        {entry.avatar}
                      </div>
                      <span className="font-medium text-text-primary">{entry.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-space font-bold text-accent-cyan">
                    {entry.xp.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-text-muted text-sm">
                    {entry.lastActive}
                  </TableCell>
                  <TableCell className="text-right text-text-secondary">
                    {entry.submissions}
                  </TableCell>
                  <TableCell className="text-right text-accent-green font-medium">
                    {entry.approvalRate}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
};
