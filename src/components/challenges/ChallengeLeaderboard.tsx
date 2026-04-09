import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'convex/react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { api } from '../../../convex/_generated/api';

export const ChallengeLeaderboard = ({ challengeId }: { challengeId: any }) => {
  const leaderboard = useQuery(api.challenges.getChallengeLeaderboard, challengeId ? { challengeId } : 'skip');
  const previousIdsRef = useRef<string[]>([]);
  const [freshIds, setFreshIds] = useState<string[]>([]);

  useEffect(() => {
    if (!leaderboard?.length) return;
    const currentIds = leaderboard.map((entry) => String(entry.submissionId));
    const previousIds = previousIdsRef.current;
    if (previousIds.length > 0) {
      const incoming = currentIds.filter((id) => !previousIds.includes(id));
      if (incoming.length > 0) {
        previousIdsRef.current = currentIds;
        setFreshIds((current) => [...current, ...incoming]);
        const timeout = window.setTimeout(() => {
          setFreshIds((current) => current.filter((id) => !incoming.includes(id)));
        }, 3000);
        return () => clearTimeout(timeout);
      }
    }
    previousIdsRef.current = currentIds;
  }, [leaderboard]);

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
          {leaderboard === undefined ? (
            <TableRow>
              <TableCell colSpan={4}><div className="animate-pulse bg-white/5 rounded-lg h-24" /></TableCell>
            </TableRow>
          ) : leaderboard.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-text-muted py-8">No approved submissions yet.</TableCell>
            </TableRow>
          ) : (
            leaderboard.map((entry, index) => {
              let borderClass = 'border-l-4 border-l-transparent';
              if (index === 0) borderClass = 'border-l-4 border-l-amber-400';
              else if (index === 1) borderClass = 'border-l-4 border-l-gray-300';
              else if (index === 2) borderClass = 'border-l-4 border-l-orange-500';

              return (
                <TableRow
                  key={String(entry.submissionId)}
                  className={`${borderClass} ${freshIds.includes(String(entry.submissionId)) ? 'bg-accent-amber/10 transition-colors' : ''}`}
                  style={freshIds.includes(String(entry.submissionId)) ? { transitionDuration: '3000ms' } : undefined}
                >
                  <TableCell className="text-center font-space font-bold text-text-secondary">
                    #{index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center text-xs font-bold text-text-primary">
                        {entry.user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-text-primary">{entry.user.name}</span>
                      {freshIds.includes(String(entry.submissionId)) && <Badge variant="amber">⚡ Just now</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-space font-bold text-accent-cyan">
                    {entry.score}
                  </TableCell>
                  <TableCell className="text-right text-text-muted text-sm">
                    {new Date(entry.submittedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </GlassCard>
  );
};
