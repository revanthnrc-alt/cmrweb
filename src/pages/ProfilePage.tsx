import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, MapPin, Link as LinkIcon, Calendar, Edit3, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { format, subMonths } from 'date-fns';

import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';

import { ActivityHeatmap } from '../components/profile/ActivityHeatmap';
import { XPLineChart } from '../components/profile/XPLineChart';
import { SkillRadar } from '../components/profile/SkillRadar';
import { NextBestActionWidget } from '../components/profile/NextBestActionWidget';
import { RankBadge, RankTier } from '../components/profile/RankBadge';

// MOCK DATA
const MOCK_USER = {
  id: 'u123',
  name: 'Arjun S.',
  username: '@arjun_codes',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
  joinDate: '2025-09-15',
  location: 'Bangalore, India',
  website: 'arjun.dev',
  bio: 'Full-stack developer passionate about AI and distributed systems. Building the future of web3.',
  rank: 'Elite' as RankTier,
  xp: 4820,
  nextRankXP: 5000,
  streak: 14,
};

const MOCK_HEATMAP = []; // Will use auto-generated in component

const MOCK_XP_DATA = Array.from({ length: 12 }).map((_, i) => ({
  month: format(subMonths(new Date(), 11 - i), 'MMM'),
  xp: Math.floor(1000 + Math.random() * 4000 + (i * 300)),
}));

const MOCK_SKILLS = [
  { skill: 'Frontend', value: 85 },
  { skill: 'Backend', value: 70 },
  { skill: 'AI/ML', value: 45 },
  { skill: 'DevOps', value: 60 },
  { skill: 'Design', value: 75 },
  { skill: 'Algorithms', value: 80 },
];

const MOCK_CHALLENGES = [
  { id: 'c1', title: 'Build a Distributed Cache', category: 'Backend', score: 95, status: 'approved', date: '2026-04-05' },
  { id: 'c2', title: 'Implement OAuth2 Flow', category: 'Security', score: 88, status: 'approved', date: '2026-03-28' },
  { id: 'c3', title: 'React Performance Audit', category: 'Frontend', score: 0, status: 'pending', date: '2026-04-07' },
  { id: 'c4', title: 'Design System Setup', category: 'Design', score: 70, status: 'rejected', date: '2026-03-15' },
];

