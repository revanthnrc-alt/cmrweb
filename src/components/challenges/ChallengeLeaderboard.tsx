import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../ui/GlassCard';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';

// MOCK DATA
const MOCK_LEADERBOARD = [
  { id: '1', rank: 1, name: 'Arjun S.', avatar: 'AS', score: 100, time: '2 hours ago' },
  { id: '2', rank: 2, name: 'Priya M.', avatar: 'PM', score: 95, time: '5 hours ago' },
  { id: '3', rank: 3, name: 'Rahul T.', avatar: 'RT', score: 88, time: '1 day ago' },
  { id: '4', rank: 4, name: 'Sneha P.', avatar: 'SP', score: 85, time: '2 days ago' },
  { id: '5', rank: 5, name: 'Vikram D.', avatar: 'VD', score: 70, time: '2 days ago' },
];

export const ChallengeLeaderboard = () => {
  return (
    <GlassCard className="mt-8 overflow-hidden">
      <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-bg-surface/50">
        <h3 className="font-space font-bold text-lg text-text-primary">Live Leaderboard</h3>
        <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
          </span>
          Updates live
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">Rank</TableHead>
            <TableHead>Builder</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="text-right">Submitted</TableHead>
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
                  {entry.score}
                </TableCell>
                <TableCell className="text-right text-text-muted text-sm">
                  {entry.time}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </GlassCard>
  );
};
