import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { Badge } from '../ui/Badge';

// MOCK DATA
const MOCK_LOGS = [
  { id: '1', timestamp: '2 mins ago', exactTime: '2026-04-08T06:35:00Z', admin: 'Admin User', action: 'APPROVED', target: 'Arjun S. (Submission)', details: 'Awarded 500 XP for Distributed Cache' },
  { id: '2', timestamp: '15 mins ago', exactTime: '2026-04-08T06:22:00Z', admin: 'System', action: 'XP_AWARDED', target: 'Priya M.', details: 'Auto-awarded 50 XP for daily login' },
  { id: '3', timestamp: '1 hour ago', exactTime: '2026-04-08T05:30:00Z', admin: 'Admin User', action: 'REJECTED', target: 'Rahul T. (Submission)', details: 'Invalid GitHub URL provided' },
  { id: '4', timestamp: '3 hours ago', exactTime: '2026-04-08T03:30:00Z', admin: 'Admin User', action: 'ROLE_CHANGED', target: 'Sneha P.', details: 'Changed role from Member to Core' },
  { id: '5', timestamp: '1 day ago', exactTime: '2026-04-07T06:30:00Z', admin: 'System', action: 'USER_CREATED', target: 'Vikram D.', details: 'New user registration via Google Auth' },
];

const ActionBadge = ({ action }: { action: string }) => {
  switch (action) {
    case 'APPROVED': return <Badge variant="green">APPROVED</Badge>;
    case 'REJECTED': return <Badge variant="red">REJECTED</Badge>;
    case 'XP_AWARDED': return <Badge variant="amber">XP_AWARDED</Badge>;
    case 'USER_CREATED': return <Badge variant="cyan">USER_CREATED</Badge>;
    case 'ROLE_CHANGED': return <Badge variant="purple">ROLE_CHANGED</Badge>;
    default: return <Badge variant="gray">{action}</Badge>;
  }
};

export const AuditLog = () => {
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
          {MOCK_LOGS.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="text-text-secondary" title={log.exactTime}>
                {log.timestamp}
              </TableCell>
              <TableCell className="font-medium text-text-primary">{log.admin}</TableCell>
              <TableCell><ActionBadge action={log.action} /></TableCell>
              <TableCell className="text-text-primary">{log.target}</TableCell>
              <TableCell className="text-text-secondary text-sm">{log.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </GlassCard>
  );
};