const MOCK_PROJECTS = [
  { id: 'p1', title: 'Nexus AI Code Reviewer', gradient: 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20', tech: ['React', 'Python', 'OpenAI'], stars: 128 },
  { id: 'p2', title: 'Campus Event Tracker', gradient: 'bg-gradient-to-br from-amber-500/20 to-orange-600/20', tech: ['Next.js', 'Convex', 'Tailwind'], stars: 84 },
  { id: 'p3', title: 'Decentralized Voting App', gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-600/20', tech: ['Solidity', 'React', 'Ethers.js'], stars: 256 },
];

const MOCK_ACTIVITY = [
  { id: 'a1', type: 'challenge', title: 'Completed "Build a Distributed Cache"', xp: '+250 XP', date: '2 days ago' },
  { id: 'a2', type: 'event', title: 'Attended "Advanced UI/UX Workshop"', xp: '+100 XP', date: '1 week ago' },
  { id: 'a3', type: 'streak', title: 'Hit 10-day streak!', xp: '+50 XP', date: '2 weeks ago' },
];

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'approved': return <Badge variant="green" className="flex gap-1 items-center"><CheckCircle2 size={12}/> Approved</Badge>;
    case 'pending': return <Badge variant="amber" className="flex gap-1 items-center"><Clock size={12}/> Pending</Badge>;
    case 'rejected': return <Badge variant="gray" className="flex gap-1 items-center"><XCircle size={12}/> Needs Work</Badge>;
    default: return null;
  }
};

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen pb-20">
      {/* Top Section */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-64 w-full bg-gradient-to-r from-bg-surface via-accent-cyan/10 to-bg-surface border-b border-border-subtle relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 mb-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-bg-base bg-bg-surface overflow-hidden ring-2 ring-accent-cyan/50 ring-offset-4 ring-offset-bg-base">
                <img src={MOCK_USER.avatar} alt={MOCK_USER.name} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-grow space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-space text-3xl md:text-4xl font-bold text-text-primary">{MOCK_USER.name}</h1>
                  <p className="text-accent-cyan font-medium">{MOCK_USER.username}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-bg-surface border border-border-subtle text-text-primary hover:bg-bg-hover transition-colors text-sm font-medium">
                  <Edit3 size={16} /> Edit Profile
                </button>
              </div>

              <p className="text-text-secondary max-w-2xl">{MOCK_USER.bio}</p>

              <div className="flex flex-wrap gap-4 text-sm text-text-muted pt-2">
                <span className="flex items-center gap-1"><MapPin size={14} /> {MOCK_USER.location}</span>
                <span className="flex items-center gap-1"><LinkIcon size={14} /> <a href={`https://${MOCK_USER.website}`} className="hover:text-accent-cyan transition-colors">{MOCK_USER.website}</a></span>
                <span className="flex items-center gap-1"><Calendar size={14} /> Joined {format(new Date(MOCK_USER.joinDate), 'MMMM yyyy')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="overview" className="mt-0 outline-none">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column */}
                  <div className="lg:col-span-3 space-y-6">
                    <GlassCard className="p-6">
                      <RankBadge 
                        rank={MOCK_USER.rank} 
                        xp={MOCK_USER.xp} 
                        nextRankXP={MOCK_USER.nextRankXP} 
                      />
                    </GlassCard>

                    <GlassCard className="p-6 space-y-4">
                      <h3 className="font-space font-bold text-lg">Skill Graph</h3>
                      <SkillRadar data={MOCK_SKILLS} />
                    </GlassCard>

                    <GlassCard className="p-6 space-y-4">
                      <h3 className="font-space font-bold text-lg">XP Growth</h3>
                      <XPLineChart data={MOCK_XP_DATA} />
                    </GlassCard>
                  </div>

                  {/* Center Column */}
                  <div className="lg:col-span-6 space-y-6">
                    <GlassCard className="p-6 space-y-4">
                      <h3 className="font-space font-bold text-lg">Activity Heatmap</h3>
                      <ActivityHeatmap data={MOCK_HEATMAP} />
                    </GlassCard>

                    <GlassCard className="p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-space font-bold text-lg">Recent Challenges</h3>
                        <button className="text-accent-cyan text-sm hover:underline" onClick={() => setActiveTab('challenges')}>View All</button>
                      </div>
                      <div className="space-y-3">
                        {MOCK_CHALLENGES.slice(0, 3).map(challenge => (
                          <div key={challenge.id} className="flex items-center justify-between p-3 rounded-md bg-bg-surface border border-border-subtle hover:border-border-accent transition-colors">
                            <div>
                              <p className="font-medium text-text-primary">{challenge.title}</p>
                              <p className="text-xs text-text-muted">{challenge.category} • {format(new Date(challenge.date), 'MMM d, yyyy')}</p>
                            </div>
                            <StatusBadge status={challenge.status} />
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>

                  {/* Right Column */}
                  <div className="lg:col-span-3 space-y-6">
                    <GlassCard className="p-6 flex items-center gap-4 relative overflow-hidden">
                      <div className={cn(
                        "text-4xl relative z-10",
                        MOCK_USER.streak > 7 && "drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                      )}>
                        🔥
                      </div>
                      <div className="relative z-10">
                        <div className="font-space text-2xl font-bold text-text-primary">{MOCK_USER.streak} Day</div>
                        <div className="text-sm text-text-secondary uppercase tracking-wider font-medium">Streak</div>
                      </div>
                      {MOCK_USER.streak > 7 && (
                        <motion.div 
                          animate={{ opacity: [0.1, 0.3, 0.1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-gradient-to-r from-accent-amber/20 to-transparent pointer-events-none"
                        />
                      )}
                    </GlassCard>

                    <NextBestActionWidget 
                      action="Submit a Medium Full-Stack Challenge"
                      xpGain="+250 XP"
                      rankUnlock="Unlocks Legend rank"
                    />

                    <GlassCard className="p-6 space-y-4">
                      <h3 className="font-space font-bold text-lg">Stats Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-text-secondary">Global Rank</span>
                          <span className="font-bold text-text-primary">#42</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-secondary">Challenges Won</span>
                          <span className="font-bold text-text-primary">18</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-secondary">Events Attended</span>
                          <span className="font-bold text-text-primary">7</span>
                        </div>
                      </div>
                    </GlassCard>
                  </div>

                </div>
              </TabsContent>

              <TabsContent value="challenges" className="mt-0 outline-none">
                <GlassCard className="p-6">
                  <h3 className="font-space font-bold text-xl mb-6">Challenge History</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Challenge</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_CHALLENGES.map((challenge) => (
                        <TableRow key={challenge.id}>
                          <TableCell className="font-medium text-text-primary">{challenge.title}</TableCell>
                          <TableCell><Badge variant="gray">{challenge.category}</Badge></TableCell>
                          <TableCell className="text-text-secondary">{format(new Date(challenge.date), 'MMM d, yyyy')}</TableCell>
                          <TableCell className="font-space font-medium">{challenge.score > 0 ? challenge.score : '-'}</TableCell>
                          <TableCell><StatusBadge status={challenge.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </GlassCard>
              </TabsContent>

              <TabsContent value="projects" className="mt-0 outline-none">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MOCK_PROJECTS.map((project, i) => (
                    <motion.div 
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <GlassCard hover className="overflow-hidden flex flex-col h-full">
                        <div className={`h-40 w-full ${project.gradient} relative`}>
                          <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
                        </div>
                        <div className="p-6 flex flex-col flex-grow gap-4 -mt-10 relative z-10">
                          <h3 className="font-bold text-xl text-text-primary">{project.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {project.tech.map(t => (
                              <Badge key={t} variant="gray">{t}</Badge>
                            ))}
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="mt-0 outline-none">
                <GlassCard className="p-6 max-w-3xl">
                  <h3 className="font-space font-bold text-xl mb-8">Activity Timeline</h3>
                  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-subtle before:to-transparent">
                    {MOCK_ACTIVITY.map((activity, i) => (
                      <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border-subtle bg-bg-surface text-accent-cyan shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          {activity.type === 'challenge' && <CheckCircle2 size={18} />}
                          {activity.type === 'event' && <Calendar size={18} />}
                          {activity.type === 'streak' && <Flame size={18} />}
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-md border border-border-subtle bg-bg-surface/50 shadow">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-text-primary text-sm">{activity.title}</h4>
                            <span className="text-xs font-medium text-accent-green">{activity.xp}</span>
                          </div>
                          <time className="text-xs text-text-muted">{activity.date}</time>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </TabsContent>

            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
};
