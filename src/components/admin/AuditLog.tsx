import React from 'react';
import { useQuery } from 'convex/react';
import { GlassCard } from '../ui/GlassCard';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { Badge } from '../ui/Badge';
import { api } from '../../../convex/_generated/api';

const ActionBadge = ({ action }: { action: string }) => {
  switch (action) {
    case 'SUBMISSION_APPROVED': return <Badge variant="green">APPROVED</Badge>;
    case 'SUBMISSION_REJECTED': return <Badge variant="gray">REJECTED</Badge>;
    case 'XP_AWARDED': return <Badge variant="amber">XP_AWARDED</Badge>;
    case 'USER_CREATED': return <Badge variant="cyan">USER_CREATED</Badge>;
    case 'ROLE_CHANGED': return <Badge variant="purple">ROLE_CHANGED</Badge>;
    default: return <Badge variant="gray">{action}</Badge>;
  }
};

export const AuditLog = () => {
  const log = useQuery(api.audit.getAuditLog, { limit: 100 });

  return (
    <GlassCard className="overflow-hidden">
      <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-bg-surface/50">
        <h3 className="font-space font-bold text-lg text-text-primary">System Audit Log</h3>
        <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan"></span>
          </span>
          Live Stream
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Admin/System</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {log === undefined ? (
            <TableRow>
              <TableCell colSpan={5}><div className="animate-pulse bg-white/5 rounded-lg h-24" /></TableCell>
            </TableRow>
          ) : (
            log.map((entry) => (
              <TableRow key={String(entry._id)}>
                <TableCell className="text-text-secondary" title={new Date(entry.createdAt).toISOString()}>
                  {new Date(entry.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="font-medium text-text-primary">{entry.adminName}</TableCell>
                <TableCell><ActionBadge action={entry.action} /></TableCell>
                <TableCell className="text-text-primary">{entry.targetName}</TableCell>
                <TableCell className="text-text-secondary text-sm">{entry.details}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </GlassCard>
  );
};
