import React from 'react';
import { Download } from 'lucide-react';
import { useQuery } from 'convex/react';

import { GlassCard } from '../ui/GlassCard';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { api } from '../../../convex/_generated/api';

export const AdminLeaderboard = () => {
  const leaderboard = useQuery(api.users.getLeaderboard, { limit: 20 });

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
              <TableHead className="text-right">Streak</TableHead>
              <TableHead className="text-right">Tier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard === undefined ? (
              <TableRow>
                <TableCell colSpan={5}><div className="animate-pulse bg-white/5 rounded-lg h-24" /></TableCell>
              </TableRow>
            ) : leaderboard.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-text-muted">No leaderboard entries yet.</TableCell>
              </TableRow>
            ) : (
              leaderboard.map((entry, index) => {
                let borderClass = 'border-l-4 border-l-transparent';
                if (index === 0) borderClass = 'border-l-4 border-l-yellow-400';
                else if (index === 1) borderClass = 'border-l-4 border-l-gray-300';
                else if (index === 2) borderClass = 'border-l-4 border-l-amber-700';

                return (
                  <TableRow key={String(entry._id)} className={borderClass}>
                    <TableCell className="text-center font-space font-bold text-text-secondary">#{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center text-xs font-bold text-text-primary">
                          {entry.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-text-primary">{entry.name}</div>
                          <div className="text-xs text-text-muted">@{entry.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-space font-bold text-accent-cyan">
                      {entry.xp.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-text-secondary">
                      {entry.streakCount} days
                    </TableCell>
                    <TableCell className="text-right text-accent-green font-medium">
                      {entry.rank}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
};

export default AdminLeaderboard;
