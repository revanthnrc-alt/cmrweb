import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Users, Trophy, Calendar, Search, ShieldAlert } from 'lucide-react';
import { SubmissionReview } from '../components/admin/SubmissionReview';
import { AuditLog } from '../components/admin/AuditLog';
import { UserManagement } from '../components/admin/UserManagement';
import { AdminLeaderboard } from '../components/admin/AdminLeaderboard';
import { cn } from '../lib/cn';

const TABS = [
  { id: 'submissions', label: 'Submissions Review', icon: ClipboardList },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'audit', label: 'Audit Log', icon: Search },
];

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('submissions');

  return (
    <div className="min-h-screen bg-bg-base pt-[72px]">
      {/* Desktop Sidebar */}
      <div className="fixed left-0 top-[72px] bottom-0 w-[240px] border-r border-border-subtle bg-bg-surface/50 backdrop-blur-md hidden md:flex flex-col py-6 z-40">
        <div className="px-6 mb-8">
          <h2 className="font-space text-lg font-bold text-text-primary flex items-center gap-2">
            <ShieldAlert size={20} className="text-accent-cyan" /> Admin Panel
          </h2>
        </div>
        
        <nav className="flex-1 px-3 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-accent-cyan/10 text-accent-cyan border-l-2 border-accent-cyan" 
                  : "text-text-secondary hover:bg-bg-hover hover:text-text-primary border-l-2 border-transparent"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 border-t border-border-subtle bg-bg-surface/90 backdrop-blur-md flex md:hidden justify-around items-center z-50 px-2 pb-safe">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
              activeTab === tab.id ? "text-accent-cyan" : "text-text-muted hover:text-text-secondary"
            )}
            aria-label={tab.label}
          >
            <tab.icon size={20} />
            <span className={cn("h-1.5 w-1.5 rounded-full", activeTab === tab.id ? "bg-accent-cyan" : "bg-transparent")} />
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="md:ml-[240px] p-4 md:p-8 pb-24 md:pb-8 min-h-[calc(100vh-72px)]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-space text-3xl font-bold text-text-primary">
              {TABS.find(t => t.id === activeTab)?.label}
            </h1>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'submissions' && <SubmissionReview />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'leaderboard' && <AdminLeaderboard />}
            {activeTab === 'audit' && <AuditLog />}
            {activeTab === 'events' && (
              <div className="flex items-center justify-center h-64 text-text-muted bg-bg-card rounded-xl border border-border-subtle">
                Event Management Coming Soon
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
